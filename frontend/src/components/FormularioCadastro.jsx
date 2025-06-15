import { zodResolver } from '@hookform/resolvers/zod';
import GerarSenha from './GerarSenha';
import useAreas from '../hooks/useAreas';
import useProgramas from '../hooks/useProgramas';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CadastrarUsuarioSchema,
  CadastrarUsuarioAdminSchema,
} from '../schemas/CadastrarUsuarioSchema';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { useState } from 'react';
import ErrorPopup from './ErrorPopup';
import Popup from './Popup';

const queryClient = new QueryClient();

const postUser = async userData => {
  console.log('Sending user data:', userData);
  const response = await fetch('http://localhost:8080/api/usuario/cadastro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorData;
    try {
      // Try to parse as JSON first (structured error response)
      errorData = await response.json();
    } catch {
      // If JSON parsing fails, get as text
      errorData = await response.text();
    }

    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    error.response = { status: response.status, data: errorData };
    throw error;
  }

  return response.json();
};

function FormularioCadastroContent({ isAdmin = false }) {
  /*
    Componente de formulário para cadastro de usuários do sistema.
    Renderiza campos de entrada com base nos dados fornecidos.
    @param {boolean} isAdmin - Se true, mostra dropdown para seleção de tipo de perfil
  */
  const areas = useAreas();
  const programas = useProgramas();
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
    resolver: zodResolver(
      isAdmin ? CadastrarUsuarioAdminSchema : CadastrarUsuarioSchema
    ),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = methods;
  const createUserMutation = useMutation({
    mutationFn: postUser,
    onSuccess: data => {
      console.log('Usuário cadastrado com sucesso:', data); // Close any existing error popup first
      setShowErrorPopup(false);
      // Set success info and show success popup
      setSuccessInfo({
        title: 'Usuário Cadastrado',
        message: 'O usuário foi cadastrado com sucesso no sistema.',
        type: 'success',
      });
      setShowSuccessPopup(true);
      reset(); // Reset form after successful submission
    },
    onError: error => {
      console.error('Erro ao cadastrar usuário:', error);

      // Extract the actual error message from the response
      let errorMessage = 'Erro desconhecido ao cadastrar usuário';

      if (error.response?.data) {
        const responseData = error.response.data;

        // Handle JSON error response (structured error)
        if (typeof responseData === 'object') {
          errorMessage =
            responseData.message ||
            responseData.error ||
            responseData.detail ||
            JSON.stringify(responseData);
        }
        // Handle plain text error response
        else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error types with custom messages, but include backend message
      if (error.status === 409) {
        setErrorInfo({
          title: 'Usuário Já Existe',
          message:
            errorMessage ||
            'Já existe um usuário cadastrado com este email. Por favor, use um email diferente.',
          type: 'warning',
        });
      } else if (error.status === 400) {
        setErrorInfo({
          title: 'Dados Inválidos',
          message:
            errorMessage ||
            'Verifique se todos os campos foram preenchidos corretamente.',
          type: 'error',
        });
      } else {
        setErrorInfo({
          title: 'Erro ao Cadastrar Usuário',
          message: errorMessage,
          type: 'error',
        });
      }
      setShowErrorPopup(true);
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const onSubmit = data => {
    const userData = {
      nome: data.fullName,
      email: data.email,
      senha: data.password,
      tipoPerfil: isAdmin ? data.tipoPerfil : 'PESQUISADOR', // Use selected type if admin, default to PESQUISADOR
      idPrograma: data.program,
      idsAreasPesquisa: [data.searchArea],
    };

    console.log('Submitting user data:', userData);
    createUserMutation.mutate(userData);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-xl mx-auto mt-8"
      >
        {isAdmin && (
          <div className="w-3/5 mx-auto flex flex-col items-start">
            {' '}
            <label
              htmlFor="tipoPerfil"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              CADASTRAR
            </label>
            <select
              id="tipoPerfil"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
              {...register('tipoPerfil')}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-500">
                Selecione
              </option>
              <option value="PESQUISADOR">Pesquisador</option>
              <option value="AUDITOR">Auditor</option>
            </select>{' '}
            <div className="h-6">
              {errors.tipoPerfil && (
                <p className="text-red-500 text-sm text-left">
                  {errors.tipoPerfil.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 items-end gap-x-15">
          {' '}
          <div className="flex flex-col items-start">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              NOME COMPLETO
            </label>
            <input
              type="text"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite..."
              {...register('fullName')}
            />{' '}
            <div className="h-6">
              {errors.fullName && (
                <p className="text-red-600 text-sm text-left">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>{' '}
          <div className="flex flex-col items-start">
            <label
              htmlFor="searchArea"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              ÁREA DE PESQUISA
            </label>
            <select
              id="searchArea"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
              {...register('searchArea')}
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
            </select>{' '}
            <div className="h-6">
              {errors.searchArea && (
                <p className="text-red-500 text-sm text-left">
                  {errors.searchArea.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            {' '}
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              EMAIL
            </label>
            <input
              type="email"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite..."
              {...register('email')}
            />{' '}
            <div className="h-6">
              {errors.email && (
                <p className="text-red-600 text-sm text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="program"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              PROGRAMA
            </label>
            <select
              id="program"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
              {...register('program')}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-500">
                Selecione
              </option>
              {programas.map(programa => (
                <option key={programa.value} value={programa.value}>
                  {programa.label}
                </option>
              ))}
            </select>{' '}
            <div className="h-6">
              {errors.program && (
                <p className="text-red-500 text-sm text-left">
                  {errors.program.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              SENHA
            </label>
            <div className="flex items-center w-full gap-2">
              <input
                type="password"
                className="border text-sm rounded-none block flex-1 p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite..."
                {...register('password')}
              />
              <div className="w-1/4">
                <GerarSenha
                  onGerar={senha => {
                    setValue('password', senha);
                    setValue('confirmPassword', senha);
                  }}
                />
              </div>
            </div>{' '}
            <div className="h-6">
              {errors.password && (
                <p className="text-red-600 text-sm text-left">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm text-gray-900 text-start"
            >
              CONFIRMAR SENHA
            </label>
            <input
              type="password"
              className="border text-sm rounded-none block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite..."
              {...register('confirmPassword')}
            />{' '}
            <div className="h-6">
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm text-left">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
              style={{ fontFamily: 'Poppins', fontWeight: '400' }}
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </form>
      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={closeErrorPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
      />

      <Popup
        isOpen={showSuccessPopup}
        onClose={closeSuccessPopup}
        title={successInfo.title}
        message={successInfo.message}
        type={successInfo.type}
      />
    </FormProvider>
  );
}

function FormularioCadastro({ isAdmin = false }) {
  /*
    Componente principal que encapsula o formulário de cadastro de usuários.
    Utiliza o QueryClientProvider para fornecer o cliente de consulta ao React Query.
    @param {boolean} isAdmin - Se true, mostra dropdown para seleção de tipo de perfil
  */
  return (
    <QueryClientProvider client={queryClient}>
      <FormularioCadastroContent isAdmin={isAdmin} />
    </QueryClientProvider>
  );
}

export default FormularioCadastro;
