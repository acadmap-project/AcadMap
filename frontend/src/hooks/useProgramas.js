import { useState, useEffect } from 'react';
import renomearKey from '../utils/renomearKey';
import { API_URL } from '../utils/apiUrl';

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
        const response = await fetch(`${API_URL}/api/programa/listar`);
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
