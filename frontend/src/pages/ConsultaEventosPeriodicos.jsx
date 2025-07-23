import FiltroEventosPeriodicos from "../components/FiltroEventosPeriodicos";
import HeaderSistema from "../components/HeaderSistema";
import { useState } from "react";
import useLogin from "../hooks/userAuth";

function ConsultaEventosPeriodicos() {

    const [resultados, setResultados] = useState({ eventos: [], periodicos: [] });

    const onResultados = ({ eventos, periodicos }) => {
        setResultados({
            eventos: Array.isArray(eventos) ? eventos : [],
            periodicos: Array.isArray(periodicos) ? periodicos : []
        });
    };
    const { loggedIn } = useLogin();

    return (
        <>
            <HeaderSistema
                userName={loggedIn ? loggedIn.userName : "Usuário Desconhecido"}
                userType={loggedIn ? loggedIn.userType : "NÃO LOGADO"}
            />

            <h1 className="mt-8 mb-12">Consulta de Eventos e Periódicos</h1>
            <div className="w-full flex justify-center">
                <FiltroEventosPeriodicos onResultados={onResultados} />
            </div>

            <div className="w-full max-w-5xl mx-auto mt-8">
                {resultados !== null && (
                    <table className="w-full border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">Tipo</th>
                                <th className="border px-2 py-1">Nome</th>
                                <th className="border px-2 py-1">Área</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...resultados.eventos.map(ev => ({
                                id: ev.id,
                                tipo: "Evento",
                                nome: ev.nome,
                                areaConhecimento: ev.areaConhecimento
                            })),
                            ...resultados.periodicos.map(p => ({
                                id: p.id,
                                tipo: "Periódico",
                                nome: p.nome,
                                areaConhecimento: p.areaConhecimento
                            }))]
                                .map(item => (
                                    <tr key={item.tipo + "-" + item.id}>
                                        <td className="border px-2 py-1">{item.tipo}</td>
                                        <td className="border px-2 py-1">{item.nome}</td>
                                        <td className="border px-2 py-1">{item.areaConhecimento}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default ConsultaEventosPeriodicos;