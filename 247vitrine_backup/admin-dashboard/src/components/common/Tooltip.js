import React, { useState } from 'react';
import './Tooltip.css';

/**
 * Tooltip-Komponente für Hilfetexte und Erklärungen
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Das Element, an das der Tooltip angehängt wird
 * @param {string} props.content - Der Inhalt des Tooltips
 * @param {string} props.position - Die Position des Tooltips (top, right, bottom, left)
 */
function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip-content tooltip-${position}`}>
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
