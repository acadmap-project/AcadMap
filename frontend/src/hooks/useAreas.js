import { useState, useEffect } from 'react';
import axios from 'axios';
import renomearKey from '../utils/renomearKey';

function useAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/areas/listar'
        );
        let dados = response.data;
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], 'nome', 'label');
          dados[i] = renomearKey(dados[i], 'id', 'value');
        }
        setAreas(dados);
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      }
    };

    fetchAreas();
  }, []);

  return areas;
}

export default useAreas;
