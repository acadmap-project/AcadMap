import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

const mockValidateUser = async (username, password) => {
    return new Promise(res => {
        setTimeout(() => {
            // Mock validation logic for demo users
            const validUsers = [
                { username: 'admin', password: '1234', userType: 'ADMINISTRADOR' },
                { username: 'pesquisador', password: '1234', userType: 'PESQUISADOR' },
                { username: 'auditor', password: '1234', userType: 'AUDITOR' }
            ];
            
            const user = validUsers.find(u => u.username === username && u.password === password);
            res(user || null);
        }, 500);
    });
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
            const user = await mockValidateUser(form.username, form.password);
            if (user) {
                login({ userType: user.userType });
                navigate('/');
            } else {
                setError('Usuário ou senha inválidos');
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderSistema />
            <div className="mt-24 bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="text-center text-3xl text-black" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
                            Login
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600" style={{ fontFamily: 'Poppins', fontWeight: '300' }}>
                            Entre com suas credenciais para acessar o sistema
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm text-black mb-2" style={{ fontFamily: 'Poppins', fontWeight: '400' }}>
                                    Usuário
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    className="w-full px-3 py-2 border-2 border-black rounded-none text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    style={{ fontFamily: 'Poppins', fontWeight: '300' }}
                                    placeholder="Digite seu usuário"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm text-black mb-2" style={{ fontFamily: 'Poppins', fontWeight: '400' }}>
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border-2 border-black rounded-none text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    style={{ fontFamily: 'Poppins', fontWeight: '300' }}
                                    placeholder="Digite sua senha"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center" style={{ fontFamily: 'Poppins', fontWeight: '400' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-black text-white border-0 rounded-none hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                style={{ fontFamily: 'Poppins', fontWeight: '400' }}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>

                        <div className="mt-6 text-xs text-gray-500 text-center" style={{ fontFamily: 'Poppins', fontWeight: '300' }}>
                            <p>Usuários de demonstração:</p>
                            <p>admin/1234 (Administrador) | pesquisador/1234 (Pesquisador) | auditor/1234 (Auditor)</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;