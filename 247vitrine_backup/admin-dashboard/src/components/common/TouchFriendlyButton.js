import React from 'react';
import '../wizard/Wizard.css';

/**
 * Touch-freundliche Button-Komponente für bessere mobile Nutzung
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (primary, secondary, danger)
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content
 */
const TouchFriendlyButton = ({ 
  children, 
  onClick, 
  type = 'primary', 
  disabled = false,
  className = ''
}) => (
  <button 
    className={`btn-${type} touch-friendly ${className}`} 
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default TouchFriendlyButton;
