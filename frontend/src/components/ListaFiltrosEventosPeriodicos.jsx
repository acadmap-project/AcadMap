
import { useState, useEffect } from 'react';

function ListaFiltrosEventosPeriodicos({ filtros, areas = [] }) {
    const [filtrosAtivos, setFiltrosAtivos] = useState({});

    useEffect(() => {
        setFiltrosAtivos(filtros || {});
    }, [filtros]);

    const labels = {
        nome: 'Nome',
        areasPesquisaIds: 'Área',
        vinculoSbcCheckbox: 'Vínculo SBC',
        h5Minimo: 'H5 Mínimo',
        classificacaoMinima: 'Classificação',
        modoCombinacao: 'Modo de Combinação',
        adequacaoMestrado: 'Adequação: Mestrado',
        adequacaoDoutorado: 'Adequação: Doutorado',
    };

    const renderFiltros = () => {
        const items = [];

        if (filtrosAtivos.areasPesquisaIds && filtrosAtivos.areasPesquisaIds.length > 0) {
            const nomes = filtrosAtivos.areasPesquisaIds
                .map(id => {
                    const area = areas.find(a => a.value === id);
                    return area ? area.label : id;
                })
                .join(', ');
            items.push(
                <li key="areas" className="bg-gray-200 px-3 py-1 rounded text-xs">
                    {labels.areasPesquisaIds}: {nomes}
                </li>
            );
        }
        if (filtrosAtivos.vinculoSbcCheckbox) {
            items.push(
                <li key="vinculo" className="bg-gray-200 px-3 py-1 rounded text-xs">
                    {labels.vinculoSbcCheckbox}
                </li>
            );
        }
        if (filtrosAtivos.h5Minimo !== undefined && filtrosAtivos.h5Minimo !== null && filtrosAtivos.h5Minimo !== '') {
            items.push(
                <li key="h5" className="bg-gray-200 px-3 py-1 rounded text-xs">
                    {labels.h5Minimo}: {filtrosAtivos.h5Minimo}
                </li>
            )
        }
        if (filtrosAtivos.classificacaoMinima !== undefined && filtrosAtivos.classificacaoMinima !== null && filtrosAtivos.classificacaoMinima !== '') {
            items.push(
                <li key="classificacao" className="bg-gray-200 px-3 py-1 rounded text-xs">
                    {labels.classificacaoMinima}: {filtrosAtivos.classificacaoMinima}
                </li>
            );
        }
        if (filtrosAtivos.modoCombinacao !== undefined && filtrosAtivos.modoCombinacao !== null && filtrosAtivos.modoCombinacao !== '') {
            items.push(
                <li key="modo" className="bg-gray-200 px-3 py-1 rounded text-xs">
                    {labels.modoCombinacao}: {filtrosAtivos.modoCombinacao}
                </li>
            );
        }

        if (Array.isArray(filtrosAtivos.adequacaoDefesas) && filtrosAtivos.adequacaoDefesas.length > 0) {
            const adequacoes = [];
            if (filtrosAtivos.adequacaoDefesas.includes('mestrado')) {
                adequacoes.push('mestrado');
            }
            if (filtrosAtivos.adequacaoDefesas.includes('doutorado')) {
                adequacoes.push('doutorado');
            }
            if (adequacoes.length > 0) {
                items.push(
                    <li key="adequacao" className="bg-gray-200 px-3 py-1 rounded text-xs">
                        {labels.adequacaoMestrado.split(':')[0]}: {adequacoes.join(', ')}
                    </li>
                );
            }
        }

        if (items.length === 0) {
            return (
                <li className="text-xs text-gray-500">Nenhum filtro aplicado</li>
            );
        }

        return items;
    };

    return (
        <ul className="flex flex-wrap gap-2 mb-4">
            {renderFiltros()}
        </ul>
    );
};

export default ListaFiltrosEventosPeriodicos;