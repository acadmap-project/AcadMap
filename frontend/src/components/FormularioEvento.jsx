import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';



function FormularioEvento() {
  const methods = useForm({
    resolver: zodResolver,
  })

  const { register } = methods

  return (
    <FormProvider {...methods}>
      <form className='grid grid-cols-3 gap-5 max-w-lg mx-auto mt-8 items-end' action="">
        <div className='col-span-2'>
          <label htmlFor="event" className="block mb-2 text-sm font-medium text-white text-start">Nome do Evento</label>
          <input type="text" className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Digite..." {...register('event')} />
        </div>

        <div>
          <label htmlFor="country" className="block mb-2 text-sm font-medium text-white text-start">Selecione o país</label>
          <select
            id="country"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('country')}
          >
            <option value="">Selecione</option>
            {/* Adicione opções reais aqui */}
          </select>
        </div>

        <div>
          <label htmlFor="indice" className="block mb-2 text-sm font-medium text-white text-start">Índice H5</label>
          <input type="text" className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500" placeholder="númerico (campo)" {...register('indice')} />
        </div>

        <div className='col-span-2'>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...register('vinculoSBC')} />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">Vínculo com a SBC</span>
          </label>
        </div>

        <div>
          <label htmlFor="accessLink" className="block mb-2 text-sm font-medium text-white text-start">Link de Acesso</label>
          <input type="url" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="URL válida" {...register('accessLink')} />
        </div>

        <div>
          <label htmlFor="repoScholar" className="block mb-2 text-sm font-medium text-white text-start">Link de Repositório (GOOGLE-SCHOLAR)</label>
          <input type="url" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="URL válida" {...register('repoScholar')} />
        </div>

        <div>
          <label htmlFor="repoSolSBC" className="block mb-2 text-sm font-medium text-white text-start">Link de Repositório (SOL-SBC)</label>
          <input type="url" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="URL válida" {...register('repoSolSBC')} />
        </div>

      <button
        type="submit"
        className="col-start-2 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border border-gray-700"
      >
        Salvar e Continuar
      </button>

      </form>
    </FormProvider>
  );
}

export default FormularioEvento;
