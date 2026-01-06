import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CourseList = () => {
    const { isAdmin } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses/search', {
                params: { q: search, status: status || undefined, page, pageSize: 10 }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, status]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso? (Borrado lógico)')) {
            try {
                await api.delete(`/courses/${id}`);
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course', error);
            }
        }
    };

    const handleHardDelete = async (id) => {
        if (window.confirm('⚠️ ¡ATENCIÓN! Esta acción eliminará el curso PERMANENTEMENTE de la base de datos y no se puede deshacer. ¿Estás seguro?')) {
            try {
                await api.delete(`/courses/${id}/hard`);
                fetchCourses();
            } catch (error) {
                console.error('Error hard deleting course', error);
                const message = error.response?.data?.message || error.response?.data || 'Error al eliminar permanentemente el curso.';
                alert(`Error: ${message}`);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Mis Cursos</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona y publica tus contenidos educativos</p>
                </div>
                <Link to="/courses/new" className="btn btn-primary">
                    <span>+</span> Crear Nuevo Curso
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Buscar por título..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Todos los estados</option>
                            <option value="0">Borrador</option>
                            <option value="1">Publicado</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando cursos...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span className={`badge ${course.status === 1 ? 'badge-success' : 'badge-warning'}`}>
                                    {course.status === 1 ? 'Publicado' : 'Borrador'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {course.lessonCount} lecciones
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', minHeight: '2.5rem' }}>{course.title}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Última modificación: {new Date(course.updatedAt).toLocaleDateString()}
                            </p>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <Link to={`/courses/${course.id}`} className="btn btn-outline" style={{ flex: 1 }}>Editar</Link>
                                <Link to={`/courses/${course.id}/lessons`} className="btn btn-outline" style={{ flex: 1 }}>Lecciones</Link>
                                {isAdmin() && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleDelete(course.id)} className="btn btn-outline" style={{ color: 'var(--danger)', padding: '0.5rem' }} title="Borrado Lógico">
                                            🗑️
                                        </button>
                                        <button onClick={() => handleHardDelete(course.id)} className="btn btn-outline" style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '0.5rem' }} title="Borrado Permanente">
                                            🔥
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No se encontraron cursos. ¡Crea el primero!
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline"
                >
                    Anterior
                </button>
                <span style={{ fontWeight: 600 }}>Página {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={courses.length < 10}
                    className="btn btn-outline"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default CourseList;
