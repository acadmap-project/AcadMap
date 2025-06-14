import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CadastrarEventoSchema } from '../schemas/CadastrarEventoSchema';
import useAreas from '../hooks/useAreas';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorPopup from './ErrorPopup';

const queryClient = new QueryClient();

const postEvent = async eventData => {
  console.log(eventData);
  const response = await fetch('http://localhost:8080/api/eventos/cadastro', {
    method: 'POST',
    headers: {
      'X-User-Id': '11111111-1111-1111-1111-111111111111', // TODO: Implementar lógica para pegar o ID do usuário logado
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorData}`);
    error.status = response.status;
    error.response = { status: response.status, data: errorData };
    throw error;
  }

  return response.json();
};

function FormularioEventoContent() {
  const areas = useAreas();
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });

  const methods = useForm({
    resolver: zodResolver(CadastrarEventoSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const createEventMutation = useMutation({
    mutationFn: postEvent,
    onSuccess: data => {
      console.log('Api utilizada com sucesso:', data);
      // Navigate to review page with the event data
      navigate('/revisao-cadastro-evento', {
        state: { eventData: data },
      });
    },
    onError: error => {
      console.error('Endpoint para cadastrar evento com erro:', error);

      // Handle 409 Conflict error
      if (error.status === 409) {
        setErrorInfo({
          title: 'Evento Já Existe',
          message:
            'Um evento com este nome já foi cadastrado no sistema. Por favor, verifique se não é um evento duplicado ou altere o nome do evento.',
          type: 'warning',
        });
        setShowErrorPopup(true);
      } else {
        // Handle other errors
        const errorMessage =
          error.response?.data ||
          error.message ||
          'Erro desconhecido ao cadastrar evento';
        setErrorInfo({
          title: 'Erro ao Cadastrar Evento',
          message: `Ocorreu um erro ao tentar cadastrar o evento: ${errorMessage}`,
          type: 'error',
        });
        setShowErrorPopup(true);
      }
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const onSubmit = data => {
    const eventData = {
      ...data,
      vinculoSbc: 'sem_vinculo', // TODO: Implementar lógica para vincular com a dropdown SBC,
      areasPesquisaIds: [data.areasPesquisaIds], // TODO: Implementar lógica para permitir multiplas areas selecionadas
    };
    console.log('Submitting event data:', eventData);
    createEventMutation.mutate(eventData);
  };

  return (    <FormProvider {...methods}>
      <form
        className="grid grid-cols-3 gap-5 max-w-4xl mx-auto mt-8 items-end"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2 flex flex-col items-start">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            NOME DO EVENTO*
          </label>          <input
            type="text"
            className="border  text-sm rounded-none  block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('nome')}
          />
          {errors.nome && (
            <p className="text-red-600 text-sm mt-1 text-left">
              {errors.nome.message}
            </p>
          )}
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="areasPesquisaIds"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            ÁREA DE CONHECIMENTO (CNPQ)*
          </label>          <select
            id="areasPesquisaIds"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
            {...register('areasPesquisaIds')}
            defaultValue=""
          >
            <option value="" disabled className="text-gray-500">
              Selecione
            </option>
            {areas.map(area => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          {errors.areasPesquisaIds && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.areasPesquisaIds.message}
            </p>
          )}
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="h5"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            ÍNDICE H5*
          </label>          <input
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
        </div>        <div className="col-span-2 flex flex-col items-start">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register('vinculoSBC')}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>            <span className="ms-3 text-sm font-medium text-gray-900">
              VÍNCULO COM A SBC
            </span>
          </label>
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="linkEvento"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            LINK DE ACESSO*
          </label>          <input
            type="url"
            className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkEvento')}
          />
          {errors.linkEvento && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkEvento.message}
            </p>
          )}
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="linkGoogleScholar"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
          </label>          <input
            type="url"
            className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkGoogleScholar')}
          />
          {errors.linkGoogleScholar && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkGoogleScholar.message}
            </p>
          )}
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="linkSolSbc"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            LINK DE REPOSITÓRIO (SOL-SBC)
          </label>          <input
            type="url"
            className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkSolSbc')}
          />
          {errors.linkSolSbc && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkSolSbc.message}
            </p>
          )}        </div>

        <div className="col-span-3 flex justify-center mt-6">
          <button
            type="submit"
            disabled={createEventMutation.isPending}
            className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50 !font-medium"
          >
            {createEventMutation.isPending ? 'Saving...' : 'Salvar e Continuar'}
          </button>
        </div>
      </form>

      {/* Error Popup */}
      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={closeErrorPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
      />
    </FormProvider>
  );
}

function FormularioEvento() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-6xl mx-auto mt-4">
        <h2 className="text-gray-900 text-lg font-bold mb-4">Campos Obrigatórios (*)</h2>
      </div>
      <FormularioEventoContent />
    </QueryClientProvider>
  );
}

export default FormularioEvento;
