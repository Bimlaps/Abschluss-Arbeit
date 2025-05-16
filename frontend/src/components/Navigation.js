import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">247Vitrine</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Registrieren</Link>
      </div>
    </nav>
  );
}

export default Navigation; 