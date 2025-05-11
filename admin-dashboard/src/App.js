import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import BlogRoutes from './components/blog/Blog';
import './App.css';

// Setze die Basis-URL für Axios
axios.defaults.baseURL = 'http://localhost:3002';

// Füge den Auth-Token zu jeder Anfrage hinzu, wenn vorhanden
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        console.error('Error checking authentication:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Fehler bei der Anmeldung'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading-app">Lädt Anwendung...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="logo">
              <Link to="/">247Vitrine</Link>
            </div>
            <nav className="main-nav">
              <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/websites">Websites</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                {isAuthenticated ? (
                  <li>
                    <button onClick={logout} className="logout-button">
                      Abmelden
                    </button>
                  </li>
                ) : (
                  <li><Link to="/login">Anmelden</Link></li>
                )}
              </ul>
            </nav>
          </header>

          <main className="app-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/blog/*" element={<BlogRoutes />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} 247Vitrine. Alle Rechte vorbehalten.</p>
          </footer>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

// Platzhalter-Komponenten
const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <p>Willkommen im 247Vitrine Admin-Dashboard!</p>
  </div>
);

// Login-Komponente mit useNavigate-Hook
const LoginPage = () => {
  // Verwende den useNavigate-Hook
  return <LoginForm />;
};

// Tatsächliche Login-Formular-Komponente
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Anmelden</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
