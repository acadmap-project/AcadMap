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

function FiltroEventosPeriodicos({ onResultados, onFiltrosChange }) {
  const [open, setOpen] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });
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

  const onSubmit = async data => {
    const normalizedData = normalizeToNull(data);

    const body = {};

    if (normalizedData.nome) body.nome = normalizedData.nome;

    if (
      normalizedData.areasPesquisaIds &&
      normalizedData.areasPesquisaIds.length > 0 &&
      Array.isArray(areas)
    ) {
      body.areasPesquisaNomes = normalizedData.areasPesquisaIds
        .map(id => {
          const area = areas.find(a => a.value === id);
          return area ? area.label : null;
        })
        .filter(Boolean);
    }

    if (typeof normalizedData.vinculoSbcCheckbox === 'boolean') {
      body.vinculoSbc = normalizedData.vinculoSbcCheckbox;
    }

    if (
      Array.isArray(normalizedData.adequacaoDefesas) &&
      normalizedData.adequacaoDefesas.length > 0
    ) {
      body.adequacaoDefesa = normalizedData.adequacaoDefesas.map(str =>
        str.toUpperCase()
      );
    }

    if (
      normalizedData.h5Minimo !== undefined &&
      normalizedData.h5Minimo !== null &&
      normalizedData.h5Minimo !== ''
    ) {
      body.h5Minimo = normalizedData.h5Minimo;
    }

    if (normalizedData.classificacaoMinima) {
      body.classificacaoMinima =
        normalizedData.classificacaoMinima.toLowerCase();
    }

    if (
      Array.isArray(normalizedData.modoCombinacao) &&
      normalizedData.modoCombinacao.includes('correspondenciaExata')
    ) {
      body.correspondenciaExata = true;
    } else {
      body.correspondenciaExata = false;
    }

    const eventosUrl = `${API_URL}/api/eventos/listar`;
    const periodicosUrl = `${API_URL}/api/periodicos/listar`;

    let eventosData = [];
    let periodicosData = [];

    // Considera o filtro de tipo de veículo
    const tipoVeiculo = normalizedData.tipoVeiculo || 'ambos';

    try {
      const requests = [];

      // Adiciona requisição para eventos se necessário
      if (tipoVeiculo === 'ambos' || tipoVeiculo === 'eventos') {
        requests.push(
          fetch(eventosUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        );
      } else {
        requests.push(Promise.resolve({ ok: false }));
      }
      // Adiciona requisição para periódicos se necessário
      if (tipoVeiculo === 'ambos' || tipoVeiculo === 'periodicos') {
        requests.push(
          fetch(periodicosUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        );
      } else {
        requests.push(Promise.resolve({ ok: false }));
      }

      const [eventosRes, periodicosRes] = await Promise.all(requests);

      if (eventosRes.ok) {
        const json = await eventosRes.json();
        eventosData = Array.isArray(json) ? json : [];
      }
      if (periodicosRes.ok) {
        const json = await periodicosRes.json();
        periodicosData = Array.isArray(json) ? json : [];
      }
    } catch (err) {
      setErrorInfo({
        title: 'Erro no Servidor',
        message:
          'Os dados detalhados deste veículo de publicação não estão disponíveis no momento.',
        type: 'error',
      });
      setShowErrorPopup(true);
      eventosData = [];
      periodicosData = [];
      console.error('Erro ao buscar eventos e periódicos:', err);
      Logger.logError(`Erro ao buscar eventos e periódicos: ${err.message}`);
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
              <div>
                <label
                  htmlFor="areasPesquisaIds"
                  className="block mb-2 text-sm text-gray-900 text-start"
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

              <div className="flex flex-col items-center w-48 flex-shrink-0">
                <span className="mb-2 text-sm text-gray-900 w-full text-left">
                  VÍNCULO COM A SBC
                </span>
                <label className="cursor-pointer w-full flex justify-left">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register('vinculoSbcCheckbox', {
                        onChange: e => {
                          if (!e.target.checked) {
                            setValue('vinculoSbc', '');
                          }
                        },
                      })}
                    />
                    <div className="w-12 h-6 rounded-full border-2 border-gray-300 bg-gray-200 peer-checked:bg-white transition-all duration-300 ease-in-out" />
                    <div className="absolute top-1/2 w-8 h-8 rounded-full bg-gray-400 peer-checked:bg-black transform -translate-y-1/2 translate-x-0 peer-checked:translate-x-6 transition-all duration-300 ease-in-out" />
                  </div>
                </label>
              </div>
              <div>
                <label className="block font-semibold uppercase text-xs mb-1">
                  Adequação para Defesas
                </label>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(watch('adequacaoDefesas') || []).includes(
                        'mestrado'
                      )}
                      onChange={e => {
                        const current = watch('adequacaoDefesas') || [];
                        if (e.target.checked) {
                          setValue('adequacaoDefesas', [
                            ...current,
                            'mestrado',
                          ]);
                        } else {
                          setValue(
                            'adequacaoDefesas',
                            current.filter(item => item !== 'mestrado')
                          );
                        }
                      }}
                    />
                    Mestrado
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(watch('adequacaoDefesas') || []).includes(
                        'doutorado'
                      )}
                      onChange={e => {
                        const current = watch('adequacaoDefesas') || [];
                        if (e.target.checked) {
                          setValue('adequacaoDefesas', [
                            ...current,
                            'doutorado',
                          ]);
                        } else {
                          setValue(
                            'adequacaoDefesas',
                            current.filter(item => item !== 'doutorado')
                          );
                        }
                      }}
                    />
                    Doutorado
                  </label>
                </div>
              </div>

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
            className="btn"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={async () => {
              reset({
                tipoVeiculo: 'ambos',
              });
              if (onFiltrosChange) {
                onFiltrosChange({});
              }

              // Faz busca imediatamente após limpar filtros
              const eventosUrl = `${API_URL}/api/eventos/listar`;
              const periodicosUrl = `${API_URL}/api/periodicos/listar`;

              let eventosData = [];
              let periodicosData = [];
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
                  const json = await eventosRes.json();
                  eventosData = Array.isArray(json) ? json : [];
                }
                if (periodicosRes.ok) {
                  const json = await periodicosRes.json();
                  periodicosData = Array.isArray(json) ? json : [];
                }
              } catch (err) {
                setErrorInfo({
                  title: 'Erro no Servidor',
                  message:
                    'Os dados detalhados deste veículo de publicação não estão disponíveis no momento.',
                  type: 'error',
                });
                setShowErrorPopup(true);
                eventosData = [];
                periodicosData = [];
                console.error('Erro ao buscar eventos e periódicos:', err);
                Logger.logError(
                  `Erro ao buscar eventos e periódicos (submit): ${err.message}`
                );
              }

              if (onResultados) {
                onResultados({
                  eventos: eventosData,
                  periodicos: periodicosData,
                });
              }
            }}
            className="!px-8 !py-3 !bg-gray-500 !text-white !border-0 !rounded-none hover:!bg-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-gray-400 focus:!ring-opacity-50"
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
