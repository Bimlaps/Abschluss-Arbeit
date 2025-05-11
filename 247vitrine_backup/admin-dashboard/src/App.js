import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import TemplateEditor from './components/TemplateEditor';
import WebsiteCreationWizard from './components/wizard/WebsiteCreationWizard';
import WebsiteEditor from './components/websites/WebsiteEditor';
import Preview from './components/preview/Preview';
import PreviewRender from './components/preview/PreviewRender';
import MainNavigation from './components/common/MainNavigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { DeviceProvider } from './components/common/DeviceContext';
import { API_BASE_URL } from './config';

// Für die Abwärtskompatibilität
const API_URL = API_BASE_URL;
console.log('App.js: Using API URL:', API_URL);

// Geschützte Route
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('ProtectedRoute: Initial state -', 'User:', user, 'Loading:', loading);

  // Wenn noch geladen wird, Ladebildschirm anzeigen
  if (loading) {
    console.log('ProtectedRoute: Still loading, showing loading screen');
    return <div className="loading">Loading...</div>;
  }

  // Wenn kein Benutzer vorhanden ist, zur Login-Seite weiterleiten
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Benutzer ist authentifiziert, Element anzeigen
  console.log('ProtectedRoute: User authenticated, rendering element for:', user.email);
  return element;
};

// Admin-Route
const AdminRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('AdminRoute: Initial state -', 'User:', user, 'Loading:', loading);

  // Wenn noch geladen wird, Ladebildschirm anzeigen
  if (loading) {
    console.log('AdminRoute: Still loading, showing loading screen');
    return <div className="loading">Loading...</div>;
  }

  // Wenn kein Benutzer vorhanden ist, zur Login-Seite weiterleiten
  if (!user) {
    console.log('AdminRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wenn der Benutzer kein Admin ist, zum Dashboard weiterleiten
  if (user.role !== 'admin') {
    console.log('AdminRoute: User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Benutzer ist Admin, Element anzeigen
  console.log('AdminRoute: User is admin, rendering element for:', user.email);
  return element;
};

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [templates, setTemplates] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Dashboard component initialized, user:', user, 'token exists:', !!token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Dashboard: Fetching data for user:', user);

        // Sicherstellen, dass der Token in den Headers gesetzt ist
        if (token) {
          axios.defaults.headers.common['x-auth-token'] = token;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Templates laden
        console.log('Dashboard: Fetching templates...');
        const templatesResponse = await axios.get(`${API_URL}/api/templates`);
        console.log('Templates loaded:', templatesResponse.data);
        setTemplates(templatesResponse.data);

        // Websites laden
        console.log('Dashboard: Fetching websites...');
        const websitesResponse = await axios.get(`${API_URL}/api/websites`);
        console.log('Websites loaded:', websitesResponse.data);
        setWebsites(websitesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);

        // Wenn der Fehler ein Authentifizierungsfehler ist, zur Login-Seite weiterleiten
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Authentication error, redirecting to login');
          window.location.href = '/login';
          return;
        }

        setError('Fehler beim Laden der Daten. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      console.log('Dashboard: No user found, not fetching data');
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    console.log('Dashboard: No user found, showing error message');
    return (
      <div className="error-message">
        <p>Bitte melde dich an, um das Dashboard zu sehen.</p>
        <button onClick={() => window.location.href = '/login'} className="btn-primary">
          Zur Anmeldung
        </button>
      </div>
    );
  }

  console.log('Dashboard: User found, rendering dashboard for:', user);

  // Sicherstellen, dass user.firstName existiert
  const firstName = user.firstName || user.name || 'Benutzer';

  return (
    <div className="dashboard">
      <h2>Willkommen, {firstName}!</h2>
      <p>Hier kannst du {user.role === 'admin' ? 'Templates und Websites verwalten' : 'deine Websites verwalten'}.</p>

      <div className="stats">
        {user.role === 'admin' && (
          <div className="stat-card">
            <h3>Templates</h3>
            <div className="count">{templates.length}</div>
            <Link to="/templates/new" className="button">Template erstellen</Link>
          </div>
        )}
        <div className="stat-card">
          <h3>Websites</h3>
          <div className="count">{websites.length}</div>
          <Link to="/websites/new" className="button">Website erstellen</Link>
        </div>
      </div>
    </div>
  );
}

function Templates() {
  const { user } = useContext(AuthContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/templates`);
        setTemplates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`${API_URL}/api/templates/${id}`);
        setTemplates(templates.filter(template => template._id !== id));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="templates">
      <div className="section-header">
        <h2>Templates</h2>
        {user.role === 'admin' && (
          <Link to="/templates/new" className="button">Neues Template</Link>
        )}
      </div>

      <div className="card-grid">
        {templates.map(template => (
          <div key={template._id} className="card">
            <img src={template.thumbnail} alt={template.name} />
            <div className="card-content">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <p className="category">Kategorie: {template.category}</p>
            </div>
            <div className="card-actions">
              {user.role === 'admin' && (
                <>
                  <Link to={`/templates/${template._id}`} className="button">Bearbeiten</Link>
                  <button onClick={() => handleDelete(template._id)}>Löschen</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Websites() {
  const { user } = useContext(AuthContext);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/websites`);
        setWebsites(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching websites:', error);
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await axios.delete(`${API_URL}/api/websites/${id}`);
        setWebsites(websites.filter(website => website._id !== id));
      } catch (error) {
        console.error('Error deleting website:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="websites">
      <div className="section-header">
        <h2>Websites</h2>
        <Link to="/websites/new" className="button">Neue Website</Link>
      </div>

      <div className="card-grid">
        {websites.map(website => (
          <div key={website._id} className="card">
            <div className="card-content">
              <h3>{website.name}</h3>
              <p>Subdomain: {website.subdomain}.247vitrine.com</p>
              <div className="status-container">
                <p className="status">
                  Status: {website.published ? 'Veröffentlicht' : 'Entwurf'}
                </p>
                {website.isDemo && (
                  <span className="demo-badge">Demo</span>
                )}
              </div>
            </div>
            <div className="card-actions">
              <Link to={`/websites/${website._id}`} className="button">Anzeigen</Link>
              <Link to={`/websites/${website._id}/edit-content`} className="button">Bearbeiten</Link>
              <button
                onClick={() => window.open(`${API_URL}/preview/${website._id}`, '_blank')}
                className="preview-button"
              >
                Vorschau
              </button>
              <button onClick={() => handleDelete(website._id)}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  console.log('App component initialized');

  return (
    <AuthProvider>
      <DeviceProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </DeviceProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading, logout } = useContext(AuthContext);

  console.log('AppContent: Current user state:', user, 'Loading:', loading);

  if (loading) {
    console.log('AppContent: Still loading user data...');
    return <div className="loading">Loading...</div>;
  }

  console.log('AppContent: User data loaded, user:', user);

  return (
    <>
      <header className="App-header">
        <h1>247Vitrine Admin</h1>
        {user && (
          <div className="user-menu">
            <span>{user.firstName} {user.lastName}</span>
            <button onClick={logout} className="logout-button">Abmelden</button>
          </div>
        )}
      </header>

      {user && (
        <MainNavigation user={user} />
      )}

      <main className="App-content">
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/templates" element={<AdminRoute element={<Templates />} />} />
          <Route path="/templates/:id" element={<AdminRoute element={<TemplateEditor />} />} />
          <Route path="/websites" element={<ProtectedRoute element={<Websites />} />} />
          <Route path="/websites/new" element={<ProtectedRoute element={<WebsiteCreationWizard />} />} />
          <Route path="/websites/:id" element={<ProtectedRoute element={<WebsiteEditor />} />} />
          <Route path="/websites/:id/edit" element={<ProtectedRoute element={<WebsiteCreationWizard />} />} />
          <Route path="/websites/:id/edit-content" element={<ProtectedRoute element={<WebsiteCreationWizard />} />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/preview-render" element={<PreviewRender />} />
          <Route path="/" element={
            user ? (
              // Wenn Benutzer angemeldet ist, zum Dashboard weiterleiten
              <Navigate to="/dashboard" replace />
            ) : (
              // Ansonsten zur Login-Seite weiterleiten
              <Navigate to="/login" replace />
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;