import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menü</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={isActive('/dashboard')}>
          <Link to="/dashboard">
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className={isActive('/website-builder')}>
          <Link to="/website-builder">
            <span className="icon">🔨</span>
            <span className="text">Website-Builder</span>
          </Link>
        </li>
        <li className={isActive('/settings')}>
          <Link to="/settings">
            <span className="icon">⚙️</span>
            <span className="text">Einstellungen</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
