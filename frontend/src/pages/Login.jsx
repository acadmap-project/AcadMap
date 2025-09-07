import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import { API_URL } from '../utils/apiUrl';

const decodeJWT = token => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

const authenticateUser = async (username, password) => {
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const tokenData = await response.json();
      const jwtPayload = decodeJWT(tokenData.accessToken);

      return {
        success: true,
        tokens: tokenData,
        userInfo: {
          userName: jwtPayload?.sub || username,
          userType: jwtPayload?.scope?.toUpperCase() || 'PESQUISADOR',
        },
      };
    } else {
      return {
        success: false,
        error:
          response.status === 401
            ? 'Credenciais inválidas'
            : 'Erro no servidor',
      };
    }
  } catch {
    return {
      success: false,
      error: 'Credenciais inválidas',
    };
  }
};

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loggedIn, login } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn?.isLoggedIn) {
      navigate('/');
    }
  }, [loggedIn, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authenticateUser(form.username, form.password);
      if (result.success) {
        // Store the tokens and user info from JWT
        login({
          accessToken: result.tokens.accessToken,
          refreshTokenUUID: result.tokens.refreshTokenUUID,
          userName: result.userInfo.userName,
          userType: result.userInfo.userType,
        });
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderSistema />
      <div className="mt-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-semibold">Login</h2>
            <p className="mt-2 text-center text-sm font-light">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="fieldset-legend">
                  Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoFocus
                  className="w-full input"
                  placeholder="Digite seu usuário"
                />
              </div>
              <div>
                <label htmlFor="password" className="fieldset-legend">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full input"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
