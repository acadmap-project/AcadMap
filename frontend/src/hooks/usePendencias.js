import { useState, useEffect } from 'react';
import axios from 'axios';
import useLogin from './userAuth';

function usePendencias() {
  const [pendencias, setPendencias] = useState([]);
  const { loggedIn } = useLogin();

  useEffect(() => {
    const fetchPendencias = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/veiculo/periodico-pendente`,
          {
            headers: {
              'X-User-Id': loggedIn.id,
            },
          }
        );
        let dados = response.data;
        setPendencias(dados);
      } catch (error) {
        console.error('Erro ao carregar pendencias:', error);
      }
    };

    fetchPendencias();
  }, [loggedIn.id]);
  const negarPendencias = async ({ id, userId, motivo }) => {
    console.log(
      'Attempting to reject pendencia with ID:',
      id,
      'User ID:',
      userId
    );

    // Validate required parameters
    if (!id) {
      throw new Error('ID do registro é obrigatório');
    }
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    if (!motivo) {
      throw new Error('Motivo para negação é obrigatório');
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/veiculo/negar-veiculo/${id}`,
        { motivo }, // Send motivo in the request body
        {
          headers: {
            'X-User-Id': userId,
            'Content-type' : 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      console.log('Reject pendencia response:', response);
      return response.data;
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

  const aprovarPendencias = async ({ id, userId }) => {
    console.log(
      'Attempting to approve pendencia with ID:',
      id,
      'User ID:',
      userId
    );

    // Validate required parameters
    if (!id) {
      throw new Error('ID do registro é obrigatório');
    }
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/veiculo/aprovar-veiculo/${id}`,
        null, // Explicitly set body to null for PUT requests without body
        {
          headers: {
            'X-User-Id': userId,
          },
          timeout: 10000, // 10 second timeout
        }
      );
      console.log('Approve pendencia response:', response);
      return response.data;
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
