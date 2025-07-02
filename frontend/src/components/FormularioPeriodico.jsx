import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { CadastrarPeriodicoSchema } from '../schemas/CadastrarPeriodicoSchema';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import { calcularClassificacaoPeriodico } from '../utils/classificacaoBase';

function FormularioPeriodicoContent() {
  const areas = useAreas();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(CadastrarPeriodicoSchema),
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

  const onSubmit = data => {
    // Handle vinculoSBC logic and convert percentil to number
    const { vinculoSbcCheckbox: _, ...rest } = data; // Remove vinculoSbcCheckbox
    const periodicoData = {
      ...rest,
      vinculoSBC:
        data.vinculoSbcCheckbox && data.vinculoSBC && data.vinculoSBC !== ''
          ? data.vinculoSBC
          : 'sem_vinculo',
          classificacao: calcularClassificacaoPeriodico(Math.max(data.percentil_jcr, data.percentil_scopus)),
    };

    console.log('Submitting periodico data:', periodicoData);
    navigate('/validacao-cadastro', {
      state: periodicoData,
    });
  };

  const qualisOptions = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
    { value: 'b3', label: 'B3' },
    { value: 'b4', label: 'B4' },
    { value: 'b5', label: 'B5' },
    { value: 'c', label: 'C' },
  ];

  return (
    <>
      {' '}
      <div className="max-w-6xl mx-auto mt-4">
        <h2
          className="text-gray-900 text-lg"
          style={{ fontFamily: 'Poppins', fontWeight: '400' }}
        >
          Campos Obrigatórios (*)
        </h2>
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4 max-w-6xl mx-auto mt-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ fontFamily: 'Poppins', fontWeight: '400' }}
        >
          <div className="w-3/4 mx-auto grid grid-cols-2 gap-4">
            {' '}
            <div>
              <label
                htmlFor="nome"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                NOME DO PERIÓDICO*
              </label>
              <input
                type="text"
                id="nome"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite o nome do periódico..."
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>
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
              {errors.areasPesquisaIds && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.areasPesquisaIds.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-3/4 mx-auto grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="issn"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                ÍSSN*
              </label>
              <input
                type="text"
                id="issn"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Ex: 1234-5678"
                {...register('issn')}
              />
              {errors.issn && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.issn.message}
                </p>
              )}
            </div>
            <div className="flex flex-col justify-end">
              <span className="mb-2 text-sm text-gray-900 text-start">
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
                              setValue('vinculoSBC', '');
                            }
                          },
                        })}
                      />
                      <div className="w-12 h-6 rounded-full border-2 border-gray-300 bg-gray-200 peer-checked:bg-white transition-all duration-300 ease-in-out" />
                      <div className="absolute top-1/2 w-8 h-8 rounded-full bg-gray-400 peer-checked:bg-black transform -translate-y-1/2 translate-x-0 peer-checked:translate-x-6 transition-all duration-300 ease-in-out" />
                    </div>
                  </label>
                </div>{' '}
                <div className="flex-1">
                  <select
                    id="vinculoSBC"
                    className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 transition-opacity duration-300 ${
                      vinculoSbcCheckbox
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    {...register('vinculoSBC')}
                    defaultValue=""
                    disabled={!vinculoSbcCheckbox}
                  >
                    <option value="" disabled className="text-gray-500">
                      Selecione tipo de vínculo
                    </option>
                    {sbcOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.vinculoSBC && vinculoSbcCheckbox && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.vinculoSBC.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>{' '}
          <div className="w-full grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="linkScopus"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (SCOPUS)
              </label>
              <input
                type="text"
                id="linkScopus"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite uma URL válida..."
                {...register('linkScopus')}
              />
              {errors.linkScopus && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkScopus.message}
                </p>
              )}
            </div>{' '}
            <div>
              <label
                htmlFor="linkGoogleScholar"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
              </label>
              <input
                type="text"
                id="linkGoogleScholar"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite uma URL válida..."
                {...register('linkGoogleScholar')}
              />
              {errors.linkGoogleScholar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkGoogleScholar.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="linkJcr"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (JCR)
              </label>
              <input
                type="text"
                id="linkJcr"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite uma URL válida..."
                {...register('linkJcr')}
              />
              {errors.linkJcr && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkJcr.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {' '}
            <div>
              <label
                htmlFor="qualisAntigo"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                NOTA NO ANTIGO QUALIS*
              </label>
              <select
                id="qualisAntigo"
                className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 transition-opacity duration-300`}
                {...register('qualisAntigo')}
                defaultValue=""
              >
                <option value="" disabled className="text-gray-500">
                  Selecione a nota do QUALIS
                </option>
                {qualisOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.vinculoSBC && vinculoSbcCheckbox && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.vinculoSBC.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="percentil_jcr"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                PERCENTIL JCR*
              </label>{' '}
              <input
                type="text"
                id="percentil_jcr"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite o percentil do periódico (0-100)..."
                {...register('percentil_jcr')}
              />
              {errors.percentil_jcr && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.percentil_jcr.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="percentil_scopus"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                PERCENTIL SCOPUS*
              </label>{' '}
              <input
                type="text"
                id="percentil_scopus"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite o percentil do periódico (0-100)..."
                {...register('percentil_scopus')}
              />
              {errors.percentil_scopus && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.percentil_scopus.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
              style={{ fontFamily: 'Poppins', fontWeight: '400' }}
            >
              Salvar e Continuar
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export default function FormularioPeriodico() {
  return <FormularioPeriodicoContent />;
}
