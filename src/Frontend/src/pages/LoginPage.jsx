import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/courses');
        } catch (err) {
            setError('Credenciales inválidas. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '1rem'
        }}>
            <div className="card animate-fade" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bienvenido</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Ingresa a tu plataforma de aprendizaje
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        color: 'var(--danger)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #fee2e2'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem' }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    ¿No tienes cuenta? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Regístrate</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
