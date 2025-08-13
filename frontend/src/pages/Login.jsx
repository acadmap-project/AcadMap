import React, { useState } from 'react';
import HeaderSistema from '../components/HeaderSistema';

// Mock para teste

// const mockValidateUser = async (username, password) => {
//     return new Promise(res => {
//         setTimeout(() => {
//             // Mock validation logic
//             res(username === 'admin' && password === '1234');
//         }, 500);
//     });
// };

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loggedIn } = useLogin();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const isValid = await mockValidateUser(form.username, form.password);
        setLoading(false);
        if (isValid) {
            alert('Login successful!');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <>
            <HeaderSistema />
            <div style={{ maxWidth: 300, margin: '50px auto' }}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label>Password:</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{ marginTop: 15 }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;