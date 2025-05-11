import React from 'react';
import DeviceSelector from './DeviceSelector';
import { useDevice } from './DeviceContext';
import './Common.css';

/**
 * Geräte-Toolbar-Komponente mit Geräte-Auswahl und Veröffentlichen-Button
 * @param {Object} props - Component props
 * @param {string} props.deviceType - Aktuell ausgewählter Gerätetyp ('desktop', 'tablet', 'mobile')
 * @param {Function} props.setDeviceType - Funktion zum Ändern des Gerätetyps
 * @param {Function} props.onPublish - Funktion, die beim Klick auf den Veröffentlichen-Button aufgerufen wird
 * @param {boolean} props.showPublishButton - Ob der Veröffentlichen-Button angezeigt werden soll
 * @param {string} props.className - Zusätzliche CSS-Klassen
 */
function DeviceToolbar({
  onPublish,
  showPublishButton = true,
  className = ''
}) {
  const { deviceType, setDeviceType } = useDevice();
  return (
    <div className={`device-toolbar ${className}`}>
      <DeviceSelector deviceType={deviceType} setDeviceType={setDeviceType} />

      {showPublishButton && (
        <button
          className="publish-button"
          onClick={onPublish}
        >
          Veröffentlichen
        </button>
      )}
    </div>
  );
}

export default DeviceToolbar;
