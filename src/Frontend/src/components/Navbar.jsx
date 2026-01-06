import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/courses" style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    letterSpacing: '-0.025em'
                }}>
                    EduPlatform
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/dashboard" style={{
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                    }}>
                        Dashboard
                    </Link>
                    <Link to="/courses" style={{
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                    }}>
                        Mis Cursos
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Hola, {user.unique_name || user.sub}
                </span>
                <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav >
    );
};

export default Navbar;
