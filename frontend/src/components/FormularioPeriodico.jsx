import useAreas from "../hooks/useAreas";

export default function FormularioPeriodico() {
  const { areas } = useAreas();

  return (
    <form 
        className="grid grid-cols-3 gap-5 max-w-lg mx-auto mt-8 items-end"
    >
    <div>
        <label htmlFor="periodicoNome">Nome do Periódico*</label>
        <input
        type="text"
        name="periodicoNome"
        placeholder="Digite o nome do periódico..."
        required
        />
    </div>
    
    <div>
        <label 
          htmlFor="areaConhecimento" 
          className="block mb-2 text-sm font-medium text-white text-start"
        >
          Selecione a área de conhecimento
        </label>
        <select 
        id="areaConhecimento" 
        name="areaConhecimento"
        className= "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
        required
        {...register("areaConhecimento")}
        >
            <option value="" disabled className="text-gray-400">
                Selecione
            </option>
          {areas.map((area) => (
            <option key={area.key} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
    </div>

    <div className="flex flex-col items-start">
        <label 
            htmlFor="issn"
            className="block mb-2 text-sm font-medium text-white text-start">
            ISSN
        </label>
        <input
        type="number"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="issn"
        placeholder="Informar 0 ou deixar em branco se não aplicável/desconhecido"
        />
    </div>

    <div className="col-span-2 flex flex-col items-start">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">
              Vínculo com a SBC
            </span>
          </label>
    </div>
    
    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="linkPeriodico"
            className="block mb-2 text-sm font-medium text-white text-start">
            Link de acesso ao periódico*
        </label>
        <input
        type="url"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="linkPeriodico"
        placeholder="Digite uma URL válida..."
        required
        />
    </div>

    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="linkRepoJCR"
            className="block mb-2 text-sm font-medium text-white text-start">
            Link para repositório JCR
        </label>
        <input
        type="url"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="linkRepoJCR"
        placeholder="Digite uma URL válida..."
        />
    </div>
    
    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="linkRepoScopus"
            className="block mb-2 text-sm font-medium text-white text-start">
            Link para repositório SCOPUS
        </label>
        <input
        type="url"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="linkRepoScopus"
        placeholder="Digite uma URL válida..."
        />
    </div>
    
    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="linkRepoScholar"
            className="block mb-2 text-sm font-medium text-white text-start">
            Link para repositório Google Scholar
        </label>
        <input
        type="url"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="linkRepoScholar"
        placeholder="Digite uma URL válida..."
        />
    </div>
    
    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="qualis"
            className="block mb-2 text-sm font-medium text-white text-start">
            Nota no antigo QUALIS
        </label>
        <input
        type="number"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="qualis"
        placeholder="Digite a nota do periódico no antigo QUALIS."
        />
    </div>
    
    <div className="col-span-2 flex flex-col items-start">
        <label 
            htmlFor="percentil"
            className="block mb-2 text-sm font-medium text-white text-start">
            Percentil*
        </label>
        <input
        type="number"
        className="border text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
        name="percentil"
        placeholder="Digite o percentil do periódico (0-100)..."
        required
        />
    </div>
    
    <div className="col-span-3 flex justify-end">
        <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Enviar
        </button>
    </div>
    </form>
  );
}