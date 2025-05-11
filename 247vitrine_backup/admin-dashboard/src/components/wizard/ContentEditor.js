import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import SEOEditor from './SEOEditor';
import TouchFriendlyButton from '../common/TouchFriendlyButton';
import Tooltip from '../common/Tooltip';
import exampleContent from './exampleContent';
import './Wizard.css';

function ContentEditor({ content, onChange }) {
  const [activeTab, setActiveTab] = useState('general');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAdditionalSocial, setShowAdditionalSocial] = useState(false);
  const [showAdditionalBusiness, setShowAdditionalBusiness] = useState(false);
  const [showExampleSelector, setShowExampleSelector] = useState(false);

  // State für QR-Code-Neugenerierung
  const [showQrConfirmation, setShowQrConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [confirmationChecks, setConfirmationChecks] = useState({
    understand: false,
    materials: false,
    irreversible: false
  });
  const [confirmationCode, setConfirmationCode] = useState('');

  // Erkennung von mobilen Geräten
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialisiere fehlende Objekte, falls sie nicht existieren
  if (!content.socialMedia) {
    content.socialMedia = {
      facebook: '',
      instagram: '',
      whatsapp: '',
      linkedin: '',
      xing: '',
      youtube: '',
      twitter: ''
    };
  }

  if (!content.gallery) {
    content.gallery = [];
  }

  if (!content.businessCard) {
    content.businessCard = {
      companyName: '',
      contactPerson: '',
      position: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      phone: '',
      email: '',
      website: '',
      logo: '',
      qrCodeUrl: '',
      address: '' // Für Abwärtskompatibilität
    };
  }

  // Initialisiere Öffnungszeiten, falls sie nicht existieren
  if (!content.openingHours || !content.openingHours.length) {
    content.openingHours = [
      { day: 'Montag', open: '09:00', close: '17:00', closed: false },
      { day: 'Dienstag', open: '09:00', close: '17:00', closed: false },
      { day: 'Mittwoch', open: '09:00', close: '17:00', closed: false },
      { day: 'Donnerstag', open: '09:00', close: '17:00', closed: false },
      { day: 'Freitag', open: '09:00', close: '17:00', closed: false },
      { day: 'Samstag', open: '09:00', close: '13:00', closed: false },
      { day: 'Sonntag', open: '09:00', close: '17:00', closed: true }
    ];
  }

  // Initialisiere FAQ-Bereich, falls er nicht existiert
  if (!content.faqs) {
    content.faqs = [];
  }

  // Initialisiere Dienstleistungskatalog, falls er nicht existiert
  if (!content.servicesCatalog) {
    content.servicesCatalog = {
      title: 'Unsere Dienstleistungen',
      description: 'Hier finden Sie eine Übersicht unserer Dienstleistungen.',
      categories: []
    };
  }

  // Initialisiere Blog/News-Bereich, falls er nicht existiert
  if (!content.blog) {
    content.blog = {
      title: 'Aktuelles & Neuigkeiten',
      description: 'Hier finden Sie aktuelle Informationen und Neuigkeiten.',
      posts: []
    };
  }

  const handleChange = (section, field, value) => {
    const updatedContent = { ...content };

    if (section === 'general') {
      updatedContent[field] = value;
    } else if (section === 'services') {
      const serviceIndex = parseInt(field.split('-')[1]);
      const serviceField = field.split('-')[2];
      updatedContent.services[serviceIndex][serviceField] = value;
    } else {
      updatedContent[section][field] = value;
    }

    onChange(updatedContent);
  };

  const addService = () => {
    const updatedContent = { ...content };
    updatedContent.services.push({
      title: '',
      description: '',
      icon: '🔧'
    });
    onChange(updatedContent);
  };

  const removeService = (index) => {
    const updatedContent = { ...content };
    updatedContent.services.splice(index, 1);
    onChange(updatedContent);
  };

  // Galerie-Methoden
  const addGalleryItem = () => {
    const updatedContent = { ...content };
    updatedContent.gallery.push({
      title: 'Neues Bild',
      description: 'Beschreibung des Bildes',
      imageUrl: 'https://via.placeholder.com/600x400',
      thumbnailUrl: '',
      order: updatedContent.gallery.length
    });
    onChange(updatedContent);
  };

  const removeGalleryItem = (index) => {
    const updatedContent = { ...content };
    updatedContent.gallery.splice(index, 1);
    onChange(updatedContent);
  };

  const handleGalleryChange = (index, field, value) => {
    const updatedContent = { ...content };
    updatedContent.gallery[index][field] = value;
    onChange(updatedContent);
  };

  // Beispielinhalte laden
  const loadExampleContent = (type) => {
    if (!exampleContent[type]) return;

    const example = exampleContent[type];
    const updatedContent = { ...content };

    // Allgemeine Informationen
    if (example.general) {
      updatedContent.title = example.general.title;
      updatedContent.description = example.general.description;
      if (example.general.logo) updatedContent.logo = example.general.logo;
    }

    // Hero-Bereich
    if (example.hero) {
      updatedContent.hero.title = example.hero.title;
      updatedContent.hero.subtitle = example.hero.subtitle;
      if (example.hero.image) updatedContent.hero.image = example.hero.image;
    }

    // Über uns
    if (example.about) {
      updatedContent.about.title = example.about.title;
      updatedContent.about.text = example.about.text;
      if (example.about.image) updatedContent.about.image = example.about.image;
    }

    // Leistungen
    if (example.services && example.services.length > 0) {
      updatedContent.services = example.services.map(service => ({ ...service }));
    }

    // Kontakt
    if (example.contact) {
      updatedContent.contact.email = example.contact.email;
      updatedContent.contact.phone = example.contact.phone;
      updatedContent.contact.street = example.contact.street || '';
      updatedContent.contact.houseNumber = example.contact.houseNumber || '';
      updatedContent.contact.postalCode = example.contact.postalCode || '';
      updatedContent.contact.city = example.contact.city || '';
      updatedContent.contact.address = example.contact.address;
    }

    // Social Media
    if (example.socialMedia) {
      updatedContent.socialMedia.facebook = example.socialMedia.facebook || '';
      updatedContent.socialMedia.instagram = example.socialMedia.instagram || '';
      updatedContent.socialMedia.whatsapp = example.socialMedia.whatsapp || '';
      updatedContent.socialMedia.linkedin = example.socialMedia.linkedin || '';
      updatedContent.socialMedia.xing = example.socialMedia.xing || '';
      updatedContent.socialMedia.youtube = example.socialMedia.youtube || '';
      updatedContent.socialMedia.twitter = example.socialMedia.twitter || '';
    }

    // Öffnungszeiten
    if (example.openingHours && example.openingHours.length > 0) {
      updatedContent.openingHours = example.openingHours.map(day => ({ ...day }));
    }

    // FAQs
    if (example.faqs && example.faqs.length > 0) {
      updatedContent.faqs = example.faqs.map(faq => ({ ...faq }));
    }

    // Dienstleistungskatalog
    if (example.servicesCatalog) {
      updatedContent.servicesCatalog = {
        title: example.servicesCatalog.title || 'Unsere Dienstleistungen',
        description: example.servicesCatalog.description || 'Hier finden Sie eine Übersicht unserer Dienstleistungen.',
        categories: example.servicesCatalog.categories ? example.servicesCatalog.categories.map(category => ({
          name: category.name,
          description: category.description,
          services: category.services ? category.services.map(service => ({
            name: service.name,
            description: service.description,
            details: service.details,
            icon: service.icon,
            imageUrl: service.imageUrl
          })) : []
        })) : []
      };
    }

    // Blog/News-Bereich
    if (example.blog) {
      updatedContent.blog = {
        title: example.blog.title || 'Aktuelles & Neuigkeiten',
        description: example.blog.description || 'Hier finden Sie aktuelle Informationen und Neuigkeiten.',
        posts: example.blog.posts ? example.blog.posts.map(post => ({
          title: post.title,
          content: post.content,
          summary: post.summary,
          imageUrl: post.imageUrl,
          author: post.author,
          publishDate: post.publishDate,
          tags: post.tags ? [...post.tags] : [],
          slug: post.slug
        })) : []
      };
    }

    onChange(updatedContent);
    setShowExampleSelector(false);
  };

  // Render-Funktion für die Tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="editor-section">
            <div className="form-group">
              <Tooltip content="Der Titel deiner Website erscheint in der Browser-Leiste und in Suchergebnissen.">
                <label>Titel</label>
              </Tooltip>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleChange('general', 'title', e.target.value)}
                placeholder="z.B. Muster Handwerker GmbH"
              />
            </div>
            <div className="form-group">
              <Tooltip content="Eine kurze Beschreibung deiner Website, die in Suchergebnissen angezeigt werden kann.">
                <label>Beschreibung</label>
              </Tooltip>
              <textarea
                value={content.description}
                onChange={(e) => handleChange('general', 'description', e.target.value)}
                placeholder="z.B. Ihr zuverlässiger Partner für alle Handwerksarbeiten"
              ></textarea>
            </div>
            <div className="form-group">
              <Tooltip content="Dein Firmenlogo wird in der Kopfzeile deiner Website angezeigt. Empfohlene Größe: 200x80 Pixel.">
                <label>Logo</label>
              </Tooltip>
              {content.logo ? (
                <div className="image-preview-container">
                  <img
                    src={content.logo}
                    alt="Logo"
                    className="image-preview logo-preview"
                  />
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => handleChange('general', 'logo', '')}
                  >
                    Logo entfernen
                  </button>
                </div>
              ) : (
                <ImageUploader
                  layoutType={content.layout?.category || 'one-page'}
                  imageType="logo"
                  onImageUploaded={(imageUrl) => handleChange('general', 'logo', imageUrl)}
                />
              )}
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="editor-section">
            <div className="form-group">
              <Tooltip content="Die Hauptüberschrift im Hero-Bereich deiner Website. Sie sollte kurz und aussagekräftig sein.">
                <label>Überschrift</label>
              </Tooltip>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                placeholder="z.B. Willkommen bei Muster Handwerker"
              />
            </div>
            <div className="form-group">
              <Tooltip content="Ein kurzer Text unter der Hauptüberschrift. Hier kannst du einen Slogan oder eine kurze Beschreibung einfügen.">
                <label>Untertitel</label>
              </Tooltip>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                placeholder="z.B. Qualität und Zuverlässigkeit seit 1995"
              />
            </div>
            <div className="form-group">
              <Tooltip content="Das Hauptbild im oberen Bereich deiner Website. Wähle ein qualitativ hochwertiges Bild, das dein Unternehmen gut repräsentiert.">
                <label>Hero-Bild</label>
              </Tooltip>
              {content.hero.image ? (
                <div className="image-preview-container">
                  <img
                    src={content.hero.image}
                    alt="Hero-Bild"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => handleChange('hero', 'image', '')}
                  >
                    Bild entfernen
                  </button>
                </div>
              ) : (
                <ImageUploader
                  layoutType={content.layout?.category || 'one-page'}
                  imageType="hero"
                  onImageUploaded={(imageUrl) => handleChange('hero', 'image', imageUrl)}
                />
              )}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="editor-section">
            <div className="form-group">
              <label>Überschrift</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => handleChange('about', 'title', e.target.value)}
                placeholder="z.B. Über uns"
              />
            </div>
            <div className="form-group">
              <label>Text</label>
              <textarea
                value={content.about.text}
                onChange={(e) => handleChange('about', 'text', e.target.value)}
                placeholder="z.B. Wir sind ein Familienunternehmen mit über 25 Jahren Erfahrung..."
              ></textarea>
            </div>
            <div className="form-group">
              <label>Über-uns-Bild</label>
              {content.about.image ? (
                <div className="image-preview-container">
                  <img
                    src={content.about.image}
                    alt="Über-uns-Bild"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => handleChange('about', 'image', '')}
                  >
                    Bild entfernen
                  </button>
                </div>
              ) : (
                <ImageUploader
                  layoutType={content.layout?.category || 'one-page'}
                  imageType="about"
                  onImageUploaded={(imageUrl) => handleChange('about', 'image', imageUrl)}
                />
              )}
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="editor-section">
            <h3>Leistungen</h3>
            {content.services.map((service, index) => (
              <div key={index} className="service-item">
                <h4>Leistung {index + 1}</h4>
                <div className="form-group">
                  <label>Titel</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleChange('services', `service-${index}-title`, e.target.value)}
                    placeholder="z.B. Sanitärinstallation"
                  />
                </div>
                <div className="form-group">
                  <label>Beschreibung</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleChange('services', `service-${index}-description`, e.target.value)}
                    placeholder="z.B. Professionelle Installation und Reparatur von Sanitäranlagen"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <input
                    type="text"
                    value={service.icon}
                    onChange={(e) => handleChange('services', `service-${index}-icon`, e.target.value)}
                    placeholder="z.B. 🔧"
                  />
                </div>
                {content.services.length > 1 && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeService(index)}
                  >
                    Leistung entfernen
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={addService}>
              Leistung hinzufügen
            </button>
          </div>
        );
      case 'contact':
        return (
          <div className="editor-section">
            <div className="form-group">
              <Tooltip content="Deine Kontakt-E-Mail-Adresse. Über diese E-Mail-Adresse können dich Kunden erreichen.">
                <label>E-Mail <span className="required">*</span></label>
              </Tooltip>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                placeholder="z.B. info@musterhandwerker.de"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
              />
              <small className="form-hint">Bitte gib eine gültige E-Mail-Adresse ein.</small>
            </div>
            <div className="form-group">
              <label>Telefon <span className="required">*</span></label>
              <input
                type="tel"
                value={content.contact.phone}
                onChange={(e) => {
                  // Nur Zahlen, +, -, Leerzeichen und Klammern erlauben
                  const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                  handleChange('contact', 'phone', value);
                }}
                placeholder="z.B. +49 123 456789"
                required
              />
              <small className="form-hint">Nur Zahlen, +, -, Leerzeichen und Klammern sind erlaubt.</small>
            </div>

            <div className="address-container">
              <h4>Adresse</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Straße</label>
                  <input
                    type="text"
                    value={content.contact.street || ''}
                    onChange={(e) => handleChange('contact', 'street', e.target.value)}
                    placeholder="z.B. Musterstraße"
                  />
                </div>
                <div className="form-group small">
                  <label>Hausnummer</label>
                  <input
                    type="text"
                    value={content.contact.houseNumber || ''}
                    onChange={(e) => handleChange('contact', 'houseNumber', e.target.value)}
                    placeholder="z.B. 123"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group small">
                  <label>PLZ</label>
                  <input
                    type="text"
                    value={content.contact.postalCode || ''}
                    onChange={(e) => {
                      // Nur Zahlen erlauben und auf 5 Stellen begrenzen
                      const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                      handleChange('contact', 'postalCode', value);
                    }}
                    placeholder="z.B. 12345"
                    pattern="[0-9]{5}"
                  />
                  <small className="form-hint">5-stellige Postleitzahl</small>
                </div>
                <div className="form-group">
                  <label>Stadt</label>
                  <input
                    type="text"
                    value={content.contact.city || ''}
                    onChange={(e) => handleChange('contact', 'city', e.target.value)}
                    placeholder="z.B. Musterstadt"
                  />
                </div>
              </div>

              {/* Für Abwärtskompatibilität - wird automatisch aktualisiert */}
              <input
                type="hidden"
                value={`${content.contact.street || ''} ${content.contact.houseNumber || ''}, ${content.contact.postalCode || ''} ${content.contact.city || ''}`}
                onChange={(e) => handleChange('contact', 'address', e.target.value)}
              />
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="editor-section">
            <h3>Galerie</h3>
            <p>Füge Bilder zu deiner Galerie hinzu, um deine Arbeit zu präsentieren.</p>

            {content.gallery.map((item, index) => (
              <div key={index} className="gallery-item-editor">
                <h4>Bild {index + 1}</h4>
                <div className="form-group">
                  <label>Titel</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleGalleryChange(index, 'title', e.target.value)}
                    placeholder="z.B. Projekt XYZ"
                  />
                </div>
                <div className="form-group">
                  <label>Beschreibung</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleGalleryChange(index, 'description', e.target.value)}
                    placeholder="z.B. Beschreibung des Projekts"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Galerie-Bild</label>
                  {item.imageUrl ? (
                    <div className="image-preview-container">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="btn-danger btn-small"
                        onClick={() => handleGalleryChange(index, 'imageUrl', '')}
                      >
                        Bild entfernen
                      </button>
                    </div>
                  ) : (
                    <ImageUploader
                      layoutType={content.layout?.category || 'one-page'}
                      imageType="gallery"
                      onImageUploaded={(imageUrl) => handleGalleryChange(index, 'imageUrl', imageUrl)}
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeGalleryItem(index)}
                >
                  Bild entfernen
                </button>
              </div>
            ))}

            <button type="button" className="btn-secondary" onClick={addGalleryItem}>
              Bild hinzufügen
            </button>
          </div>
        );
      case 'social':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Social Media Links</h3>
            </div>
            <p>Füge Links zu deinen Social-Media-Profilen hinzu.</p>

            <div className="form-section">
              <h4>Wichtigste Plattformen</h4>
              <div className="form-group priority-high">
                <Tooltip content="Facebook ist eine der wichtigsten Plattformen für lokale Unternehmen.">
                  <label>Facebook</label>
                </Tooltip>
                <input
                  type="url"
                  value={content.socialMedia.facebook}
                  onChange={(e) => handleChange('socialMedia', 'facebook', e.target.value)}
                  placeholder="z.B. https://facebook.com/meinunternehmen"
                />
              </div>
              <div className="form-group priority-high">
                <Tooltip content="Instagram ist besonders wichtig für visuelle Inhalte und Projekte.">
                  <label>Instagram</label>
                </Tooltip>
                <input
                  type="url"
                  value={content.socialMedia.instagram}
                  onChange={(e) => handleChange('socialMedia', 'instagram', e.target.value)}
                  placeholder="z.B. https://instagram.com/meinunternehmen"
                />
              </div>
              <div className="form-group priority-high">
                <Tooltip content="WhatsApp ist ein wichtiger Kommunikationskanal für viele Kunden.">
                  <label>WhatsApp</label>
                </Tooltip>
                <input
                  type="tel"
                  value={content.socialMedia.whatsapp}
                  onChange={(e) => {
                    // Nur Zahlen, +, -, Leerzeichen erlauben
                    const value = e.target.value.replace(/[^0-9+\-\s]/g, '');
                    handleChange('socialMedia', 'whatsapp', value);
                  }}
                  placeholder="z.B. +49 123 456789"
                />
                <small className="form-hint">Gib deine WhatsApp-Nummer ein (nur Zahlen, +, - und Leerzeichen).</small>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">
                <h4>Weitere Plattformen</h4>
                <button
                  type="button"
                  className={`toggle-section ${showAdditionalSocial ? 'expanded' : ''}`}
                  onClick={() => setShowAdditionalSocial(!showAdditionalSocial)}
                >
                  {showAdditionalSocial ? 'Ausblenden' : 'Anzeigen'}
                </button>
              </div>

              {showAdditionalSocial && (
                <>
                  <div className="form-group priority-medium">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      value={content.socialMedia.linkedin}
                      onChange={(e) => handleChange('socialMedia', 'linkedin', e.target.value)}
                      placeholder="z.B. https://linkedin.com/company/meinunternehmen"
                    />
                  </div>
                  <div className="form-group priority-medium">
                    <label>Xing</label>
                    <input
                      type="url"
                      value={content.socialMedia.xing}
                      onChange={(e) => handleChange('socialMedia', 'xing', e.target.value)}
                      placeholder="z.B. https://xing.com/profile/..."
                    />
                  </div>
                  <div className="form-group priority-low">
                    <label>YouTube</label>
                    <input
                      type="url"
                      value={content.socialMedia.youtube}
                      onChange={(e) => handleChange('socialMedia', 'youtube', e.target.value)}
                      placeholder="z.B. https://youtube.com/c/meinunternehmen"
                    />
                  </div>
                  <div className="form-group priority-low">
                    <label>Twitter</label>
                    <input
                      type="url"
                      value={content.socialMedia.twitter}
                      onChange={(e) => handleChange('socialMedia', 'twitter', e.target.value)}
                      placeholder="z.B. https://twitter.com/meinunternehmen"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 'businessCard':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Digitale Visitenkarte</h3>
            </div>
            <p>Erstelle eine digitale Visitenkarte mit QR-Code für deine Kontaktdaten.</p>

            <div className="import-contact-container">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  // Kopiere Kontaktdaten in die Visitenkarte
                  const updatedContent = { ...content };

                  // Kontaktdaten kopieren
                  updatedContent.businessCard.email = content.contact.email;
                  updatedContent.businessCard.phone = content.contact.phone;
                  updatedContent.businessCard.street = content.contact.street;
                  updatedContent.businessCard.houseNumber = content.contact.houseNumber;
                  updatedContent.businessCard.postalCode = content.contact.postalCode;
                  updatedContent.businessCard.city = content.contact.city;

                  // Aktualisiere auch das address-Feld für Abwärtskompatibilität
                  updatedContent.businessCard.address = content.contact.address;

                  // Wenn der Firmenname noch leer ist, verwende den Website-Titel
                  if (!updatedContent.businessCard.companyName && content.title) {
                    updatedContent.businessCard.companyName = content.title;
                  }

                  onChange(updatedContent);
                }}
              >
                Aus Kontaktdaten importieren
              </button>
              <small className="form-hint">
                Importiert E-Mail, Telefon, Adresse und Firmenname (aus dem Website-Titel) in deine Visitenkarte. Du kannst alle Daten anschließend bearbeiten.
              </small>
            </div>

            <div className="form-section">
              <h4>Wichtigste Informationen</h4>
              <div className="form-group priority-high">
                <Tooltip content="Der Name deines Unternehmens, wie er auf der Visitenkarte erscheinen soll.">
                  <label>Firmenname</label>
                </Tooltip>
                <input
                  type="text"
                  value={content.businessCard.companyName}
                  onChange={(e) => handleChange('businessCard', 'companyName', e.target.value)}
                  placeholder="z.B. Muster Handwerker GmbH"
                />
              </div>
              <div className="form-group priority-high">
                <Tooltip content="Die Telefonnummer, unter der Kunden dich erreichen können.">
                  <label>Telefon</label>
                </Tooltip>
                <input
                  type="tel"
                  value={content.businessCard.phone}
                  onChange={(e) => {
                    // Nur Zahlen, +, -, Leerzeichen und Klammern erlauben
                    const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                    handleChange('businessCard', 'phone', value);
                  }}
                  placeholder="z.B. +49 123 456789"
                />
                <small className="form-hint">Nur Zahlen, +, -, Leerzeichen und Klammern sind erlaubt.</small>
              </div>
              <div className="form-group priority-high">
                <Tooltip content="Deine E-Mail-Adresse für Kontaktanfragen.">
                  <label>E-Mail</label>
                </Tooltip>
                <input
                  type="email"
                  value={content.businessCard.email}
                  onChange={(e) => handleChange('businessCard', 'email', e.target.value)}
                  placeholder="z.B. info@musterhandwerker.de"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
                <small className="form-hint">Bitte gib eine gültige E-Mail-Adresse ein.</small>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">
                <h4>Weitere Informationen</h4>
                <button
                  type="button"
                  className={`toggle-section ${showAdditionalBusiness ? 'expanded' : ''}`}
                  onClick={() => setShowAdditionalBusiness(!showAdditionalBusiness)}
                >
                  {showAdditionalBusiness ? 'Ausblenden' : 'Anzeigen'}
                </button>
              </div>

              {showAdditionalBusiness && (
                <>
                  <div className="form-group priority-medium">
                    <label>Kontaktperson</label>
                    <input
                      type="text"
                      value={content.businessCard.contactPerson}
                      onChange={(e) => handleChange('businessCard', 'contactPerson', e.target.value)}
                      placeholder="z.B. Max Mustermann"
                    />
                  </div>
                  <div className="form-group priority-medium">
                    <label>Position</label>
                    <input
                      type="text"
                      value={content.businessCard.position}
                      onChange={(e) => handleChange('businessCard', 'position', e.target.value)}
                      placeholder="z.B. Geschäftsführer"
                    />
                  </div>
                  <div className="address-container">
                    <h4>Adresse</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Straße</label>
                        <input
                          type="text"
                          value={content.businessCard.street || ''}
                          onChange={(e) => handleChange('businessCard', 'street', e.target.value)}
                          placeholder="z.B. Musterstraße"
                        />
                      </div>
                      <div className="form-group small">
                        <label>Hausnummer</label>
                        <input
                          type="text"
                          value={content.businessCard.houseNumber || ''}
                          onChange={(e) => handleChange('businessCard', 'houseNumber', e.target.value)}
                          placeholder="z.B. 123"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group small">
                        <label>PLZ</label>
                        <input
                          type="text"
                          value={content.businessCard.postalCode || ''}
                          onChange={(e) => {
                            // Nur Zahlen erlauben und auf 5 Stellen begrenzen
                            const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                            handleChange('businessCard', 'postalCode', value);
                          }}
                          placeholder="z.B. 12345"
                          pattern="[0-9]{5}"
                        />
                        <small className="form-hint">5-stellige Postleitzahl</small>
                      </div>
                      <div className="form-group">
                        <label>Stadt</label>
                        <input
                          type="text"
                          value={content.businessCard.city || ''}
                          onChange={(e) => handleChange('businessCard', 'city', e.target.value)}
                          placeholder="z.B. Musterstadt"
                        />
                      </div>
                    </div>

                    {/* Für Abwärtskompatibilität - wird automatisch aktualisiert */}
                    <input
                      type="hidden"
                      value={`${content.businessCard.street || ''} ${content.businessCard.houseNumber || ''}, ${content.businessCard.postalCode || ''} ${content.businessCard.city || ''}`}
                      onChange={(e) => handleChange('businessCard', 'address', e.target.value)}
                    />
                  </div>
                  <div className="form-group priority-low">
                    <label>Website</label>
                    <input
                      type="url"
                      value={content.businessCard.website}
                      onChange={(e) => handleChange('businessCard', 'website', e.target.value)}
                      placeholder="z.B. https://musterhandwerker.de"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="qr-code-section">
              {content.businessCard.qrCodeUrl ? (
                <>
                  <div className="qr-code-preview">
                    <img
                      src={content.businessCard.qrCodeUrl}
                      alt="QR-Code für Visitenkarte"
                      className="qr-code-image"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-warning qr-regenerate-btn"
                    onClick={() => {
                      // Öffne den mehrstufigen Bestätigungsprozess
                      setShowQrConfirmation(true);
                    }}
                  >
                    QR-Code neu generieren
                  </button>

                  {/* Mehrstufiger Bestätigungsprozess */}
                  {showQrConfirmation && (
                    <div className="qr-confirmation-overlay">
                      <div className="qr-confirmation-modal">
                        {confirmationStep === 1 && (
                          <div className="confirmation-step step-1">
                            <h3>Achtung: QR-Code neu generieren</h3>
                            <div className="warning-icon">⚠️</div>
                            <p className="warning-text">
                              Sie sind dabei, einen neuen QR-Code zu generieren. Diese Aktion hat folgende Konsequenzen:
                            </p>
                            <ul className="warning-list">
                              <li>Alle bereits verteilten QR-Codes werden <strong>ungültig</strong>.</li>
                              <li>Gedruckte Materialien mit dem alten QR-Code müssen <strong>ersetzt</strong> werden.</li>
                              <li>Diese Aktion kann <strong>nicht rückgängig</strong> gemacht werden.</li>
                            </ul>
                            <div className="confirmation-actions">
                              <label className="confirmation-checkbox">
                                <input
                                  type="checkbox"
                                  checked={confirmationChecks.understand}
                                  onChange={() => setConfirmationChecks({
                                    ...confirmationChecks,
                                    understand: !confirmationChecks.understand
                                  })}
                                />
                                <span>Ich verstehe die Konsequenzen</span>
                              </label>
                              <div className="button-group">
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  onClick={() => {
                                    setShowQrConfirmation(false);
                                    setConfirmationStep(1);
                                    setConfirmationChecks({
                                      understand: false,
                                      materials: false,
                                      irreversible: false
                                    });
                                    setConfirmationCode('');
                                  }}
                                >
                                  Abbrechen
                                </button>
                                <button
                                  type="button"
                                  className="btn-primary"
                                  disabled={!confirmationChecks.understand}
                                  onClick={() => setConfirmationStep(2)}
                                >
                                  Fortfahren
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {confirmationStep === 2 && (
                          <div className="confirmation-step step-2">
                            <h3>Bestätigung der QR-Code-Neugenerierung</h3>
                            <p>
                              Bitte bestätigen Sie, dass Sie die folgenden Punkte verstanden haben und mit der Neugenerierung fortfahren möchten:
                            </p>
                            <div className="confirmation-form">
                              <label className="confirmation-checkbox">
                                <input
                                  type="checkbox"
                                  checked={confirmationChecks.materials}
                                  onChange={() => setConfirmationChecks({
                                    ...confirmationChecks,
                                    materials: !confirmationChecks.materials
                                  })}
                                />
                                <span>Ich bestätige, dass ich alle Marketingmaterialien mit dem alten QR-Code aktualisieren werde</span>
                              </label>
                              <label className="confirmation-checkbox">
                                <input
                                  type="checkbox"
                                  checked={confirmationChecks.irreversible}
                                  onChange={() => setConfirmationChecks({
                                    ...confirmationChecks,
                                    irreversible: !confirmationChecks.irreversible
                                  })}
                                />
                                <span>Ich verstehe, dass diese Aktion nicht rückgängig gemacht werden kann</span>
                              </label>
                              <div className="confirmation-code">
                                <label>Bitte geben Sie den Bestätigungscode ein: <strong>NEUERCODE</strong></label>
                                <input
                                  type="text"
                                  value={confirmationCode}
                                  onChange={(e) => setConfirmationCode(e.target.value)}
                                  placeholder="Bestätigungscode eingeben"
                                />
                              </div>
                              <div className="button-group">
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  onClick={() => setConfirmationStep(1)}
                                >
                                  Zurück
                                </button>
                                <button
                                  type="button"
                                  className="btn-warning"
                                  disabled={!confirmationChecks.materials || !confirmationChecks.irreversible || confirmationCode !== 'NEUERCODE'}
                                  onClick={() => {
                                    // API-Aufruf zum Neuerstellen des QR-Codes
                                    const websiteId = new URLSearchParams(window.location.search).get('id');
                                    if (websiteId) {
                                      // Zeige Ladeindikator
                                      setConfirmationStep(3);

                                      fetch(`/api/websites/${websiteId}/regenerate-qrcode`, {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                                        },
                                        body: JSON.stringify({
                                          documentOldQrCode: true // Anfrage zur Dokumentation des alten QR-Codes
                                        })
                                      })
                                      .then(response => response.json())
                                      .then(data => {
                                        if (data.success) {
                                          // QR-Code in der UI aktualisieren
                                          handleChange('businessCard', 'qrCodeUrl', data.qrCodeUrl);
                                          // Zeige Erfolgsschritt
                                          setConfirmationStep(4);
                                        } else {
                                          alert(`Fehler: ${data.message || 'Unbekannter Fehler'}`);
                                          setShowQrConfirmation(false);
                                          setConfirmationStep(1);
                                        }
                                      })
                                      .catch(error => {
                                        console.error('Error regenerating QR code:', error);
                                        alert('Fehler bei der Kommunikation mit dem Server.');
                                        setShowQrConfirmation(false);
                                        setConfirmationStep(1);
                                      });
                                    } else {
                                      alert('Website-ID nicht gefunden. Bitte speichern Sie die Website zuerst.');
                                      setShowQrConfirmation(false);
                                    }
                                  }}
                                >
                                  QR-Code neu generieren
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {confirmationStep === 3 && (
                          <div className="confirmation-step step-3">
                            <h3>QR-Code wird generiert</h3>
                            <div className="loading-spinner"></div>
                            <p>Bitte warten Sie, während Ihr neuer QR-Code generiert wird...</p>
                          </div>
                        )}

                        {confirmationStep === 4 && (
                          <div className="confirmation-step step-4">
                            <h3>QR-Code erfolgreich neu generiert</h3>
                            <div className="success-icon">✓</div>
                            <p>Ihr QR-Code wurde erfolgreich neu generiert.</p>
                            <p>Eine Kopie Ihres alten QR-Codes wurde für Ihre Unterlagen gespeichert und Ihnen per E-Mail zugesandt.</p>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => {
                                setShowQrConfirmation(false);
                                setConfirmationStep(1);
                                setConfirmationChecks({
                                  understand: false,
                                  materials: false,
                                  irreversible: false
                                });
                                setConfirmationCode('');
                              }}
                            >
                              Schließen
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="warning-text">
                    <strong>Achtung:</strong> Ein neuer QR-Code macht alle bereits verteilten QR-Codes ungültig!
                  </div>
                </>
              ) : (
                <p className="info-text">
                  Der QR-Code wird automatisch generiert, wenn die Website veröffentlicht wird.
                </p>
              )}
            </div>
          </div>
        );
      case 'openingHours':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Öffnungszeiten</h3>
            </div>
            <p>Gib die Öffnungszeiten deines Unternehmens an.</p>

            <div className="opening-hours-container">
              {content.openingHours.map((day, index) => (
                <div key={index} className="opening-hours-row">
                  <div className="day-label">{day.day}</div>
                  <div className="hours-inputs">
                    <label className="closed-checkbox">
                      <input
                        type="checkbox"
                        checked={day.closed}
                        onChange={(e) => {
                          const updatedHours = [...content.openingHours];
                          updatedHours[index].closed = e.target.checked;
                          handleChange('openingHours', '', updatedHours);
                        }}
                      />
                      <span>Geschlossen</span>
                    </label>

                    {!day.closed && (
                      <>
                        <div className="time-input">
                          <label>Von</label>
                          <input
                            type="time"
                            value={day.open}
                            onChange={(e) => {
                              const updatedHours = [...content.openingHours];
                              updatedHours[index].open = e.target.value;
                              handleChange('openingHours', '', updatedHours);
                            }}
                          />
                        </div>
                        <div className="time-input">
                          <label>Bis</label>
                          <input
                            type="time"
                            value={day.close}
                            onChange={(e) => {
                              const updatedHours = [...content.openingHours];
                              updatedHours[index].close = e.target.value;
                              handleChange('openingHours', '', updatedHours);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="info-text">
              <p>Die Öffnungszeiten werden auf deiner Website im Kontaktbereich angezeigt.</p>
            </div>
          </div>
        );

      case 'faqs':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Häufig gestellte Fragen (FAQ)</h3>
            </div>
            <p>Füge häufig gestellte Fragen und deren Antworten hinzu, um deinen Kunden wichtige Informationen zu bieten.</p>

            {content.faqs.length === 0 ? (
              <div className="empty-state">
                <p>Du hast noch keine FAQs hinzugefügt.</p>
              </div>
            ) : (
              <div className="faqs-container">
                {content.faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-header">
                      <h4>Frage {index + 1}</h4>
                      <button
                        type="button"
                        className="btn-danger btn-small"
                        onClick={() => {
                          const updatedFaqs = [...content.faqs];
                          updatedFaqs.splice(index, 1);
                          handleChange('faqs', '', updatedFaqs);
                        }}
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Frage</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updatedFaqs = [...content.faqs];
                          updatedFaqs[index].question = e.target.value;
                          handleChange('faqs', '', updatedFaqs);
                        }}
                        placeholder="z.B. Wie lange dauert die Ausführung eines Auftrags?"
                      />
                    </div>
                    <div className="form-group">
                      <label>Antwort</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const updatedFaqs = [...content.faqs];
                          updatedFaqs[index].answer = e.target.value;
                          handleChange('faqs', '', updatedFaqs);
                        }}
                        placeholder="z.B. Die Dauer hängt vom Umfang des Auftrags ab. In der Regel benötigen wir 2-3 Werktage für kleinere Aufträge und 1-2 Wochen für größere Projekte."
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="faq-actions">
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn-secondary btn-small"
                          onClick={() => {
                            const updatedFaqs = [...content.faqs];
                            const temp = updatedFaqs[index];
                            updatedFaqs[index] = updatedFaqs[index - 1];
                            updatedFaqs[index - 1] = temp;
                            handleChange('faqs', '', updatedFaqs);
                          }}
                        >
                          Nach oben
                        </button>
                      )}
                      {index < content.faqs.length - 1 && (
                        <button
                          type="button"
                          className="btn-secondary btn-small"
                          onClick={() => {
                            const updatedFaqs = [...content.faqs];
                            const temp = updatedFaqs[index];
                            updatedFaqs[index] = updatedFaqs[index + 1];
                            updatedFaqs[index + 1] = temp;
                            handleChange('faqs', '', updatedFaqs);
                          }}
                        >
                          Nach unten
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="btn-primary add-faq-btn"
              onClick={() => {
                const updatedFaqs = [...content.faqs];
                updatedFaqs.push({
                  question: '',
                  answer: '',
                  order: updatedFaqs.length
                });
                handleChange('faqs', '', updatedFaqs);
              }}
            >
              Neue Frage hinzufügen
            </button>

            <div className="info-text">
              <p>Die FAQs werden auf deiner Website in einem eigenen Bereich angezeigt.</p>
            </div>
          </div>
        );

      case 'servicesCatalog':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Dienstleistungskatalog</h3>
            </div>
            <p>Präsentiere deine Dienstleistungen in einem übersichtlichen Katalog.</p>

            <div className="form-group">
              <label>Titel des Dienstleistungsbereichs</label>
              <input
                type="text"
                value={content.servicesCatalog.title}
                onChange={(e) => handleChange('servicesCatalog', 'title', e.target.value)}
                placeholder="z.B. Unsere Dienstleistungen"
              />
            </div>

            <div className="form-group">
              <label>Beschreibung</label>
              <textarea
                value={content.servicesCatalog.description}
                onChange={(e) => handleChange('servicesCatalog', 'description', e.target.value)}
                placeholder="z.B. Hier finden Sie eine Übersicht unserer Dienstleistungen."
                rows={3}
              ></textarea>
            </div>

            <div className="services-categories">
              <h4>Kategorien</h4>

              {content.servicesCatalog.categories.length === 0 ? (
                <div className="empty-state">
                  <p>Du hast noch keine Kategorien hinzugefügt.</p>
                </div>
              ) : (
                <div className="categories-container">
                  {content.servicesCatalog.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="category-item">
                      <div className="category-header">
                        <h4>{category.name || 'Neue Kategorie'}</h4>
                        <button
                          type="button"
                          className="btn-danger btn-small"
                          onClick={() => {
                            const updatedCategories = [...content.servicesCatalog.categories];
                            updatedCategories.splice(categoryIndex, 1);
                            handleChange('servicesCatalog', 'categories', updatedCategories);
                          }}
                        >
                          Kategorie entfernen
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Kategoriename</label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = [...content.servicesCatalog.categories];
                            updatedCategories[categoryIndex].name = e.target.value;
                            handleChange('servicesCatalog', 'categories', updatedCategories);
                          }}
                          placeholder="z.B. Sanitärinstallationen"
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategoriebeschreibung</label>
                        <textarea
                          value={category.description}
                          onChange={(e) => {
                            const updatedCategories = [...content.servicesCatalog.categories];
                            updatedCategories[categoryIndex].description = e.target.value;
                            handleChange('servicesCatalog', 'categories', updatedCategories);
                          }}
                          placeholder="z.B. Wir bieten professionelle Sanitärinstallationen für Ihr Zuhause."
                          rows={2}
                        ></textarea>
                      </div>

                      <div className="services-list">
                        <h5>Dienstleistungen in dieser Kategorie</h5>

                        {category.services.length === 0 ? (
                          <div className="empty-state small">
                            <p>Keine Dienstleistungen in dieser Kategorie.</p>
                          </div>
                        ) : (
                          <div className="services-container">
                            {category.services.map((service, serviceIndex) => (
                              <div key={serviceIndex} className="service-item">
                                <div className="service-header">
                                  <h6>{service.name || 'Neue Dienstleistung'}</h6>
                                  <button
                                    type="button"
                                    className="btn-danger btn-small"
                                    onClick={() => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services.splice(serviceIndex, 1);
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                  >
                                    Entfernen
                                  </button>
                                </div>

                                <div className="form-group">
                                  <label>Name der Dienstleistung</label>
                                  <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services[serviceIndex].name = e.target.value;
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                    placeholder="z.B. Badsanierung"
                                  />
                                </div>

                                <div className="form-group">
                                  <label>Kurzbeschreibung</label>
                                  <input
                                    type="text"
                                    value={service.description}
                                    onChange={(e) => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services[serviceIndex].description = e.target.value;
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                    placeholder="z.B. Komplette Renovierung Ihres Badezimmers"
                                  />
                                </div>

                                <div className="form-group">
                                  <label>Detaillierte Beschreibung</label>
                                  <textarea
                                    value={service.details}
                                    onChange={(e) => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services[serviceIndex].details = e.target.value;
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                    placeholder="z.B. Unsere Badsanierung umfasst die komplette Renovierung Ihres Badezimmers, von der Planung bis zur Ausführung. Wir kümmern uns um Fliesen, Sanitäranlagen, Elektrik und Malerarbeiten."
                                    rows={3}
                                  ></textarea>
                                </div>

                                <div className="form-group">
                                  <label>Icon (Emoji oder Text)</label>
                                  <input
                                    type="text"
                                    value={service.icon}
                                    onChange={(e) => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services[serviceIndex].icon = e.target.value;
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                    placeholder="z.B. 🛁 oder ⚒️"
                                  />
                                </div>

                                <div className="form-group">
                                  <label>Bild-URL (optional)</label>
                                  <input
                                    type="text"
                                    value={service.imageUrl}
                                    onChange={(e) => {
                                      const updatedCategories = [...content.servicesCatalog.categories];
                                      updatedCategories[categoryIndex].services[serviceIndex].imageUrl = e.target.value;
                                      handleChange('servicesCatalog', 'categories', updatedCategories);
                                    }}
                                    placeholder="z.B. https://example.com/image.jpg oder /uploads/image.jpg"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          className="btn-secondary add-service-btn"
                          onClick={() => {
                            const updatedCategories = [...content.servicesCatalog.categories];
                            updatedCategories[categoryIndex].services.push({
                              name: '',
                              description: '',
                              details: '',
                              icon: '🔧',
                              imageUrl: ''
                            });
                            handleChange('servicesCatalog', 'categories', updatedCategories);
                          }}
                        >
                          Dienstleistung hinzufügen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn-primary add-category-btn"
                onClick={() => {
                  const updatedCategories = [...content.servicesCatalog.categories];
                  updatedCategories.push({
                    name: '',
                    description: '',
                    services: []
                  });
                  handleChange('servicesCatalog', 'categories', updatedCategories);
                }}
              >
                Neue Kategorie hinzufügen
              </button>
            </div>

            <div className="info-text">
              <p>Der Dienstleistungskatalog wird auf deiner Website in einem eigenen Bereich angezeigt.</p>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="editor-section">
            <div className="form-section-title">
              <h3>Blog/News-Bereich</h3>
            </div>
            <p>Halte deine Kunden mit aktuellen Informationen und Neuigkeiten auf dem Laufenden.</p>

            <div className="form-group">
              <label>Titel des Blog-Bereichs</label>
              <input
                type="text"
                value={content.blog.title}
                onChange={(e) => handleChange('blog', 'title', e.target.value)}
                placeholder="z.B. Aktuelles & Neuigkeiten"
              />
            </div>

            <div className="form-group">
              <label>Beschreibung</label>
              <textarea
                value={content.blog.description}
                onChange={(e) => handleChange('blog', 'description', e.target.value)}
                placeholder="z.B. Hier finden Sie aktuelle Informationen und Neuigkeiten."
                rows={3}
              ></textarea>
            </div>

            <div className="blog-posts">
              <h4>Blog-Beiträge</h4>

              {content.blog.posts.length === 0 ? (
                <div className="empty-state">
                  <p>Du hast noch keine Blog-Beiträge hinzugefügt.</p>
                </div>
              ) : (
                <div className="posts-container">
                  {content.blog.posts.map((post, postIndex) => (
                    <div key={postIndex} className="blog-post-item">
                      <div className="post-header">
                        <h4>{post.title || 'Neuer Beitrag'}</h4>
                        <button
                          type="button"
                          className="btn-danger btn-small"
                          onClick={() => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts.splice(postIndex, 1);
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                        >
                          Beitrag entfernen
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Titel des Beitrags</label>
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].title = e.target.value;

                            // Automatisch einen Slug generieren
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '') // Entferne Sonderzeichen
                              .replace(/\s+/g, '-') // Ersetze Leerzeichen durch Bindestriche
                              .replace(/--+/g, '-'); // Entferne doppelte Bindestriche

                            updatedPosts[postIndex].slug = slug;

                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. Neue Techniken im Sanitärbereich"
                        />
                      </div>

                      <div className="form-group">
                        <label>Autor</label>
                        <input
                          type="text"
                          value={post.author}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].author = e.target.value;
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. Max Mustermann"
                        />
                      </div>

                      <div className="form-group">
                        <label>Veröffentlichungsdatum</label>
                        <input
                          type="date"
                          value={post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].publishDate = e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString();
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Kurzzusammenfassung</label>
                        <textarea
                          value={post.summary}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].summary = e.target.value;
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. In diesem Beitrag stellen wir die neuesten Techniken im Sanitärbereich vor."
                          rows={2}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>Inhalt des Beitrags</label>
                        <textarea
                          value={post.content}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].content = e.target.value;
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="Hier den vollständigen Inhalt des Beitrags eingeben..."
                          rows={6}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>Bild-URL (optional)</label>
                        <input
                          type="text"
                          value={post.imageUrl}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].imageUrl = e.target.value;
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. https://example.com/image.jpg oder /uploads/image.jpg"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tags (mit Komma getrennt)</label>
                        <input
                          type="text"
                          value={post.tags ? post.tags.join(', ') : ''}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].tags = e.target.value
                              .split(',')
                              .map(tag => tag.trim())
                              .filter(tag => tag !== '');
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. Sanitär, Neuheiten, Technik"
                        />
                      </div>

                      <div className="form-group">
                        <label>URL-Slug</label>
                        <input
                          type="text"
                          value={post.slug}
                          onChange={(e) => {
                            const updatedPosts = [...content.blog.posts];
                            updatedPosts[postIndex].slug = e.target.value
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/--+/g, '-');
                            handleChange('blog', 'posts', updatedPosts);
                          }}
                          placeholder="z.B. neue-techniken-im-sanitaerbereich"
                        />
                        <small className="form-text">Der Slug wird automatisch aus dem Titel generiert, kann aber manuell angepasst werden.</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn-primary add-post-btn"
                onClick={() => {
                  const updatedPosts = [...content.blog.posts];
                  const now = new Date().toISOString();
                  updatedPosts.push({
                    title: '',
                    content: '',
                    summary: '',
                    imageUrl: '',
                    author: '',
                    publishDate: now,
                    tags: [],
                    slug: ''
                  });
                  handleChange('blog', 'posts', updatedPosts);
                }}
              >
                Neuen Beitrag hinzufügen
              </button>
            </div>

            <div className="info-text">
              <p>Der Blog/News-Bereich wird auf deiner Website in einem eigenen Bereich angezeigt.</p>
            </div>
          </div>
        );
      case 'seo':
        return <SEOEditor content={content} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="content-editor">
      <h2>Bearbeite die Inhalte deiner Website</h2>

      <div className="example-content-selector">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowExampleSelector(!showExampleSelector)}
        >
          Beispielinhalte laden
        </button>

        {showExampleSelector && (
          <div className="example-selector-dropdown">
            <h4>Wähle eine Branche</h4>
            <div className="example-options">
              <button
                type="button"
                className="example-option"
                onClick={() => loadExampleContent('plumber')}
              >
                Sanitär, Heizung, Klima
              </button>
              <button
                type="button"
                className="example-option"
                onClick={() => loadExampleContent('electrician')}
              >
                Elektrotechnik
              </button>
              <button
                type="button"
                className="example-option"
                onClick={() => loadExampleContent('painter')}
              >
                Malerbetrieb
              </button>
            </div>
            <p className="example-info">
              Die Beispielinhalte ersetzen deine aktuellen Inhalte. Bilder müssen separat hochgeladen werden.
            </p>
          </div>
        )}
      </div>

      <div className="content-editor-container">
        <div className="editor-tabs-container">
          {isMobile ? (
            <div className="editor-tabs mobile-tabs">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="mobile-tab-selector"
              >
                <option value="general">Allgemein</option>
                <option value="hero">Hero-Bereich</option>
                <option value="about">Über uns</option>
                <option value="services">Leistungen</option>
                <option value="contact">Kontakt</option>
                <option value="gallery">Galerie</option>
                <option value="social">Social Media</option>
                <option value="businessCard">Visitenkarte</option>
                <option value="openingHours">Öffnungszeiten</option>
                <option value="faqs">FAQ</option>
                <option value="servicesCatalog">Dienstleistungen</option>
                <option value="blog">Blog/News</option>
                <option value="seo">SEO</option>
              </select>
            </div>
          ) : (
            <div className="editor-tabs">
              <button
                className={activeTab === 'general' ? 'active' : ''}
                onClick={() => setActiveTab('general')}
              >
                Allgemein
              </button>
              <button
                className={activeTab === 'hero' ? 'active' : ''}
                onClick={() => setActiveTab('hero')}
              >
                Hero-Bereich
              </button>
              <button
                className={activeTab === 'about' ? 'active' : ''}
                onClick={() => setActiveTab('about')}
              >
                Über uns
              </button>
              <button
                className={activeTab === 'services' ? 'active' : ''}
                onClick={() => setActiveTab('services')}
              >
                Leistungen
              </button>
              <button
                className={activeTab === 'contact' ? 'active' : ''}
                onClick={() => setActiveTab('contact')}
              >
                Kontakt
              </button>
              <button
                className={activeTab === 'gallery' ? 'active' : ''}
                onClick={() => setActiveTab('gallery')}
              >
                Galerie
              </button>
              <button
                className={activeTab === 'social' ? 'active' : ''}
                onClick={() => setActiveTab('social')}
              >
                Social Media
              </button>
              <button
                className={activeTab === 'businessCard' ? 'active' : ''}
                onClick={() => setActiveTab('businessCard')}
              >
                Visitenkarte
              </button>
              <button
                className={activeTab === 'openingHours' ? 'active' : ''}
                onClick={() => setActiveTab('openingHours')}
              >
                Öffnungszeiten
              </button>
              <button
                className={activeTab === 'faqs' ? 'active' : ''}
                onClick={() => setActiveTab('faqs')}
              >
                FAQ
              </button>
              <button
                className={activeTab === 'servicesCatalog' ? 'active' : ''}
                onClick={() => setActiveTab('servicesCatalog')}
              >
                Dienstleistungen
              </button>
              <button
                className={activeTab === 'blog' ? 'active' : ''}
                onClick={() => setActiveTab('blog')}
              >
                Blog/News
              </button>
              <button
                className={activeTab === 'seo' ? 'active' : ''}
                onClick={() => setActiveTab('seo')}
              >
                SEO
              </button>
            </div>
          )}
        </div>

        <div className="editor-content-container">
          <div className="editor-content">
            {renderTabContent()}
          </div>

          {/* Vorschau-Button für alle Geräte */}
          <div className="preview-button-container">
            <TouchFriendlyButton
              type="secondary"
              className="preview-button"
              onClick={() => {
                // Speichere die aktuelle Website im localStorage für die Vorschau
                const currentWebsite = {
                  content: content,
                  layout: content.layout || '',
                  design: content.design || '',
                  colorScheme: content.colorScheme || '',
                  title: content.title || 'Meine Website'
                };
                localStorage.setItem('currentWebsite', JSON.stringify(currentWebsite));
                window.open('/preview', '_blank');
              }}
            >
              Vorschau in neuem Tab öffnen
            </TouchFriendlyButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentEditor;
