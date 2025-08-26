import { useState, useEffect } from 'react';
import useLogin from './userAuth';
import { get, put } from '../utils/authFetch';
import Logger from '../utils/logger';

function usePendencias() {
  const [pendencias, setPendencias] = useState([]);
  const { loggedIn } = useLogin();

  useEffect(() => {
    const fetchPendencias = async () => {
      try {
        const response = await get('/api/veiculo/periodico-pendente');
        if (!response.ok) throw new Error('Erro ao carregar pendencias');
        let dados = await response.json();
        setPendencias(dados);
      } catch (error) {
        console.error('Erro ao carregar pendencias:', error);
        Logger.logError(`Erro ao carregar pendencias: ${error.message}`);
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
      const response = await put(`/api/veiculo/negar-veiculo/${id}`, {
        justificativa,
        flagPredatorio,
      });
      if (!response.ok) throw new Error('Erro ao negar pendencia');
      const data = await response.json();
      console.log('Reject pendencia response:', data);
      return data;
    } catch (error) {
      console.error('Error in negarPendencias:', error);
      Logger.logError(`Erro em negarPendencias - ID: ${id} - ${error.message}`);

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
      const response = await put(`/api/veiculo/aprovar-veiculo/${id}`, {
        flagPredatorio,
      });
      if (!response.ok)
        throw new Error(
          'Ocorreu um erro ao registrar a ação. A operação foi cancelada para garantir a integridade dos dados.'
        );
      const data = await response.json();
      console.log('Approve pendencia response:', data);
      return data;
    } catch (error) {
      console.error('Error in aprovarPendencias:', error);
      Logger.logError(
        `Erro em aprovarPendencias - ID: ${id} - ${error.message}`
      );

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
