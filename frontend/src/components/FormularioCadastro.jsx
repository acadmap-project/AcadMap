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
      console.log('Usuário cadastrado com sucesso:', data);
      setErrorInfo({
        title: 'Usuário Cadastrado',
        message: 'O usuário foi cadastrado com sucesso no sistema.',
        type: 'info',
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

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 items-end max-w-lg gap-5 mx-auto mt-8"
      >
        <div className="flex flex-col items-start">
          <label
            htmlFor="fullName"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Nome Completo
          </label>
          <input
            type="text"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('fullName')}
          />
          <div className="h-6 mt-1">
            {errors.fullName && (
              <p className="text-red-600 text-sm text-left">
                {errors.fullName.message}
              </p>
            )}
          </div>
        </div>
        {/* User Type Dropdown - Only for Admin */}
        {isAdmin && (
          <div className="flex flex-col items-start">
            <label
              htmlFor="tipoPerfil"
              className="block mb-2 text-sm font-medium text-white text-start"
            >
              Tipo de Perfil
            </label>
            <select
              id="tipoPerfil"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
              {...register('tipoPerfil')}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Selecione
              </option>
              <option value="PESQUISADOR">Pesquisador</option>
              <option value="AUDITOR">Auditor</option>
            </select>
            <div className="h-6 mt-1">
              {errors.tipoPerfil && (
                <p className="text-red-500 text-sm text-left">
                  {errors.tipoPerfil.message}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col items-start">
          <label
            htmlFor="searchArea"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Área de Pesquisa
          </label>
          <select
            id="searchArea"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('searchArea')}
            defaultValue=""
          >
            <option value="" disabled className="text-gray-400">
              Selecione
            </option>
            {areas.map(area => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          <div className="h-6 mt-1">
            {errors.searchArea && (
              <p className="text-red-500 text-sm text-left">
                {errors.searchArea.message}
              </p>
            )}
          </div>
        </div>{' '}
        <div className="flex flex-col items-start">
          <label
            htmlFor="searchArea"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Email
          </label>
          <input
            type="email"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('email')}
          />
          <div className="h-6 mt-1">
            {errors.email && (
              <p className="text-red-600 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>{' '}
        <div className="flex flex-col items-start">
          <label
            htmlFor="program"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Programa
          </label>
          <select
            id="program"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('program')}
            defaultValue=""
          >
            <option value="" disabled className="text-gray-400">
              Selecione
            </option>
            {programas.map(programa => (
              <option key={programa.value} value={programa.value}>
                {programa.label}
              </option>
            ))}
          </select>
          <div className="h-6 mt-1">
            {errors.program && (
              <p className="text-red-500 text-sm text-left">
                {errors.program.message}
              </p>
            )}
          </div>
        </div>{' '}
        <div className="flex flex-col items-start">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Password
          </label>
          <input
            type="password"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('password')}
          />
          <div className="h-6 mt-1">
            {errors.password && (
              <p className="text-red-600 text-sm text-left">
                {errors.password.message}
              </p>
            )}
            <GerarSenha
              onGerar={senha => {
                setValue('password', senha);
                setValue('confirmPassword', senha);
              }}
            />
          </div>
        </div>{' '}
        <div className="flex flex-col items-start">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Confirm Password
          </label>
          <input
            type="password"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('confirmPassword')}
          />
          <div className="h-6 mt-1">
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm text-left">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>        <button
          className="col-span-2 justify-self-center w-2xs !bg-blue-600 hover:!bg-blue-700 !text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          type="submit"
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={closeErrorPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
      />

      <ErrorPopup
        isOpen={showSuccessPopup}
        onClose={closeSuccessPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
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
