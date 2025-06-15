import { useState, useEffect } from 'react';
import axios from 'axios';
import renomearKey from '../utils/renomearKey';

function useProgramas() {
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/programa/listar'
        );
        let dados = response.data;
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], 'nome', 'label');
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
