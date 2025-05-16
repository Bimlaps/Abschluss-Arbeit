import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function Home() {
  return (
    <div className="home">
      <h1>Willkommen bei 247Vitrine</h1>
      <p>Ihr Website-Builder für Handwerker</p>
      <div className="cta-buttons">
        <button onClick={() => window.location.href='/login'}>Anmelden</button>
        <button onClick={() => window.location.href='/register'}>Registrieren</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 