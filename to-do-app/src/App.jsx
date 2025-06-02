// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>; // ⏳ empêche redirection prématurée
  return user ? children : <Navigate to="/login" />;
}
function App() {
  return (
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;