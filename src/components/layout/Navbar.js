import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">247Vitrine</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="user-info">
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
          </div>
          <div className="navbar-item">
            <button className="btn btn-outline" onClick={logout}>
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
