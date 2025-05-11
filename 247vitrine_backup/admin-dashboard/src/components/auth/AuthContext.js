// In src/components/auth/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// API-URL aus Umgebungsvariablen oder Fallback auf lokale URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
console.log('Using API URL:', API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beim Laden der App: Token überprüfen und Benutzerinfo laden
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Token zu den Headers hinzufügen (sowohl als x-auth-token als auch als Authorization Bearer)
          axios.defaults.headers.common['x-auth-token'] = token;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          console.log('Attempting to load user with token:', token.substring(0, 10) + '...');

          // Benutzerinfo abrufen
          const res = await axios.get(`${API_URL}/api/auth/me`);
          console.log('User loaded successfully:', res.data);

          // Benutzer setzen
          setUser(res.data);
          setLoading(false);
        } catch (error) {
          console.error('Error loading user:', error);

          // Token entfernen und Benutzer zurücksetzen
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      } else {
        console.log('No token found, user not authenticated');

        // Sicherstellen, dass der Benutzer zurückgesetzt wird
        setUser(null);
        setLoading(false);
      }
    };

    // Benutzer laden
    loadUser();
  }, [token]);

  // Registrierung
  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering user with data:', { ...userData, password: '***' });

      // Registrierungsanfrage senden
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log('Registration response:', res.data);

      if (!res.data || !res.data.token) {
        console.error('Registration failed: No token received');
        throw new Error('No token received from server');
      }

      // Token speichern
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);

      // Token zu den Headers hinzufügen (sowohl als x-auth-token als auch als Authorization Bearer)
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      console.log('Token set in headers');

      // Benutzerinfo setzen
      setUser(res.data.user);
      console.log('User set in context:', res.data.user);

      return res.data;
    } catch (error) {
      console.error('Registration error details:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Logging in user with email:', email);

      // Login-Anfrage senden
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log('Login response:', res.data);

      if (!res.data || !res.data.token) {
        console.error('Login failed: No token received');
        throw new Error('No token received from server');
      }

      // Token speichern
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);

      // Token zu den Headers hinzufügen (sowohl als x-auth-token als auch als Authorization Bearer)
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      console.log('Token set in headers');

      // Benutzerinfo setzen
      setUser(res.data.user);
      console.log('User set in context:', res.data.user);

      return res.data;
    } catch (error) {
      console.error('Login error details:', error);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout
  const logout = () => {
    console.log('Logging out user');

    // Token entfernen
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    delete axios.defaults.headers.common['Authorization'];

    // Zustand zurücksetzen
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
