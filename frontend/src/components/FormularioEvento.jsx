import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CadastrarEventoSchema } from '../schemas/CadastrarEventoSchema';
import useAreas from '../hooks/useAreas';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();

const postEvent = async (eventData) => {
  console.log(eventData);
  const response = await fetch(
    'http://localhost:8080/api/eventos/cadastro', {
    method: "POST",
    headers: {
      'X-User-Id': '11111111-1111-1111-1111-111111111111', // TODO: Implementar lógica para pegar o ID do usuário logado
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
    }
  );

  return response.json();
};

function FormularioEventoContent() {
  const areas = useAreas();

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
    onSuccess: (data) => {
      console.log('Api utilizada com sucesso:', data);
    },
    onError: (error) => {
      console.error('Endpoint para cadastrar evento com erro:', error);
    },
  });


  const onSubmit = data => {
    const eventData = {
      ...data,
      vinculoSbc: "sem_vinculo", // TODO: Implementar lógica para vincular com a dropdown SBC,
      areasPesquisaIds: [data.areasPesquisaIds], // TODO: Implementar lógica para permitir multiplas areas selecionadas
    };
    console.log('Submitting event data:', eventData);
    createEventMutation.mutate(eventData);
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid grid-cols-3 gap-5 max-w-lg mx-auto mt-8 items-end"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2 flex flex-col items-start">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Nome do Evento
          </label>
          <input
            type="text"
            className="border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite..."
            {...register('nome')}
          />
          {errors.nome && (
            <p className="text-red-600 text-sm mt-1 text-left">
              {errors.nome.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="areasPesquisaIds"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Selecione a área de conhecimento
          </label>
          <select
            id="areasPesquisaIds"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
            {...register('areasPesquisaIds')}
          >
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
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="h5"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Índice H5
          </label>
          <input
            type="text"
            className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
            placeholder="númerico (campo)"
            {...register('h5')}
          />
          {errors.h5 && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.h5.message}
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
            htmlFor="linkEvento"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Acesso
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkEvento')}
          />
          {errors.linkEvento && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkEvento.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="linkGoogleScholar"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Repositório (GOOGLE-SCHOLAR)
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkGoogleScholar')}
          />
          {errors.linkGoogleScholar && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkGoogleScholar.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label
            htmlFor="linkSolSbc"
            className="block mb-2 text-sm font-medium text-white text-start"
          >
            Link de Repositório (SOL-SBC)
          </label>
          <input
            type="url"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="URL válida"
            {...register('linkSolSbc')}
          />
          {errors.linkSolSbc && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.linkSolSbc.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={createEventMutation.isPending}
          className="col-start-2 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border border-gray-700"
        >
          {createEventMutation.isPending ? 'Saving...' : 'Salvar e Continuar'}
        </button>
      </form>
    </FormProvider>
  );
}

function FormularioEvento() {
  return (
    <QueryClientProvider client={queryClient}>
      <FormularioEventoContent />
    </QueryClientProvider>
  );
}

export default FormularioEvento;
