import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && typeof storedUser === 'object') {
      setUser(storedUser);
    } else {
      localStorage.removeItem('user'); // 🔒 sécurité en cas de format cassé
    }
  } catch {
    localStorage.removeItem('user');
  }
  setLoading(false);
}, []);

  // ✅ Corrigé : accepte un objet user complet
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
