import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CourseList from './pages/CourseList';
import CourseEdit from './pages/CourseEdit';
import LessonList from './pages/LessonList';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="animate-fade">Cargando...</div>
        </div>
    );
    return user ? (
        <>
            <Navbar />
            <main className="container animate-fade">
                {children}
            </main>
        </>
    ) : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
                    <Route path="/courses/new" element={<PrivateRoute><CourseEdit /></PrivateRoute>} />
                    <Route path="/courses/:id" element={<PrivateRoute><CourseEdit /></PrivateRoute>} />
                    <Route path="/courses/:courseId/lessons" element={<PrivateRoute><LessonList /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/courses" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
