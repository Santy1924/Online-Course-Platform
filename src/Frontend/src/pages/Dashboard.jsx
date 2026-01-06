import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/dashboard/metrics');
                setMetrics(response.data);
            } catch (error) {
                console.error('Error fetching metrics', error);
                setError('No se pudieron cargar las métricas. Asegúrate de que la API esté corriendo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando métricas...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Panel de Control</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Cursos</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics?.totalCourses ?? 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--success)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Publicados</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--success)' }}>{metrics?.publishedCourses ?? 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--warning)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Borradores</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--warning)' }}>{metrics?.draftCourses ?? 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lecciones</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics?.totalLessons ?? 0}</p>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Resumen de Actividad</h3>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido al panel de administración. Aquí puedes ver un resumen rápido de tu contenido educativo.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Estado de Publicación</h4>
                        <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{
                                width: `${(metrics?.publishedCourses / metrics?.totalCourses) * 100}%`,
                                background: 'var(--success)'
                            }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            {Math.round((metrics?.publishedCourses / metrics?.totalCourses) * 100) || 0}% de los cursos están publicados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
