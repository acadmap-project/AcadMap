import React from 'react';
import useAreas from '../hooks/useAreas';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import { Controller, useForm } from 'react-hook-form';

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

function FiltroEventosPeriodicos({ onResultados }) {
  const [open, setOpen] = React.useState(false);
  const areas = useAreas();
  const { control, register, handleSubmit } = useForm();
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

  console.log(onResultados);

  const onSubmit = async data => {
    const normalizedData = normalizeToNull(data);
    const params = new URLSearchParams();

    Object.entries(normalizedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    });

    const eventosUrl = `http://localhost:8080/api/eventos/listar?${params.toString()}`;
    const periodicosUrl = `http://localhost:8080/api/periodicos/listar?${params.toString()}`;

    let eventosData = [];
    let periodicosData = [];
    try {
      const [eventosRes, periodicosRes] = await Promise.all([
        fetch(eventosUrl),
        fetch(periodicosUrl),
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
      console.error('Erro ao buscar dados:', err);
      eventosData = [];
      periodicosData = [];
    }

    if (onResultados) {
      onResultados({
        eventos: eventosData,
        periodicos: periodicosData,
      });
    }
  };

  return (
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
              <label
                htmlFor="areasPesquisaIds"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                ÁREA DE CONHECIMENTO (CNPQ)*
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
                         // setValue('vinculoSbc', '');
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
                  <input type="checkbox" />
                  Mestrado
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
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
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-xs mb-1">
                Classificação Mínima
              </label>
              <select className="w-full border border-gray-400 rounded px-2 py-2">
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
                <input type="checkbox" />
                Correspondência Exata
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center md:col-span-2">
        <button
          type="submit"
          className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}

export default FiltroEventosPeriodicos;
