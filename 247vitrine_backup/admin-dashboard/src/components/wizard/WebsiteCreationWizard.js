import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LayoutSelector from './LayoutSelector';
import DesignSelector from './DesignSelector';
import ColorSchemeSelector from './ColorSchemeSelector';
import ContentEditor from './ContentEditor';
import './Wizard.css';

const API_URL = 'http://localhost:3001';

function WebsiteCreationWizard() {
  const { id } = useParams(); // Website-ID aus der URL
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const wizardRef = useRef(null);

  // Erkennung von mobilen Geräten
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [website, setWebsite] = useState({
    name: '',
    subdomain: '',
    layout: '',
    design: '',
    colorScheme: '',
    content: {
      title: '',
      description: '',
      logo: 'https://via.placeholder.com/150x50',
      hero: {
        title: '',
        subtitle: '',
        image: 'https://via.placeholder.com/1200x600'
      },
      about: {
        title: '',
        text: '',
        image: 'https://via.placeholder.com/600x400'
      },
      services: [
        {
          title: '',
          description: '',
          icon: '🔧'
        }
      ],
      contact: {
        email: '',
        phone: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        address: ''
      },
      openingHours: [
        { day: 'Montag', open: '09:00', close: '17:00', closed: false },
        { day: 'Dienstag', open: '09:00', close: '17:00', closed: false },
        { day: 'Mittwoch', open: '09:00', close: '17:00', closed: false },
        { day: 'Donnerstag', open: '09:00', close: '17:00', closed: false },
        { day: 'Freitag', open: '09:00', close: '17:00', closed: false },
        { day: 'Samstag', open: '09:00', close: '13:00', closed: false },
        { day: 'Sonntag', open: '09:00', close: '17:00', closed: true }
      ]
    },
    published: false,
    isDemo: false
  });

  // Lade Website-Daten, wenn eine ID vorhanden ist
  useEffect(() => {
    const fetchWebsite = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/api/websites/${id}`);
          setWebsite(response.data);
          setIsEditing(true);

          // Setze den Schritt auf 4 (Inhalte), wenn wir im Bearbeitungsmodus sind
          setStep(4);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching website:', error);
          setLoading(false);
        }
      }
    };

    fetchWebsite();
  }, [id]);

  const handleLayoutSelect = (layoutId) => {
    setWebsite(prev => ({ ...prev, layout: layoutId }));
    setStep(2);
  };

  const handleDesignSelect = (designId) => {
    setWebsite(prev => ({ ...prev, design: designId }));
    setStep(3);
  };

  const handleColorSchemeSelect = (colorSchemeId) => {
    setWebsite(prev => ({ ...prev, colorScheme: colorSchemeId }));
    setStep(4);
  };

  const handleContentChange = (content) => {
    const updatedWebsite = { ...website, content };
    setWebsite(updatedWebsite);

    // Speichere die aktuelle Website im localStorage für die Vorschau
    localStorage.setItem('currentWebsite', JSON.stringify(updatedWebsite));
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    const updatedWebsite = { ...website, [name]: value };
    setWebsite(updatedWebsite);

    // Speichere die aktuelle Website im localStorage für die Vorschau
    localStorage.setItem('currentWebsite', JSON.stringify(updatedWebsite));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEditing) {
        // Website aktualisieren
        await axios.put(`${API_URL}/api/websites/${id}`, website);
      } else {
        // Neue Website erstellen
        await axios.post(`${API_URL}/api/websites`, website);
      }

      setLoading(false);
      navigate('/websites');
    } catch (error) {
      console.error('Error saving website:', error);
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <LayoutSelector onSelect={handleLayoutSelect} selectedLayout={website.layout} />;
      case 2:
        return <DesignSelector layoutId={website.layout} onSelect={handleDesignSelect} selectedDesign={website.design} />;
      case 3:
        return <ColorSchemeSelector onSelect={handleColorSchemeSelect} selectedColorScheme={website.colorScheme} />;
      case 4:
        return (
          <div className="content-step">
            <h2>Grundlegende Informationen</h2>
            <div className="form-group">
              <label>Website-Name</label>
              <input
                type="text"
                name="name"
                value={website.name}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subdomain</label>
              <div className="subdomain-input">
                <input
                  type="text"
                  name="subdomain"
                  value={website.subdomain}
                  onChange={handleBasicInfoChange}
                  required
                />
                <span>.247vitrine.com</span>
              </div>
            </div>
            <ContentEditor content={website.content} onChange={handleContentChange} />
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="published"
                  checked={website.published}
                  onChange={(e) => setWebsite({...website, published: e.target.checked})}
                />
                Website veröffentlichen
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isDemo"
                  checked={website.isDemo}
                  onChange={(e) => setWebsite({...website, isDemo: e.target.checked})}
                />
                Als Demo-Website markieren
              </label>
              <div className="info-text">
                <small>
                  Hinweis: Sie können maximal eine veröffentlichte Website und eine Demo-Website haben.
                  Demo-Websites sind nur für Testzwecke gedacht und werden nicht öffentlich angezeigt.
                </small>
              </div>
            </div>
            <div className="form-actions">
              {!isEditing && <button type="button" onClick={() => setStep(3)}>Zurück</button>}
              <button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Wird gespeichert...' : isEditing ? 'Website aktualisieren' : 'Website erstellen'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Touch-Swipe-Funktionalität
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Nur im Wizard-Modus und nicht im Bearbeitungsmodus
    if (!isEditing) {
      if (isLeftSwipe && step < 4) {
        // Vorwärts navigieren (nach links wischen)
        if (step === 1 && website.layout) setStep(2);
        else if (step === 2 && website.design) setStep(3);
        else if (step === 3 && website.colorScheme) setStep(4);
      } else if (isRightSwipe && step > 1) {
        // Rückwärts navigieren (nach rechts wischen)
        setStep(step - 1);
      }
    }

    // Touch-Werte zurücksetzen
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mobile-optimierte Fortschrittsanzeige
  const renderMobileProgress = () => {
    return (
      <div className="mobile-progress-indicator">
        <span>Schritt {step} von 4: </span>
        {step === 1 && <span>Layout auswählen</span>}
        {step === 2 && <span>Design auswählen</span>}
        {step === 3 && <span>Farbschema auswählen</span>}
        {step === 4 && <span>Inhalte bearbeiten</span>}
      </div>
    );
  };

  return (
    <div
      className="website-creation-wizard"
      ref={wizardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1>{isEditing ? 'Website bearbeiten' : 'Website erstellen'}</h1>
      {!isEditing && (
        <>
          {isMobile ? (
            renderMobileProgress()
          ) : (
            <div className="wizard-progress">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Layout</div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Design</div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Farben</div>
              <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Inhalte</div>
            </div>
          )}
        </>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        renderStep()
      )}

      {isMobile && !isEditing && (
        <div className="mobile-swipe-hint">
          {step > 1 && step < 4 ? (
            <p>← Nach rechts wischen für zurück, nach links für weiter →</p>
          ) : step === 1 ? (
            <p>Nach links wischen für weiter →</p>
          ) : (
            <p>← Nach rechts wischen für zurück</p>
          )}
        </div>
      )}
    </div>
  );
}

export default WebsiteCreationWizard;