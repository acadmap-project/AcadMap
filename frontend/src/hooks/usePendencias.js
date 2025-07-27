import { useState, useEffect } from 'react';
import useLogin from './userAuth';
import { API_URL } from '../utils/apiUrl';

function usePendencias() {
  const [pendencias, setPendencias] = useState([]);
  const { loggedIn } = useLogin();

  useEffect(() => {
    const fetchPendencias = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/veiculo/periodico-pendente`,
          {
            headers: {
              'X-User-Id': loggedIn.id,
            },
          }
        );
        if (!response.ok) throw new Error('Erro ao carregar pendencias');
        let dados = await response.json();
        setPendencias(dados);
      } catch (error) {
        console.error('Erro ao carregar pendencias:', error);
      }
    };

    fetchPendencias();
  }, [loggedIn.id]);
  const negarPendencias = async ({
    id,
    userId,
    justificativa,
    flagPredatorio = false,
  }) => {
    console.log(
      'Attempting to reject pendencia with ID:',
      id,
      'User ID:',
      userId,
      'flagPredatorio:',
      flagPredatorio,
      'justificativa:',
      justificativa
    );

    // Validate required parameters
    if (!id) {
      throw new Error('ID do registro é obrigatório');
    }
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    if (!justificativa) {
      throw new Error('Justificativa para negação é obrigatório');
    }

    try {
      const response = await fetch(
        `${API_URL}/api/veiculo/negar-veiculo/${id}`,
        {
          method: 'PUT',
          headers: {
            'X-User-Id': userId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ justificativa, flagPredatorio }),
        }
      );
      if (!response.ok) throw new Error('Erro ao negar pendencia');
      const data = await response.json();
      console.log('Reject pendencia response:', data);
      return data;
    } catch (error) {
      console.error('Error in negarPendencias:', error);

      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout: A requisição demorou muito para responder');
      }

      if (error.response) {
        // Server responded with error status
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        throw error;
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        throw new Error('Erro de rede: Não foi possível conectar ao servidor');
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        throw error;
      }
    }
  };

  const aprovarPendencias = async ({ id, userId, flagPredatorio = false }) => {
    console.log(
      'Attempting to approve pendencia with ID:',
      id,
      'User ID:',
      userId,
      'flagPredatorio:',
      flagPredatorio
    );

    // Validate required parameters
    if (!id) {
      throw new Error('ID do registro é obrigatório');
    }
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const response = await fetch(
        `${API_URL}/api/veiculo/aprovar-veiculo/${id}`,
        {
          method: 'PUT',
          headers: {
            'X-User-Id': userId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flagPredatorio }),
        }
      );
      if (!response.ok) throw new Error('Erro ao aprovar pendencia');
      const data = await response.json();
      console.log('Approve pendencia response:', data);
      return data;
    } catch (error) {
      console.error('Error in aprovarPendencias:', error);

      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout: A requisição demorou muito para responder');
      }

      if (error.response) {
        // Server responded with error status
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        throw error;
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        throw new Error('Erro de rede: Não foi possível conectar ao servidor');
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        throw error;
      }
    }
  };
  return {
    pendencias,
    negarPendencias,
    aprovarPendencias,
  };
}

export default usePendencias;
