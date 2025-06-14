import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CadastrarPeriodicoSchema } from '../schemas/CadastrarPeriodicoSchema';
import useAreas from "../hooks/useAreas";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorPopup from './ErrorPopup';

const queryClient = new QueryClient();

const postPeriodico = async periodicoData => {
  console.log(periodicoData);
  const response = await fetch('http://localhost:8080/api/periodicos/cadastro', {
    method: 'POST',
    headers: {
      'X-User-Id': '11111111-1111-1111-1111-111111111111', // TODO: Implementar lógica para pegar o ID do usuário logado
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(periodicoData),
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

function FormularioPeriodicoContent() {
  const areas = useAreas();
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });

  const methods = useForm({
    resolver: zodResolver(CadastrarPeriodicoSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const createPeriodicoMutation = useMutation({
    mutationFn: postPeriodico,
    onSuccess: data => {
      console.log('Periódico cadastrado com sucesso:', data);
      setErrorInfo({
        title: 'Sucesso!',
        message: 'Periódico cadastrado com sucesso!',
        type: 'success',
      });
      setShowErrorPopup(true);
      setTimeout(() => {
        navigate('/');
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
    createPeriodicoMutation.mutate(data);
  };  return (
    <>
      <div className="max-w-6xl mx-auto mt-4">
        <h2 className="text-gray-900 text-lg font-bold mb-4">Campos Obrigatórios (*)</h2>
      </div>
      <FormProvider {...methods}>
        <form 
          className="grid grid-cols-12 gap-4 max-w-6xl mx-auto mt-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="col-span-6">
            <label 
              htmlFor="periodicoNome"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              NOME DO PERIÓDICO*
            </label>
            <input
              type="text"
              id="periodicoNome"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite o nome do periódico..."
              {...register("periodicoNome")}
            />
            {errors.periodicoNome && (
              <p className="text-red-500 text-sm mt-1">{errors.periodicoNome.message}</p>
            )}
          </div>
          
          <div className="col-span-6">            <label 
              htmlFor="areaConhecimento" 
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              ÁREA DE CONHECIMENTO (CNPQ)*
            </label>
            <select 
              id="areaConhecimento" 
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
              {...register("areaConhecimento")}
            >
              <option value="" disabled className="text-gray-500">
                Selecione
              </option>
              {areas && areas.length > 0 ? areas.map((area) => (
                <option key={area.key} value={area.value}>
                  {area.label}
                </option>
              )) : (
                <option value="" disabled>Carregando áreas...</option>
              )}
            </select>
            {errors.areaConhecimento && (
              <p className="text-red-500 text-sm mt-1">{errors.areaConhecimento.message}</p>
            )}
          </div>
          <div className="col-span-6">
            <label 
              htmlFor="issn"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              ÍSSN*
            </label>
            <input
              type="text"
              id="issn"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Ex: 1234-5678"
              {...register("issn")}
            />
            {errors.issn && (
              <p className="text-red-500 text-sm mt-1">{errors.issn.message}</p>
            )}
          </div>

          <div className="col-span-6 flex flex-col justify-end">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("vinculoSBC")}
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>              <span className="ms-3 text-sm font-medium text-gray-900">
                VÍNCULO COM A SBC
              </span>
            </label>
          </div>
          <div className="col-span-4">
            <label 
              htmlFor="linkPeriodico"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              LINK DE ACESSO*
            </label>
            <input
              type="url"
              id="linkPeriodico"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite uma URL válida..."
              {...register("linkPeriodico")}
            />
            {errors.linkPeriodico && (
              <p className="text-red-500 text-sm mt-1">{errors.linkPeriodico.message}</p>
            )}
          </div>

          <div className="col-span-4">            
            <label 
              htmlFor="linkRepoScholar"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
            </label>
            <input
              type="url"
              id="linkRepoScholar"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite uma URL válida..."
              {...register("linkRepoScholar")}
            />
            {errors.linkRepoScholar && (
              <p className="text-red-500 text-sm mt-1">{errors.linkRepoScholar.message}</p>
            )}
          </div>

          <div className="col-span-4">            
            <label 
              htmlFor="linkRepoJCR"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              LINK DE REPOSITÓRIO (JCR)
            </label>
            <input
              type="url"
              id="linkRepoJCR"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite uma URL válida..."
              {...register("linkRepoJCR")}
            />
            {errors.linkRepoJCR && (
              <p className="text-red-500 text-sm mt-1">{errors.linkRepoJCR.message}</p>
            )}
          </div> 
          <div className="col-span-4">
            <label 
              htmlFor="linkRepoScopus"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              LINK DE REPOSITÓRIO (SCOPUS)
            </label>
            <input
              type="url"
              id="linkRepoScopus"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite uma URL válida..."
              {...register("linkRepoScopus")}
            />
            {errors.linkRepoScopus && (
              <p className="text-red-500 text-sm mt-1">{errors.linkRepoScopus.message}</p>
            )}
          </div>

          <div className="col-span-4">            <label 
              htmlFor="qualis"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              NOTA NO ANTIGO QUALIS
            </label>
            <input
              type="number"
              id="qualis"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite a nota do periódico no antigo QUALIS"
              {...register("qualis")}
            />
            {errors.qualis && (
              <p className="text-red-500 text-sm mt-1">{errors.qualis.message}</p>
            )}
          </div>

          <div className="col-span-4">            <label 
              htmlFor="percentil"
              className="block mb-2 text-sm font-medium text-gray-900 text-start"
            >
              PERCENTIL*
            </label>
            <input
              type="number"
              id="percentil"
              className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
              placeholder="Digite o percentil do periódico (0-100)..."
              min="0"
              max="100"
              {...register("percentil")}
            />
            {errors.percentil && (
              <p className="text-red-500 text-sm mt-1">{errors.percentil.message}</p>
            )}
          </div>          <div className="col-span-12 flex justify-center mt-6">
            <button 
              type="submit"
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50 !font-medium"
              disabled={createPeriodicoMutation.isPending}
            >
              {createPeriodicoMutation.isPending ? 'Salvando...' : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      </FormProvider>
      
      {showErrorPopup && (
        <ErrorPopup
          title={errorInfo.title}
          message={errorInfo.message}
          type={errorInfo.type}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
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