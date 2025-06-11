import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CadastrarEventoSchema } from '../schemas/CadastrarEventoSchema';
import useAreas from '../hooks/useAreas';

function FormularioEvento() {
  const areas = useAreas();

  const methods = useForm({
    resolver: zodResolver(CadastrarEventoSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const testSubmit = data => {
    console.log('está enviando os dados');
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid grid-cols-3 gap-5 max-w-lg mx-auto mt-8 items-end"
        onSubmit={handleSubmit(testSubmit)}
      >
        <div className="col-span-2 flex flex-col items-start">
          <label
            htmlFor="event"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Nome do Evento
          </label>
          <input
            type="text"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('event')}
          />
          {errors.event && (
            <p className="text-red-600 text-sm mt-1 text-left">
              {errors.event.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="cnpq"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Selecione a área de conhecimento
          </label>
          <select
            id="cnpq"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('cnpq')}
          >
            {areas.map(area => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          {errors.cnpq && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.cnpq.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="indice"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Índice H5
          </label>
          <input
            type="text"
            className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
            placeholder="númerico (campo)"
            {...register('indice')}
          />
          {errors.indice && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.indice.message}
            </p>
          )}
        </div>

        <div className="col-span-2 flex flex-col items-start">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register('vinculoSBC')}
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">
              Vínculo com a SBC
            </span>
          </label>
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="accessLink"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Acesso
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('accessLink')}
          />
          {errors.accessLink && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.accessLink.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="repoScholar"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Repositório (GOOGLE-SCHOLAR)
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('repoScholar')}
          />
          {errors.repoScholar && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.repoScholar.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="repoSolSBC"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Repositório (SOL-SBC)
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('repoSolSBC')}
          />
          {errors.repoSolSBC && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.repoSolSBC.message}
            </p>
          )}
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
