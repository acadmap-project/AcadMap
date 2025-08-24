import { useState, useEffect } from 'react';
import { get } from '../utils/authFetch';
import renomearKey from '../utils/renomearKey';
import Logger from '../utils/logger.js';

function useAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await get('/api/areas/listar', {}, false); // This endpoint might not require auth
        if (!response.ok) throw new Error('Erro ao carregar áreas');
        let dados = await response.json();
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], 'nome', 'label');
          dados[i] = renomearKey(dados[i], 'id', 'value');
        }
        setAreas(dados);
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
        Logger.logError(`Erro ao carregar áreas: ${error.message}`);
      }
    };

    fetchAreas();
  }, []);

  return areas;
}

export default useAreas;
