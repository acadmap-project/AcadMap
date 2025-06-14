import { useNavigate, useLocation } from 'react-router-dom';

function ValidacaoCadastro() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <p className="text-white px-6 pt-10">Dados não encontrados.</p>;

    const handleAprovar = () => {
        console.log('Aprovado:', state.id);
        navigate('/cadastro-pendente');
    };

    const handleNegar = () => {
        console.log('Negado:', state.id);
        navigate('/cadastro-pendente');
    };

    return (
        <div className="min-h-screen bg-[#0c1220] text-white px-6 py-10 flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-8">Gerenciador de Cadastros Pendentes</h1>

            <div className="bg-[#161b2d] w-full max-w-2xl rounded-md shadow-lg p-6 space-y-4">
                <div>
                    <p className="text-gray-400 text-sm">Nome do Usuário que Cadastrou</p>
                    <p className="text-lg font-medium">{state.usuario}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-sm">Nome do Evento ou Periódico</p>
                    <p className="text-lg font-medium">{state.nomeVeiculo} ({state.tipo})</p>
                </div>

                <div>
                    <p className="text-gray-400 text-sm">Cálculo para Verificação de Índice</p>
                    <p className="text-lg font-medium">{state.indice}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-sm">Link de Acesso</p>
                    <a href={state.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">
                        {state.link}
                    </a>
                </div>

                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={handleAprovar}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
                    >
                        Aprovar
                    </button>
                    <button
                        onClick={handleNegar}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold"
                    >
                        Negar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ValidacaoCadastro;