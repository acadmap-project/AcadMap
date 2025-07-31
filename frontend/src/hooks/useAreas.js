import { useState, useEffect } from 'react';
import { API_URL } from '../utils/apiUrl';
import renomearKey from '../utils/renomearKey';

function useAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/areas/listar`);
        if (!response.ok) throw new Error('Erro ao carregar áreas');
        let dados = await response.json();
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
