import { post } from '../utils/authFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import GerarSenha from './GerarSenha';
import useAreas from '../hooks/useAreas';
import useProgramas from '../hooks/useProgramas';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import {
  CadastrarUsuarioSchema,
  CadastrarUsuarioAdminSchema,
} from '../schemas/CadastrarUsuarioSchema';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { useState } from 'react';
import ErrorPopup from './ErrorPopup';
import Popup from './Popup';
import Logger from '../utils/logger';

const queryClient = new QueryClient();

const postUser = async userData => {
  console.log('Sending user data:', userData);
  const response = await post('/api/usuario/cadastro', userData, {}, false);

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
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    control,
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
      Logger.logError(
        `Erro ao cadastrar usuário: ${error.message || 'Erro desconhecido'}`
      );

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
      } else if (errorMessage == 'EMAIL_DUPLICADO') {
        setErrorInfo({
          title: 'Erro ao Cadastrar Usuário',
          message: 'Já existe um cadastro com esse e-mail.',
          type: 'error',
        });
        setEmailErrorMessage('Já existe um cadastro com esse e-mail.');
      } else if (error.status === 400) {
        setErrorInfo({
          title: 'Dados Inválidos',
          message:
            errorMessage ||
            'Verifique se todos os campos foram preenchidos corretamente.',
          type: 'error',
        });
      } else if (error.status === 404) {
        setErrorInfo({
          title: 'Erro ao Cadastrar Usuário',
          message:
            errorMessage ||
            'Programa ou área de pesquisa não encontrados. Verifique os dados selecionados.',
          type: 'error',
        });
      } else {
        setErrorInfo({
          title: 'Erro ao Cadastrar Usuário',
          message:
            errorMessage ||
            'Ocorreu um erro inesperado ao cadastrar o usuário. Tente novamente mais tarde.',
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
      senha: data.password, // Senha enviada sem criptografia
      tipoPerfil: isAdmin ? data.tipoPerfil : 'PESQUISADOR', // Use selected type if admin, default to PESQUISADOR
      idPrograma: data.program,
      idsAreasPesquisa: data.searchArea || [],
    };

    console.log('Submitting user data:', userData);
    createUserMutation.mutate(userData);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto"
      >
        {isAdmin && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Tipo de Cadastro</span>
              </label>
              <select
                id="tipoPerfil"
                className="select select-bordered w-full bg-white"
                {...register('tipoPerfil')}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="PESQUISADOR">Pesquisador</option>
                <option value="AUDITOR">Auditor</option>
              </select>
              {errors.tipoPerfil && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.tipoPerfil.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">NOME COMPLETO</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-white"
                placeholder="Digite..."
                {...register('fullName')}
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.fullName.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">ÁREA DE PESQUISA</span>
              </label>
              <Controller
                control={control}
                name="searchArea"
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={areas}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.searchArea && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.searchArea.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">EMAIL</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-white"
                placeholder="Digite..."
                {...register('email', {
                  onChange: () => setEmailErrorMessage(''),
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
              {emailErrorMessage && !errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {emailErrorMessage}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">PROGRAMA</span>
              </label>
              <select
                id="program"
                className="select select-bordered w-full bg-white"
                {...register('program')}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione
                </option>
                {programas.map(programa => (
                  <option key={programa.value} value={programa.value}>
                    {programa.label}
                  </option>
                ))}
              </select>
              {errors.program && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.program.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">SENHA</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full bg-white pr-10"
                    placeholder="Digite..."
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                    )}
                  </button>
                </div>
                <div className="w-12">
                  <GerarSenha
                    onGerar={senha => {
                      setValue('password', senha);
                      setValue('confirmPassword', senha);
                    }}
                  />
                </div>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">CONFIRMAR SENHA</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full bg-white pr-10"
                  placeholder="Digite..."
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="btn btn-primary px-8 min-h-12"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
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
