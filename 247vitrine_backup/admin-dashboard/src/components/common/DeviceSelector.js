import React from 'react';
import { useDevice } from './DeviceContext';

/**
 * Geräte-Auswahl-Komponente für die Vorschau
 * @param {Object} props - Component props
 * @param {string} props.deviceType - Aktuell ausgewählter Gerätetyp ('desktop', 'tablet', 'mobile')
 * @param {Function} props.setDeviceType - Funktion zum Ändern des Gerätetyps
 * @param {string} props.className - Zusätzliche CSS-Klassen
 */
function DeviceSelector({ className = '' }) {
  const { deviceType, setDeviceType } = useDevice();
  return (
    <div className={`device-selector ${className}`}>
      <button
        className={`device-button ${deviceType === 'desktop' ? 'active' : ''}`}
        onClick={() => setDeviceType('desktop')}
        title="Desktop-Ansicht"
      >
        <i className="fas fa-desktop"></i>
      </button>
      <button
        className={`device-button ${deviceType === 'mobile' ? 'active' : ''}`}
        onClick={() => setDeviceType('mobile')}
        title="Mobile-Ansicht"
      >
        <i className="fas fa-mobile-alt"></i>
      </button>
    </div>
  );
}

export default DeviceSelector;
