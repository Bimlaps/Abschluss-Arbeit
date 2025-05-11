import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Seite nicht gefunden</h2>
      <p>Die angeforderte Seite existiert nicht.</p>
      <Link to="/" className="btn btn-primary">
        Zurück zur Startseite
      </Link>
    </div>
  );
};

export default NotFound;
