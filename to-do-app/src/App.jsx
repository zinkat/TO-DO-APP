// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar'; 
import { useEffect, useState } from 'react';


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>; // ⏳ empêche redirection prématurée
  return user ? children : <Navigate to="/login" />;
}

function App() {

  const [theme, setTheme] = useState('light');

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) setTheme(savedTheme);
}, []);

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};

  return (
  <div className={theme === 'dark' ? 'dark' : ''}>
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <AuthProvider>
      <Router>
         <Navbar toggleTheme={toggleTheme} theme={theme} />
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  </div>
  );
}

export default App;