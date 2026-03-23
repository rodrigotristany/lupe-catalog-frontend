import { createContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/admin';

export const AuthContext = createContext(null);

function loadFromStorage() {
  const token = localStorage.getItem('lupe_admin_token');
  const username = localStorage.getItem('lupe_admin_username');
  return { token, username, isAuthenticated: !!token };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadFromStorage);

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password);
    const token = data.token || data.access;
    localStorage.setItem('lupe_admin_token', token);
    localStorage.setItem('lupe_admin_username', username);
    setAuth({ token, username, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lupe_admin_token');
    localStorage.removeItem('lupe_admin_username');
    setAuth({ token: null, username: null, isAuthenticated: false });
    window.location.href = '/admin/login';
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
