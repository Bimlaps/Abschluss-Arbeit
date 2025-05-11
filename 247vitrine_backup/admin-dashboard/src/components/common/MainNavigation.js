import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDevice } from './DeviceContext';
import './Common.css';

/**
 * Hauptnavigationsleiste mit Geräte-Auswahl
 * @param {Object} props - Component props
 * @param {Object} props.user - Benutzer-Objekt
 */
function MainNavigation({ user }) {
  const location = useLocation();
  const { deviceType, setDeviceType } = useDevice();

  // Wir zeigen die Geräte-Auswahl immer an
  const showDeviceSelector = true;

  return (
    <nav className="App-nav">
      <div className="nav-container">
        <ul className="nav-links">
          <li>
            <Link
              to="/dashboard"
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          {user.role === 'admin' && (
            <li>
              <Link
                to="/templates"
                className={location.pathname.includes('/templates') ? 'active' : ''}
              >
                Templates
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/websites"
              className={location.pathname.includes('/websites') ? 'active' : ''}
            >
              Websites
            </Link>
          </li>
        </ul>

        {showDeviceSelector && (
          <div className="nav-device-selector">
            <button
              className={`nav-device-button ${deviceType === 'desktop' ? 'active' : ''}`}
              onClick={() => setDeviceType('desktop')}
              title="Desktop-Ansicht"
            >
              <i className="fas fa-desktop"></i>
            </button>
            <button
              className={`nav-device-button ${deviceType === 'mobile' ? 'active' : ''}`}
              onClick={() => setDeviceType('mobile')}
              title="Mobile-Ansicht"
            >
              <i className="fas fa-mobile-alt"></i>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default MainNavigation;
