import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import WebsiteBuilder from './components/website-builder/WebsiteBuilder';
import WebsitePreview from './components/website-builder/WebsitePreview';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import NotFound from './components/common/NotFound';

// Import context
import { AuthProvider } from './context/AuthContext';

// Set axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set auth header
          axios.defaults.headers.common['x-auth-token'] = token;
          
          // Get user data
          const res = await axios.get('/api/auth/me');
          
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          // Clear token if invalid
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider value={{ isAuthenticated, user, login, logout }}>
      <Router>
        <div className="app">
          {isAuthenticated && <Navbar />}
          <div className="main-container">
            {isAuthenticated && <Sidebar />}
            <main className="content">
              <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
                <Route path="/website-builder" element={<ProtectedRoute isAuthenticated={isAuthenticated}><WebsiteBuilder /></ProtectedRoute>} />
                <Route path="/website-preview/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><WebsitePreview /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
