import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/blog/BlogList';
import AuthContext from './context/AuthContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  const login = () => {
    // Simuliere Login
    setIsAuthenticated(true);
    setUser({
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      role: 'admin'
    });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Router>
        <div className="app">
          <header className="app-header">
            <div className="logo">
              <Link to="/">247Vitrine Blog</Link>
            </div>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li>
                  {isAuthenticated ? (
                    <button onClick={logout}>Abmelden</button>
                  ) : (
                    <button onClick={login}>Anmelden</button>
                  )}
                </li>
              </ul>
            </nav>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<BlogList websiteId="demo-website" />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} 247Vitrine. Alle Rechte vorbehalten.</p>
          </footer>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
