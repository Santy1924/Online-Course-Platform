import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CourseEdit = () => {
    const { isAdmin } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState(0);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchCourse = async () => {
                try {
                    const response = await api.get(`/courses/${id}`);
                    setTitle(response.data.title);
                    setStatus(response.data.status);
                    setUpdatedAt(response.data.updatedAt);
                } catch (error) {
                    console.error('Error fetching course', error);
                }
            };
            fetchCourse();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (id) {
                await api.put(`/courses/${id}`, { title });
            } else {
                await api.post('/courses', { title });
            }
            navigate('/courses');
        } catch (err) {
            setError('Error al guardar el curso. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            if (status === 0) {
                await api.patch(`/courses/${id}/publish`);
                setStatus(1);
            } else {
                await api.patch(`/courses/${id}/unpublish`);
                setStatus(0);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cambiar el estado del curso.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Volver a mis cursos
                </Link>
                <h1 style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>{id ? 'Editar Curso' : 'Crear Nuevo Curso'}</h1>
                {id && updatedAt && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Última modificación: {new Date(updatedAt).toLocaleString()}
                    </p>
                )}
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fee2e2' }}>
                    {error}
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Título del Curso
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Master en React y Clean Architecture"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>

                        {id && isAdmin() && (
                            <button
                                type="button"
                                onClick={handlePublish}
                                className="btn btn-outline"
                                style={{
                                    flex: 1,
                                    borderColor: status === 0 ? 'var(--success)' : 'var(--warning)',
                                    color: status === 0 ? 'var(--success)' : 'var(--warning)'
                                }}
                            >
                                {status === 0 ? '🚀 Publicar Curso' : '⏸️ Despublicar'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {id && (
                <div className="card" style={{ marginTop: '1.5rem', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ marginBottom: '0.25rem' }}>Contenido del curso</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Gestiona las lecciones y el orden de aprendizaje</p>
                        </div>
                        <Link to={`/courses/${id}/lessons`} className="btn btn-outline">Gestionar Lecciones</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseEdit;
