import React, { createContext, useState, useContext } from 'react';

// Erstelle einen Context für den Gerätetyp
const DeviceContext = createContext();

/**
 * Provider für den Gerätetyp-Context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function DeviceProvider({ children }) {
  const [deviceType, setDeviceType] = useState('desktop');

  return (
    <DeviceContext.Provider value={{ deviceType, setDeviceType }}>
      {children}
    </DeviceContext.Provider>
  );
}

/**
 * Hook zum Zugriff auf den Gerätetyp-Context
 * @returns {Object} - { deviceType, setDeviceType }
 */
export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
