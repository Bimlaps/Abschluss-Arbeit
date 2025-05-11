// In src/components/auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validierung
    if (!email || !password) {
      setFormError('Bitte fülle alle Felder aus');
      return;
    }

    try {
      console.log('Login: Attempting to log in with email:', email);
      setIsLoading(true);
      setFormError('');

      // Login durchführen
      const result = await login(email, password);
      console.log('Login successful, result:', result);

      // Mit React Router zum Dashboard navigieren
      console.log('Navigating to dashboard using React Router');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login component error:', error);
      setFormError(error.response?.data?.message || 'Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Anmelden</h2>
        <p>Melde dich an, um deine Websites zu verwalten</p>

        {(formError || error) && (
          <div className="error-message">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Noch kein Konto? <Link to="/register">Registrieren</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
