import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { CadastrarPeriodicoSchema } from '../schemas/CadastrarPeriodicoSchema';
import useAreas from '../hooks/useAreas';
import useLogin from '../hooks/userAuth';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorPopup from './ErrorPopup';
import Popup from './Popup';
import { a } from '@react-spring/web';

const queryClient = new QueryClient();

const postPeriodico = async ({ periodicoData, userId }) => {
  console.log('Sending data to API:', periodicoData);
  const response = await fetch(
    'http://localhost:8080/api/periodicos/cadastro',
    {
      method: 'POST',
      headers: {
        'X-User-Id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(periodicoData),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorData}`);
    error.status = response.status;
    error.response = { status: response.status, data: errorData };
    throw error;
  }

  return response.json();
};

function FormularioPeriodicoContent() {
  const areas = useAreas();
  const { loggedIn } = useLogin();
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState({
    title: '',
    message: '',
    type: 'success',
  });

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
  const createPeriodicoMutation = useMutation({
    mutationFn: postPeriodico,
    onSuccess: data => {
      console.log('Periódico cadastrado com sucesso:', data);
      setSuccessInfo({
        title: 'Periódico Cadastrado',
        message: 'O periódico foi cadastrado com sucesso no sistema.',
        type: 'success',
      });
      setShowSuccessPopup(true);
      setTimeout(() => {
        // Navigate to validation page with the response data
        navigate('/validacao-cadastro', {
          state: {
            id: data.idVeiculo,
            usuario: data.usuario?.nome || 'Usuario',
            nomeVeiculo: data.nome,
            tipo: data.tipo || 'periodico',
            indice: data.classificacao || 'N/A',
            // link:
            //   data.linkJcr || data.linkScopus || data.linkGoogleScholar || '#',
            ...data,
          },
        });
      }, 2000);
    },
    onError: error => {
      console.error('Erro ao cadastrar periódico:', error);
      setErrorInfo({
        title: 'Erro!',
        message: error.message || 'Erro ao cadastrar periódico',
        type: 'error',
      });
      setShowErrorPopup(true);
    },
  });
  const onSubmit = data => {
    // Handle vinculoSBC logic and convert percentil to number
    const { vinculoSbcCheckbox, ...rest } = data; // Remove vinculoSbcCheckbox
    const formData = {
      ...rest,
      vinculoSBC:
        data.vinculoSbcCheckbox && data.vinculoSBC && data.vinculoSBC !== ''
          ? data.vinculoSBC
          : 'sem_vinculo',
      percentil: Number(data.percentil),
    };

    createPeriodicoMutation.mutate({
      periodicoData: formData,
      userId: loggedIn.id,
    });
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const qualisOptions = [
    {value: 'a1'},
    {value: 'a2'},
    {value: 'b1'},
    {value: 'b2'},
    {value: 'b3'},
    {value: 'b4'},
    {value: 'b5'},
    {value: 'c'},
  ]
  

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
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {' '}
            <div>
              <label
                htmlFor="qualisAntigo"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                NOTA NO ANTIGO QUALIS*
              </label>
              {/* <input
                type="text"
                id="qualisAntigo"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite a nota do periódico no antigo QUALIS"
                {...register('qualisAntigo')}
              />
              {errors.qualisAntigo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qualisAntigo.message}
                </p>
              )} */}
              <select
                id="qualisAntigo"
                className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 transition-opacity duration-300`
                }
                {...register('qualisAntigo')}
                defaultValue=""
              >
                <option value="" disabled className="text-gray-500">
                  Selecione tipo de vínculo
                </option>
                {qualisOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}
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
                htmlFor="percentil"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                PERCENTIL*
              </label>{' '}
              <input
                type="text"
                id="percentil"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite o percentil do periódico (0-100)..."
                {...register('percentil')}
              />
              {errors.percentil && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.percentil.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
              disabled={createPeriodicoMutation.isPending}
              style={{ fontFamily: 'Poppins', fontWeight: '400' }}
            >
              {createPeriodicoMutation.isPending
                ? 'Salvando...'
                : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      </FormProvider>
      <ErrorPopup
        isOpen={showErrorPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
        onClose={() => setShowErrorPopup(false)}
      />
      <Popup
        isOpen={showSuccessPopup}
        onClose={closeSuccessPopup}
        title={successInfo.title}
        message={successInfo.message}
        type={successInfo.type}
      />
    </>
  );
}

export default function FormularioPeriodico() {
  return (
    <QueryClientProvider client={queryClient}>
      <FormularioPeriodicoContent />
    </QueryClientProvider>
  );
}
