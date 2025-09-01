import { API_URL } from '../utils/apiUrl';
import { useState, useEffect, useRef } from 'react';
import useAreas from '../hooks/useAreas';
import ErrorPopup from './ErrorPopup';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import { Controller, useForm } from 'react-hook-form';
import Logger from '../utils/logger';

const normalizeToNull = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  const normalized = {};
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      normalized[key] = obj[key].length === 0 ? null : obj[key];
    } else if (obj[key] === '' || obj[key] === undefined) {
      normalized[key] = null;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      normalized[key] = normalizeToNull(obj[key]);
    } else {
      normalized[key] = obj[key];
    }
  }
  return normalized;
};

function FiltroEventosPeriodicos({
  onResultados,
  onFiltrosChange,
  onFiltrosAtivosChange,
}) {
  const [open, setOpen] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });
  const [allEventos, setAllEventos] = useState([]);
  const [allPeriodicos, setAllPeriodicos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState([]);
  const areas = useAreas();
  const { control, register, handleSubmit, watch, setValue, reset } = useForm();
  const minimalClassification = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'A3', label: 'A3' },
    { value: 'A4', label: 'A4' },
    { value: 'A5', label: 'A5' },
    { value: 'A6', label: 'A6' },
    { value: 'A7', label: 'A7' },
    { value: 'A8', label: 'A8' },
  ];

  const filtrosDisponiveis = [
    { value: 'tipoVeiculo', label: 'Tipo de Veículo' },
    { value: 'areasPesquisa', label: 'Área de Conhecimento' },
    { value: 'vinculoSBC', label: 'Vínculo com SBC' },
    { value: 'adequacaoDefesas', label: 'Adequação para Defesas' },
    { value: 'h5Minimo', label: 'H5 Mínimo' },
    { value: 'classificacaoMinima', label: 'Classificação Mínima' },
  ];

  const adequacaoDefesasOpcoes = [
    { value: 'qualquer', label: 'Qualquer' },
    { value: 'mestradoEDoutorado', label: 'Mestrado e Doutorado' },
    { value: 'mestradoOuAcima', label: 'Mestrado ou Acima' },
    { value: 'apenasMestrado', label: 'Apenas Mestrado' },
    { value: 'nenhum', label: 'Nenhum' },
  ];

  const vinculoSbcOpcoes = [
    { value: 'ambos', label: 'Ambos' },
    { value: 'semVinculo', label: 'Sem Vínculo' },
    { value: 'comVinculo', label: 'Com Vínculo (inclui Comum, Top10 e Top20)' },
    { value: 'top20OuTop10', label: 'Top20 ou Top10 (inclui Top10 e Top20)' },
    { value: 'somenteTop20', label: 'Somente Top20' },
    { value: 'somenteTop10', label: 'Somente Top10' },
    { value: 'somenteComum', label: 'Somente Comum' },
  ];

  const watchedValues = watch();
  const previousValues = useRef();

  useEffect(() => {
    if (onFiltrosChange) {
      const currentValues = JSON.stringify(watchedValues);
      const prevValues = JSON.stringify(previousValues.current);
      if (currentValues !== prevValues) {
        onFiltrosChange(watchedValues);
        previousValues.current = watchedValues;
      }
    }
  }, [watchedValues, onFiltrosChange]);

  // Carrega todos os dados uma única vez no início
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const eventosUrl = `${API_URL}/api/eventos/listar`;
      const periodicosUrl = `${API_URL}/api/periodicos/listar`;

      try {
        const [eventosRes, periodicosRes] = await Promise.all([
          fetch(eventosUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }),
          fetch(periodicosUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }),
        ]);

        if (eventosRes.ok) {
          const eventosData = await eventosRes.json();
          setAllEventos(Array.isArray(eventosData) ? eventosData : []);
        }
        if (periodicosRes.ok) {
          const periodicosData = await periodicosRes.json();
          setAllPeriodicos(Array.isArray(periodicosData) ? periodicosData : []);
        }
      } catch (err) {
        setErrorInfo({
          title: 'Erro no Servidor',
          message: 'Não foi possível carregar os dados iniciais.',
          type: 'error',
        });
        setShowErrorPopup(true);
        Logger.logError(`Erro ao carregar dados iniciais: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Função para filtrar dados no frontend
  const filterData = (data, normalizedData) => {
    return data.filter(item => {
      // Verifica se correspondência exata está ativada
      const correspondenciaExata =
        Array.isArray(normalizedData.modoCombinacao) &&
        normalizedData.modoCombinacao.includes('correspondenciaExata');

      // Filtro por nome (sempre ativo) - usa correspondência exata apenas para o nome
      if (normalizedData.nome) {
        const nomeMatch = correspondenciaExata
          ? item.nome.toLowerCase() === normalizedData.nome.toLowerCase()
          : item.nome.toLowerCase().includes(normalizedData.nome.toLowerCase());
        if (!nomeMatch) return false;
      }

      // Se não há filtros ativos além do nome, retorna true
      const filtrosAtivosAplicaveis = filtrosAtivos.filter(
        filtro => filtro !== 'tipoVeiculo'
      );
      if (filtrosAtivosAplicaveis.length === 0) return true;

      // Array para armazenar resultados dos filtros individuais
      const resultadosFiltros = [];

      // Filtro por área de pesquisa (apenas se ativo)
      if (
        filtrosAtivos.includes('areasPesquisa') &&
        normalizedData.areasPesquisaIds &&
        normalizedData.areasPesquisaIds.length > 0 &&
        Array.isArray(areas)
      ) {
        const areasPesquisaNomes = normalizedData.areasPesquisaIds
          .map(id => {
            const area = areas.find(a => a.value === id);
            return area ? area.label : null;
          })
          .filter(Boolean);

        const itemAreas = Array.isArray(item.areaPesquisa)
          ? item.areaPesquisa
          : [item.areaPesquisa];
        const hasMatchingArea = areasPesquisaNomes.some(filterArea =>
          itemAreas.some(
            itemArea =>
              itemArea &&
              itemArea.toLowerCase().includes(filterArea.toLowerCase())
          )
        );
        resultadosFiltros.push(hasMatchingArea);
      }

      // Filtro por vínculo SBC (apenas se ativo)
      if (
        filtrosAtivos.includes('vinculoSBC') &&
        normalizedData.vinculoSbc &&
        normalizedData.vinculoSbc !== 'ambos'
      ) {
        const itemVinculo = item.vinculoSBC;
        const filtroVinculo = normalizedData.vinculoSbc;
        let vinculoMatch = false;

        switch (filtroVinculo) {
          case 'semVinculo':
            vinculoMatch =
              itemVinculo === 'sem_vinculo' ||
              itemVinculo === null ||
              itemVinculo === undefined ||
              itemVinculo === '';
            break;
          case 'comVinculo':
            vinculoMatch =
              itemVinculo === 'vinculo_comum' ||
              itemVinculo === 'vinculo_top_10' ||
              itemVinculo === 'vinculo_top_20';
            break;
          case 'top20OuTop10':
            vinculoMatch =
              itemVinculo === 'vinculo_top_10' ||
              itemVinculo === 'vinculo_top_20';
            break;
          case 'somenteTop20':
            vinculoMatch = itemVinculo === 'vinculo_top_20';
            break;
          case 'somenteTop10':
            vinculoMatch = itemVinculo === 'vinculo_top_10';
            break;
          case 'somenteComum':
            vinculoMatch =
              itemVinculo === 'vinculo_comum' ||
              itemVinculo === 'vinculo_top_10' ||
              itemVinculo === 'vinculo_top_20' ||
              itemVinculo === null ||
              itemVinculo === undefined ||
              itemVinculo === '' ||
              itemVinculo === 'comum' ||
              itemVinculo === 'COMUM' ||
              itemVinculo === 'Comum';
            break;
          default:
            vinculoMatch = true;
            break;
        }
        resultadosFiltros.push(vinculoMatch);
      }

      // Filtro por adequação para defesas (apenas se ativo)
      if (
        filtrosAtivos.includes('adequacaoDefesas') &&
        normalizedData.adequacaoDefesa &&
        normalizedData.adequacaoDefesa !== 'qualquer'
      ) {
        const itemAdequacao = item.adequacaoDefesa;
        const filtroAdequacao = normalizedData.adequacaoDefesa;
        let adequacaoMatch = false;

        switch (filtroAdequacao) {
          case 'mestradoEDoutorado':
            adequacaoMatch =
              itemAdequacao === 'mestrado_doutorado' ||
              itemAdequacao === 'doutorado';
            break;
          case 'mestradoOuAcima':
            adequacaoMatch =
              itemAdequacao === 'mestrado' ||
              itemAdequacao === 'doutorado' ||
              itemAdequacao === 'mestrado_doutorado';
            break;
          case 'apenasMestrado':
            adequacaoMatch = itemAdequacao === 'mestrado';
            break;
          case 'nenhum':
            adequacaoMatch = !(
              itemAdequacao === 'mestrado' ||
              itemAdequacao === 'doutorado' ||
              itemAdequacao === 'mestrado_doutorado'
            );
            break;
          default:
            adequacaoMatch = true;
            break;
        }
        resultadosFiltros.push(adequacaoMatch);
      }

      // Filtro por H5 mínimo (apenas se ativo)
      if (
        filtrosAtivos.includes('h5Minimo') &&
        normalizedData.h5Minimo !== undefined &&
        normalizedData.h5Minimo !== null &&
        normalizedData.h5Minimo !== '' &&
        normalizedData.h5Minimo > 0
      ) {
        const itemH5 =
          item.h5 ||
          Math.max(item.percentilJcr || 0, item.percentilScopus || 0);
        const h5Match = itemH5 >= normalizedData.h5Minimo;
        resultadosFiltros.push(h5Match);
      }

      // Filtro por classificação mínima (apenas se ativo)
      if (
        filtrosAtivos.includes('classificacaoMinima') &&
        normalizedData.classificacaoMinima
      ) {
        const classificacaoOrdem = {
          a1: 8,
          a2: 7,
          a3: 6,
          a4: 5,
          a5: 4,
          a6: 3,
          a7: 2,
          a8: 1,
        };
        const minima =
          classificacaoOrdem[normalizedData.classificacaoMinima.toLowerCase()];
        const itemClassificacao =
          classificacaoOrdem[item.classificacao?.toLowerCase()];
        const classificacaoMatch =
          itemClassificacao && itemClassificacao >= minima;
        resultadosFiltros.push(classificacaoMatch);
      }

      // Se não há filtros para avaliar, retorna true
      if (resultadosFiltros.length === 0) return true;

      // Aplica lógica AND ou OR baseada na correspondência exata
      return correspondenciaExata
        ? resultadosFiltros.every(resultado => resultado) // AND - todos devem ser verdadeiros
        : resultadosFiltros.some(resultado => resultado); // OR - pelo menos um deve ser verdadeiro
    });
  };

  // Função específica para filtrar periódicos (excluir quando filtros Top10/Top20)
  const filterPeriodicos = (data, normalizedData) => {
    // Se o filtro de vínculo for Top10, Top20 ou Top20OuTop10, não mostra periódicos
    if (
      filtrosAtivos.includes('vinculoSBC') &&
      normalizedData.vinculoSbc &&
      (normalizedData.vinculoSbc === 'somenteTop10' ||
        normalizedData.vinculoSbc === 'somenteTop20' ||
        normalizedData.vinculoSbc === 'top20OuTop10')
    ) {
      return []; // Retorna lista vazia - periódicos não têm vínculos Top10/Top20
    }

    // Para "somenteComum", filtra de forma mais inclusiva para periódicos
    if (
      filtrosAtivos.includes('vinculoSBC') &&
      normalizedData.vinculoSbc === 'somenteComum'
    ) {
      console.log('=== DEBUG FILTRO SOMENTE COMUM PARA PERIÓDICOS ===');
      console.log('Total de periódicos antes do filtro:', data.length);

      const resultado = data.filter(item => {
        // Debug: informações do item
        const itemVinculo = item.vinculoSBC;
        const passouVinculo =
          itemVinculo === 'vinculo_comum' ||
          itemVinculo === 'vinculo_top_10' ||
          itemVinculo === 'vinculo_top_20' ||
          itemVinculo === null ||
          itemVinculo === undefined ||
          itemVinculo === '';

        // Aplica outros filtros primeiro (nome, área, etc.)
        const passouOutrosFiltros = filterDataSingle(item, normalizedData);

        const passou = passouOutrosFiltros && passouVinculo;

        // Log todos os itens para debug completo
        console.log('Item:', {
          nome: item.nome,
          vinculo: itemVinculo,
          passouVinculo,
          passouOutrosFiltros,
          passou,
          // Detalhes dos outros filtros
          nomeFilter: normalizedData.nome,
          areasFilter: normalizedData.areasPesquisaIds,
          adequacaoFilter: normalizedData.adequacaoDefesa,
          h5Filter: normalizedData.h5Minimo,
          classificacaoFilter: normalizedData.classificacaoMinima,
        });

        return passou;
      });

      console.log('Total de periódicos após filtro:', resultado.length);
      console.log('=== FIM DEBUG ===');

      return resultado;
    }

    // Para outros filtros, usa a lógica normal
    return filterData(data, normalizedData);
  };

  // Função auxiliar extraída para reutilização (SEM filtro de vínculo SBC)
  const filterDataSingle = (item, normalizedData) => {
    // Verifica se correspondência exata está ativada
    const correspondenciaExata =
      Array.isArray(normalizedData.modoCombinacao) &&
      normalizedData.modoCombinacao.includes('correspondenciaExata');

    // Filtro por nome (sempre ativo) - usa correspondência exata apenas para o nome
    if (normalizedData.nome) {
      const nomeMatch = correspondenciaExata
        ? item.nome.toLowerCase() === normalizedData.nome.toLowerCase()
        : item.nome.toLowerCase().includes(normalizedData.nome.toLowerCase());
      if (!nomeMatch) return false;
    }

    // Se não há filtros ativos além do nome (excluindo tipoVeiculo e vinculoSBC), retorna true
    const filtrosAtivosAplicaveis = filtrosAtivos.filter(
      filtro => filtro !== 'tipoVeiculo' && filtro !== 'vinculoSBC'
    );
    if (filtrosAtivosAplicaveis.length === 0) return true;

    // Array para armazenar resultados dos filtros individuais
    const resultadosFiltros = [];

    // Filtro por área de pesquisa (apenas se ativo)
    if (
      filtrosAtivos.includes('areasPesquisa') &&
      normalizedData.areasPesquisaIds &&
      normalizedData.areasPesquisaIds.length > 0 &&
      Array.isArray(areas)
    ) {
      const areasPesquisaNomes = normalizedData.areasPesquisaIds
        .map(id => {
          const area = areas.find(a => a.value === id);
          return area ? area.label : null;
        })
        .filter(Boolean);

      const itemAreas = Array.isArray(item.areaPesquisa)
        ? item.areaPesquisa
        : [item.areaPesquisa];
      const hasMatchingArea = areasPesquisaNomes.some(filterArea =>
        itemAreas.some(
          itemArea =>
            itemArea &&
            itemArea.toLowerCase().includes(filterArea.toLowerCase())
        )
      );
      resultadosFiltros.push(hasMatchingArea);
    }

    // Filtro por adequação para defesas (apenas se ativo)
    if (
      filtrosAtivos.includes('adequacaoDefesas') &&
      normalizedData.adequacaoDefesa &&
      normalizedData.adequacaoDefesa !== 'qualquer'
    ) {
      const itemAdequacao = item.adequacaoDefesa;
      const filtroAdequacao = normalizedData.adequacaoDefesa;
      let adequacaoMatch = false;

      switch (filtroAdequacao) {
        case 'mestradoEDoutorado':
          adequacaoMatch =
            itemAdequacao === 'mestrado_doutorado' ||
            itemAdequacao === 'doutorado';
          break;
        case 'mestradoOuAcima':
          adequacaoMatch =
            itemAdequacao === 'mestrado' ||
            itemAdequacao === 'doutorado' ||
            itemAdequacao === 'mestrado_doutorado';
          break;
        case 'apenasMestrado':
          adequacaoMatch = itemAdequacao === 'mestrado';
          break;
        case 'nenhum':
          adequacaoMatch = !(
            itemAdequacao === 'mestrado' ||
            itemAdequacao === 'doutorado' ||
            itemAdequacao === 'mestrado_doutorado'
          );
          break;
        default:
          adequacaoMatch = true;
          break;
      }
      resultadosFiltros.push(adequacaoMatch);
    }

    // Filtro por H5 mínimo (apenas se ativo)
    if (
      filtrosAtivos.includes('h5Minimo') &&
      normalizedData.h5Minimo !== undefined &&
      normalizedData.h5Minimo !== null &&
      normalizedData.h5Minimo !== '' &&
      normalizedData.h5Minimo > 0
    ) {
      const itemH5 =
        item.h5 || Math.max(item.percentilJcr || 0, item.percentilScopus || 0);
      const h5Match = itemH5 >= normalizedData.h5Minimo;
      resultadosFiltros.push(h5Match);
    }

    // Filtro por classificação mínima (apenas se ativo)
    if (
      filtrosAtivos.includes('classificacaoMinima') &&
      normalizedData.classificacaoMinima
    ) {
      const classificacaoOrdem = {
        a1: 8,
        a2: 7,
        a3: 6,
        a4: 5,
        a5: 4,
        a6: 3,
        a7: 2,
        a8: 1,
      };
      const minima =
        classificacaoOrdem[normalizedData.classificacaoMinima.toLowerCase()];
      const itemClassificacao =
        classificacaoOrdem[item.classificacao?.toLowerCase()];
      const classificacaoMatch =
        itemClassificacao && itemClassificacao >= minima;
      resultadosFiltros.push(classificacaoMatch);
    }

    // Se não há filtros para avaliar, retorna true
    if (resultadosFiltros.length === 0) return true;

    // Aplica lógica AND ou OR baseada na correspondência exata
    return correspondenciaExata
      ? resultadosFiltros.every(resultado => resultado) // AND - todos devem ser verdadeiros
      : resultadosFiltros.some(resultado => resultado); // OR - pelo menos um deve ser verdadeiro
  };

  const onSubmit = data => {
    const normalizedData = normalizeToNull(data);

    // Considera o filtro de tipo de veículo (apenas se ativo)
    const tipoVeiculo = filtrosAtivos.includes('tipoVeiculo')
      ? normalizedData.tipoVeiculo || 'ambos'
      : 'ambos';

    let eventosData = [];
    let periodicosData = [];

    // Filtra eventos se necessário (usa filtro normal)
    if (tipoVeiculo === 'ambos' || tipoVeiculo === 'eventos') {
      eventosData = filterData(allEventos, normalizedData);
    }

    // Filtra periódicos se necessário (usa filtro específico)
    if (tipoVeiculo === 'ambos' || tipoVeiculo === 'periodicos') {
      periodicosData = filterPeriodicos(allPeriodicos, normalizedData);
    }

    if (onResultados) {
      onResultados({
        eventos: eventosData,
        periodicos: periodicosData,
      });
    }
  };

  return (
    <>
      <form
        className="w-full max-w-3xl mx-auto grid grid-cols-1 gap-6 text-left"
        onSubmit={handleSubmit(onSubmit)}
      >
        {' '}
        <div className="md:col-span-2">
          <label className="block font-semibold uppercase text-xs mb-1">
            Nome do Evento/Periódico
          </label>
          <input
            type="text"
            placeholder="Digite..."
            className="w-full border border-gray-400 rounded px-2 py-2"
            {...register('nome')}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="button"
            className="text-left border rounded px-3 py-2 flex justify-between items-center"
            onClick={() => {
              setOpen(prev => !prev);
            }}
          >
            <span className="mr-2">Filtros</span>
            <span>{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className={'mt-4 grid grid-cols-1 gap-6 text-left'}>
              <div>
                <label className="block font-semibold uppercase text-xs mb-1">
                  Filtros Ativos
                </label>
                <Controller
                  control={control}
                  name="filtrosAtivos"
                  defaultValue={[]}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      options={filtrosDisponiveis}
                      value={filtrosAtivos}
                      onChange={selected => {
                        setFiltrosAtivos(selected);
                        field.onChange(selected);
                        if (onFiltrosAtivosChange) {
                          onFiltrosAtivosChange(selected);
                        }
                      }}
                      placeholder="Selecione os filtros que deseja utilizar"
                    />
                  )}
                />
              </div>

              {filtrosAtivos.includes('tipoVeiculo') && (
                <div>
                  <label className="block font-semibold uppercase text-xs mb-1">
                    Veículos
                  </label>
                  <select
                    className="w-full border border-gray-400 rounded px-2 py-2"
                    {...register('tipoVeiculo')}
                    defaultValue="ambos"
                  >
                    <option value="ambos">Ambos</option>
                    <option value="eventos">Eventos</option>
                    <option value="periodicos">Periódicos</option>
                  </select>
                </div>
              )}
              {filtrosAtivos.includes('areasPesquisa') && (
                <div>
                  <label
                    htmlFor="areasPesquisaIds"
                    className="block mb-2 text-sm text-start"
                  >
                    ÁREA DE CONHECIMENTO (CNPQ)
                  </label>
                  <Controller
                    control={control}
                    name="areasPesquisaIds"
                    defaultValue={[]}
                    render={({ field }) => (
                      <MultiSelectDropdown
                        options={areas}
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              )}

              {filtrosAtivos.includes('vinculoSBC') && (
                <div>
                  <label className="block font-semibold uppercase text-xs mb-1">
                    Vínculo com SBC
                  </label>
                  <select
                    className="w-full border border-gray-400 rounded px-2 py-2"
                    {...register('vinculoSbc')}
                    defaultValue="ambos"
                  >
                    {vinculoSbcOpcoes.map(opcao => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {filtrosAtivos.includes('adequacaoDefesas') && (
                <div>
                  <label className="block font-semibold uppercase text-xs mb-1">
                    Adequação para Defesas
                  </label>
                  <select
                    className="w-full border border-gray-400 rounded px-2 py-2"
                    {...register('adequacaoDefesa')}
                    defaultValue="qualquer"
                  >
                    {adequacaoDefesasOpcoes.map(opcao => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {filtrosAtivos.includes('h5Minimo') && (
                <div>
                  <label className="block font-semibold uppercase text-xs mb-1">
                    H5 Mínimo
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-gray-400 rounded px-2 py-2"
                    defaultValue={0}
                    {...register('h5Minimo', { valueAsNumber: true })}
                    onChange={e => {
                      const value = e.target.value;
                      if (value) {
                        setValue('h5Minimo', parseFloat(value));
                      }
                    }}
                  />
                </div>
              )}

              {filtrosAtivos.includes('classificacaoMinima') && (
                <div>
                  <label className="block font-semibold uppercase text-xs mb-1">
                    Classificação Mínima
                  </label>
                  <select
                    className="w-full border border-gray-400 rounded px-2 py-2"
                    onChange={e =>
                      setValue('classificacaoMinima', e.target.value)
                    }
                  >
                    <option>Selecione</option>
                    {minimalClassification.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold uppercase text-xs mb-1">
                  Modo de Combinação
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(watch('modoCombinacao') || []).includes(
                      'correspondenciaExata'
                    )}
                    onChange={e => {
                      const current = watch('modoCombinacao') || [];
                      if (e.target.checked) {
                        setValue('modoCombinacao', [
                          ...current,
                          'correspondenciaExata',
                        ]);
                      } else {
                        setValue(
                          'modoCombinacao',
                          current.filter(
                            item => item !== 'correspondenciaExata'
                          )
                        );
                      }
                    }}
                  />
                  Correspondência Exata
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-4 md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Buscar'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset({
                tipoVeiculo: 'ambos',
              });
              setFiltrosAtivos([]);
              if (onFiltrosChange) {
                onFiltrosChange({});
              }
              if (onFiltrosAtivosChange) {
                onFiltrosAtivosChange([]);
              }

              // Mostra todos os dados sem filtros
              if (onResultados) {
                onResultados({
                  eventos: allEventos,
                  periodicos: allPeriodicos,
                });
              }
            }}
            className="btn btn-secondary"
          >
            Limpar Filtros
          </button>
        </div>
      </form>

      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          onClose={() => setShowErrorPopup(false)}
          title={errorInfo.title}
          message={errorInfo.message}
          type={errorInfo.type}
        />
      )}
    </>
  );
}

export default FiltroEventosPeriodicos;
