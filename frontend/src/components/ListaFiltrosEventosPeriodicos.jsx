import { useState, useEffect } from 'react';

function ListaFiltrosEventosPeriodicos({
  filtros,
  areas = [],
  filtrosAtivosDropdown = [],
}) {
  const [filtrosAtivos, setFiltrosAtivos] = useState({});

  useEffect(() => {
    setFiltrosAtivos(filtros || {});
  }, [filtros]);

  const labels = {
    nome: 'Nome',
    tipoVeiculo: 'Tipo de Veículo',
    areasPesquisaIds: 'Área',
    vinculoSbc: 'Vínculo SBC',
    h5Minimo: 'H5 Mínimo',
    classificacaoMinima: 'Classificação',
    modoCombinacao: 'Modo de Combinação',
    adequacaoDefesa: 'Adequação para Defesas',
  };

  const adequacaoLabels = {
    qualquer: 'Qualquer',
    mestradoEDoutorado: 'Mestrado e Doutorado',
    mestradoOuAcima: 'Mestrado ou Acima',
    apenasMestrado: 'Apenas Mestrado',
    nenhum: 'Nenhum',
  };

  const vinculoSbcLabels = {
    ambos: 'Ambos',
    semVinculo: 'Sem Vínculo',
    comVinculo: 'Com Vínculo',
    top20OuTop10: 'Top20 ou Top10',
    somenteTop20: 'Somente Top20',
    somenteTop10: 'Somente Top10',
    somenteComum: 'Somente Comum',
  };

  const renderFiltros = () => {
    const items = [];

    // Sempre mostra o nome se preenchido
    if (filtrosAtivos.nome && filtrosAtivos.nome.trim() !== '') {
      items.push(
        <li
          key="nome"
          className="bg-primary/20 px-3 py-1 rounded text-xs border border-primary/30"
        >
          {labels.nome}: {filtrosAtivos.nome}
        </li>
      );
    }

    // Só mostra tipo de veículo se estiver ativo no dropdown e não for 'ambos'
    if (
      filtrosAtivosDropdown.includes('tipoVeiculo') &&
      filtrosAtivos.tipoVeiculo &&
      filtrosAtivos.tipoVeiculo !== 'ambos'
    ) {
      const tipoLabel =
        filtrosAtivos.tipoVeiculo === 'eventos'
          ? 'Eventos'
          : filtrosAtivos.tipoVeiculo === 'periodicos'
            ? 'Periódicos'
            : filtrosAtivos.tipoVeiculo;
      items.push(
        <li
          key="tipoVeiculo"
          className="bg-secondary/20 px-3 py-1 rounded text-xs border border-secondary/30"
        >
          {labels.tipoVeiculo}: {tipoLabel}
        </li>
      );
    }

    // Só mostra áreas se estiver ativo no dropdown e tiver áreas selecionadas
    if (
      filtrosAtivosDropdown.includes('areasPesquisa') &&
      filtrosAtivos.areasPesquisaIds &&
      filtrosAtivos.areasPesquisaIds.length > 0
    ) {
      const nomes = filtrosAtivos.areasPesquisaIds
        .map(id => {
          const area = areas.find(a => a.value === id);
          return area ? area.label : id;
        })
        .join(', ');
      items.push(
        <li
          key="areas"
          className="bg-accent/20 px-3 py-1 rounded text-xs border border-accent/30"
        >
          {labels.areasPesquisaIds}: {nomes}
        </li>
      );
    }
    // Só mostra vínculo SBC se estiver ativo no dropdown e não for 'ambos'
    if (
      filtrosAtivosDropdown.includes('vinculoSBC') &&
      filtrosAtivos.vinculoSbc &&
      filtrosAtivos.vinculoSbc !== 'ambos'
    ) {
      const vinculoLabel =
        vinculoSbcLabels[filtrosAtivos.vinculoSbc] || filtrosAtivos.vinculoSbc;
      items.push(
        <li
          key="vinculo"
          className="bg-info/20 px-3 py-1 rounded text-xs border border-info/30"
        >
          {labels.vinculoSbc}: {vinculoLabel}
        </li>
      );
    }
    // Só mostra H5 se estiver ativo no dropdown e tiver valor
    if (
      filtrosAtivosDropdown.includes('h5Minimo') &&
      filtrosAtivos.h5Minimo !== undefined &&
      filtrosAtivos.h5Minimo !== null &&
      filtrosAtivos.h5Minimo !== '' &&
      filtrosAtivos.h5Minimo > 0
    ) {
      items.push(
        <li
          key="h5"
          className="bg-warning/20 px-3 py-1 rounded text-xs border border-warning/30"
        >
          {labels.h5Minimo}: {filtrosAtivos.h5Minimo}
        </li>
      );
    }
    // Só mostra classificação se estiver ativo no dropdown e tiver valor
    if (
      filtrosAtivosDropdown.includes('classificacaoMinima') &&
      filtrosAtivos.classificacaoMinima !== undefined &&
      filtrosAtivos.classificacaoMinima !== null &&
      filtrosAtivos.classificacaoMinima !== ''
    ) {
      items.push(
        <li
          key="classificacao"
          className="bg-success/20 px-3 py-1 rounded text-xs border border-success/30"
        >
          {labels.classificacaoMinima}:{' '}
          {filtrosAtivos.classificacaoMinima.toUpperCase()}
        </li>
      );
    }
    // Sempre mostra modo de combinação se estiver ativo (correspondência exata)
    if (
      Array.isArray(filtrosAtivos.modoCombinacao) &&
      filtrosAtivos.modoCombinacao.includes('correspondenciaExata')
    ) {
      items.push(
        <li
          key="modo"
          className="bg-neutral/20 px-3 py-1 rounded text-xs border border-neutral/30"
        >
          {labels.modoCombinacao}: Correspondência Exata
        </li>
      );
    }

    // Só mostra adequação se estiver ativo no dropdown e não for 'qualquer'
    if (
      filtrosAtivosDropdown.includes('adequacaoDefesas') &&
      filtrosAtivos.adequacaoDefesa &&
      filtrosAtivos.adequacaoDefesa !== 'qualquer'
    ) {
      const adequacaoLabel =
        adequacaoLabels[filtrosAtivos.adequacaoDefesa] ||
        filtrosAtivos.adequacaoDefesa;
      items.push(
        <li
          key="adequacao"
          className="bg-error/20 px-3 py-1 rounded text-xs border border-error/30"
        >
          {labels.adequacaoDefesa}: {adequacaoLabel}
        </li>
      );
    }

    if (items.length === 0) {
      return <li className="text-xs">Nenhum filtro aplicado</li>;
    }

    return items;
  };

  return <ul className="flex flex-wrap gap-2 mb-4">{renderFiltros()}</ul>;
}

export default ListaFiltrosEventosPeriodicos;
