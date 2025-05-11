// In src/components/auth/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: {
      name: '',
      address: '',
      phone: '',
      industry: ''
    }
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validierung
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwörter stimmen nicht überein');
      return;
    }

    try {
      console.log('Register: Attempting to register user with email:', formData.email);
      setIsLoading(true);
      setFormError('');

      // confirmPassword entfernen
      const { confirmPassword, ...userData } = formData;

      // Registrierung durchführen
      const result = await register(userData);
      console.log('Registration successful, result:', result);

      // Mit React Router zum Dashboard navigieren
      console.log('Navigating to dashboard using React Router');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration component error:', error);
      setFormError(error.response?.data?.message || 'Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Registrieren</h2>
        <p>Erstelle ein Konto, um deine eigene Website zu erstellen</p>

        {(formError || error) && (
          <div className="error-message">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Persönliche Informationen</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Vorname</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nachname</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Passwort</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Passwort bestätigen</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Unternehmensinformationen</h3>

            <div className="form-group">
              <label htmlFor="company.name">Firmenname</label>
              <input
                type="text"
                id="company.name"
                name="company.name"
                value={formData.company.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company.address">Adresse</label>
              <input
                type="text"
                id="company.address"
                name="company.address"
                value={formData.company.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company.phone">Telefon</label>
                <input
                  type="tel"
                  id="company.phone"
                  name="company.phone"
                  value={formData.company.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company.industry">Branche</label>
                <select
                  id="company.industry"
                  name="company.industry"
                  value={formData.company.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Bitte wählen</option>
                  <option value="Sanitär">Sanitär</option>
                  <option value="Elektro">Elektro</option>
                  <option value="Heizung">Heizung</option>
                  <option value="Dach">Dach</option>
                  <option value="Maler">Maler</option>
                  <option value="Tischler">Tischler</option>
                  <option value="Fliesenleger">Fliesenleger</option>
                  <option value="Gartenbau">Gartenbau</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Wird registriert...' : 'Registrieren'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Bereits ein Konto? <Link to="/login">Anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
