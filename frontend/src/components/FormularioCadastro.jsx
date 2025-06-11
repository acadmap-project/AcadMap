import { zodResolver } from '@hookform/resolvers/zod';
import { dadosEntradaCadastro } from '../utils/dadosEntrada';
import CampoEntrada from './CampoEntrada';
import GerarSenha from './GerarSenha';

import { useForm } from 'react-hook-form';
import { CadastrarUsuarioSchema } from '../schemas/CadastrarUsuarioSchema';

function FormularioCadastro() {

  const { handleSubmit, register, formState: {errors} } = useForm({
    resolver: zodResolver(CadastrarUsuarioSchema)
  })

  const testSubmit = (data) => {
    console.log('cadastro usuário, dados')
    console.log(data)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(testSubmit)}
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
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="searchArea"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Área de Pesquisa
          </label>
          <select
            id="cnpq"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('searchArea')}
          >
            <option value="">Selecione</option>
          </select>
          <div className="h-6 mt-1">
            {errors.searchArea && (
              <p className="text-red-500 text-sm text-left">
                {errors.searchArea.message}
              </p>
            )}
          </div>
        </div>        <div className="flex flex-col items-start">
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
        </div>        <div className="flex flex-col items-start">
          <label
            htmlFor="program"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Programa
          </label>
          <select
            id="cnpq"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('program')}
          >
            <option value="">Selecione</option>
          </select>
          <div className="h-6 mt-1">
            {errors.program && (
              <p className="text-red-500 text-sm text-left">
                {errors.program.message}
              </p>
            )}
          </div>
        </div>        <div className="flex flex-col items-start">
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
          </div>
        </div>        <div className="flex flex-col items-start">
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
        </div>

        <button className='col-span-2 justify-self-center w-2xs' type="submit">Cadastrar</button>
      </form>
    </>
  );
}

export default FormularioCadastro;
