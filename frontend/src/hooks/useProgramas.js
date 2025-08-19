import { useState, useEffect } from 'react';
import renomearKey from '../utils/renomearKey';
import { get } from '../utils/authFetch';

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function useProgramas() {
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await get('/api/programa/listar', {}, false); // This endpoint might not require auth
        if (!response.ok) throw new Error('Erro ao carregar programas');
        let dados = await response.json();
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], 'nome', 'label');
          dados[i].label = toTitleCase(dados[i].label);
          dados[i] = renomearKey(dados[i], 'id', 'value');
        }
        setProgramas(dados);
      } catch (error) {
        console.error('Erro ao carregar programas:', error);
      }
    };

    fetchProgramas();
  }, []);

  return programas;
}

export default useProgramas;
