import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';

const LessonList = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLessons = async () => {
        try {
            const response = await api.get(`/lessons/course/${courseId}`);
            setLessons(response.data);
            const maxOrder = response.data.reduce((max, l) => Math.max(max, l.order), 0);
            setOrder(maxOrder + 1);
        } catch (error) {
            console.error('Error fetching lessons', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            setCourse(response.data);
        } catch (error) {
            console.error('Error fetching course', error);
        }
    };

    useEffect(() => {
        fetchLessons();
        fetchCourse();
    }, [courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/lessons/${editingId}`, { title, order: parseInt(order) });
                setEditingId(null);
            } else {
                await api.post('/lessons', { courseId, title, order: parseInt(order) });
            }
            setTitle('');
            fetchLessons();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar la lección');
        }
    };

    const handleEdit = (lesson) => {
        setTitle(lesson.title);
        setOrder(lesson.order);
        setEditingId(lesson.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Deseas eliminar esta lección?')) {
            try {
                await api.delete(`/lessons/${id}`);
                fetchLessons();
            } catch (error) {
                console.error('Error deleting lesson', error);
            }
        }
    };

    const handleReorder = async (direction, index) => {
        const newLessons = [...lessons];
        const temp = newLessons[index];
        newLessons[index] = newLessons[index + direction];
        newLessons[index + direction] = temp;

        setLessons(newLessons);

        try {
            await api.post('/lessons/reorder', {
                courseId,
                newOrder: newLessons.map(l => l.id)
            });
            fetchLessons();
        } catch (error) {
            console.error('Error reordering', error);
            fetchLessons();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to={`/courses/${courseId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Volver al curso
                </Link>
                <h1 style={{ marginTop: '1rem' }}>Lecciones: {course?.title}</h1>
            </div>

            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.125rem' }}>{editingId ? '📝 Editar Lección' : '✨ Agregar Nueva Lección'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Título</label>
                        <input
                            type="text"
                            placeholder="Nombre de la lección"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ width: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Orden</label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Actualizar' : 'Agregar'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setTitle(''); }} className="btn btn-outline">
                            Cancelar
                        </button>
                    )}
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando lecciones...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {lessons.map((lesson, index) => (
                        <div key={lesson.id} className="card" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--background)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: 'var(--primary)'
                                }}>
                                    {lesson.order}
                                </div>
                                <span style={{ fontWeight: 500 }}>{lesson.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '2px', marginRight: '1rem' }}>
                                    <button
                                        disabled={index === 0}
                                        onClick={() => handleReorder(-1, index)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.25rem 0.5rem' }}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        disabled={index === lessons.length - 1}
                                        onClick={() => handleReorder(1, index)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.25rem 0.5rem' }}
                                    >
                                        ▼
                                    </button>
                                </div>
                                <button onClick={() => handleEdit(lesson)} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Editar</button>
                                <button onClick={() => handleDelete(lesson.id)} className="btn btn-outline" style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                    {lessons.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
                            Aún no hay lecciones en este curso.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LessonList;
