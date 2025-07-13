import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { CadastrarEventoSchema } from '../schemas/CadastrarEventoSchema';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import { calcularClassificacaoEvento } from '../utils/classificacaoBase';

function FormularioEventoContent() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(CadastrarEventoSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const vinculoSbcCheckbox = watch('vinculoSbcCheckbox');

  const sbcOptions = [
    { value: 'vinculo_comum', label: 'Comum' },
    { value: 'vinculo_top_20', label: 'Top 20' },
    { value: 'vinculo_top_10', label: 'Top 10' },
  ];

  const areas = useAreas();

  const onSubmit = data => {
    const vinculoFinal = vinculoSbcCheckbox ? data.vinculoSbc : 'sem_vinculo';
    const eventData = {
      ...data,
      vinculoSbc: vinculoFinal,
      areasPesquisaIds: data.areasPesquisaIds || [],
      classificacao: calcularClassificacaoEvento(data.h5, vinculoFinal),
    };
    console.log('Submitting event data:', eventData);
    navigate('/revisao-cadastro-evento', {
      state: { eventData },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-5 max-w-4xl mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}
        style={{ fontFamily: 'Poppins', fontWeight: '400' }}
      >
        <div className="w-3/4 mx-auto flex gap-5">
          <div className="flex-[1] flex flex-col items-start">
            <label
              htmlFor="nome"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              NOME DO EVENTO*
            </label>
            <input
              type="text"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite..."
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-red-600 text-sm mt-1 text-left">
                {errors.nome.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
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
            {errors.areasPesquisaIds && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.areasPesquisaIds.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-3/4 mx-auto flex gap-5">
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="h5"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              ÍNDICE H5
            </label>
            <input
              type="text"
              className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="númerico (campo)"
              {...register('h5')}
            />
            {errors.h5 && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.h5.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <span className="mb-2 text-sm text-gray-900">
              VÍNCULO COM A SBC
            </span>
            <div className="flex items-center gap-4 w-full">
              <div className="flex justify-center w-16 flex-shrink-0">
                <label className="cursor-pointer">
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
              <div className="flex-1">
                <div
                  className={`transition-opacity duration-300 ${vinculoSbcCheckbox ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  {sbcOptions.map(option => (
                    <label key={option.value} className="flex items-center mb-1">
                      <input
                        type="radio"
                        value={option.value}
                        {...register('vinculoSbc')}
                        disabled={!vinculoSbcCheckbox}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.vinculoSbc && vinculoSbcCheckbox && (
                  <p className="text-red-500 text-sm mt-1 text-left">
                    {errors.vinculoSbc.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex gap-5">
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="linkEvento"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              LINK DE ACESSO*
            </label>
            <input
              type="text"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="URL válida"
              {...register('linkEvento')}
            />
            {errors.linkEvento && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.linkEvento.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="linkGoogleScholar"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
            </label>
            <input
              type="text"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="URL válida"
              {...register('linkGoogleScholar')}
            />
            {errors.linkGoogleScholar && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.linkGoogleScholar.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="linkSolSbc"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              LINK DE REPOSITÓRIO (SOL-SBC)
            </label>
            <input
              type="text"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="URL válida"
              {...register('linkSolSbc')}
            />
            {errors.linkSolSbc && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.linkSolSbc.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center mt-6">
          <button
            type="submit"
            className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            Salvar e Continuar
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function FormularioEvento() {
  return (
    <div>
      <div className="max-w-6xl mx-auto mt-4">
        <h2
          className="text-gray-900 text-lg mb-4"
          style={{ fontFamily: 'Poppins', fontWeight: '400' }}
        >
          Campos Obrigatórios (*)
        </h2>
      </div>
      <FormularioEventoContent />
    </div>
  );
}

export default FormularioEvento;
