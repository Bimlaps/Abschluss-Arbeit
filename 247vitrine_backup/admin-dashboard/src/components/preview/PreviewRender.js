import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PreviewRender.css';

// Hilfsfunktion, um zu prüfen, ob ein Tag der aktuelle Tag ist
const isToday = (dayName) => {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const today = new Date().getDay();
  return days[today] === dayName;
};

// Fügt einen Meta-Viewport-Tag hinzu, um sicherzustellen, dass die Vorschau korrekt skaliert wird
document.querySelector('meta[name="viewport"]')?.remove();
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(metaViewport);

function PreviewRender() {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const websiteData = searchParams.get('data');

      if (websiteData) {
        const parsedData = JSON.parse(decodeURIComponent(websiteData));
        setWebsite(parsedData);
      } else {
        setError('Keine Website-Daten gefunden.');
      }
    } catch (err) {
      console.error('Fehler beim Parsen der Website-Daten:', err);
      setError('Die Website-Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  // Kontaktformular-Funktionalität
  useEffect(() => {
    if (!website) return;

    // Warten, bis das DOM geladen ist
    setTimeout(() => {
      const contactForm = document.querySelector('.contact-form');
      const formMessages = document.getElementById('form-messages');

      if (contactForm && formMessages) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          // Formularfelder auslesen
          const nameInput = contactForm.querySelector('#name');
          const emailInput = contactForm.querySelector('#email');
          const phoneInput = contactForm.querySelector('#phone');
          const messageInput = contactForm.querySelector('#message');
          const submitButton = contactForm.querySelector('.submit-button');

          // Validierung
          if (!nameInput.value || !emailInput.value || !messageInput.value) {
            formMessages.className = 'error-message';
            formMessages.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
            return;
          }

          // E-Mail-Format validieren
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(emailInput.value)) {
            formMessages.className = 'error-message';
            formMessages.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            return;
          }

          // Button deaktivieren und Ladezustand anzeigen
          submitButton.disabled = true;
          submitButton.textContent = 'Wird gesendet...';
          formMessages.className = '';
          formMessages.textContent = '';

          // Daten für die API vorbereiten
          const content = website.content || website;
          const formData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            message: messageInput.value,
            recipient: content.contact.email // E-Mail-Adresse des Handwerkers
          };

          // API-Anfrage senden
          fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Erfolgsfall
              formMessages.className = 'success-message';
              formMessages.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';

              // Formular zurücksetzen
              contactForm.reset();
            } else {
              // Fehlerfall
              formMessages.className = 'error-message';
              formMessages.textContent = data.message || 'Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
            }
          })
          .catch(error => {
            console.error('Error sending contact form:', error);
            formMessages.className = 'error-message';
            formMessages.textContent = 'Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
          })
          .finally(() => {
            // Button wieder aktivieren
            submitButton.disabled = false;
            submitButton.textContent = 'Nachricht senden';
          });
        });
      }
    }, 1000); // Kurze Verzögerung, um sicherzustellen, dass das DOM geladen ist
  }, [website]);

  if (loading) {
    return <div className="preview-loading">Lade Vorschau...</div>;
  }

  if (error) {
    return <div className="preview-error">{error}</div>;
  }

  if (!website) {
    return <div className="preview-error">Keine Website-Daten gefunden.</div>;
  }

  // Hier rendern wir die Website basierend auf dem Layout und Design
  const renderWebsite = () => {
    // Extrahiere die Daten aus dem Website-Objekt
    // Berücksichtige sowohl direkte Eigenschaften als auch Eigenschaften im content-Objekt
    const { layout, design, colorScheme } = website;

    // Extrahiere die Inhalte entweder direkt oder aus dem content-Objekt
    const content = website.content || website;
    const title = content.title || 'Meine Website';
    const description = content.description || '';
    const logo = content.logo || '';
    const hero = content.hero || {};
    const about = content.about || {};
    const services = content.services || [];
    const contact = content.contact || {};
    const gallery = content.gallery || [];
    const socialMedia = content.socialMedia || {};

    // Einfache Vorschau für One-Page-Layout
    if (layout?.category === 'one-page') {
      return (
        <div className={`website-preview one-page ${design?.id || 'default'} ${colorScheme?.id || 'default'}`}>
          {/* Header */}
          <header className="site-header">
            {logo && <img src={logo} alt={title} className="site-logo" />}
            <h1 className="site-title">{title || 'Meine Website'}</h1>
          </header>

          {/* Hero-Bereich */}
          <section className="hero-section">
            {hero?.image && <img src={hero.image} alt="" className="hero-image" />}
            <div className="hero-content">
              <h2>{hero?.title || 'Willkommen'}</h2>
              <p>{hero?.subtitle || 'Untertitel'}</p>
            </div>
          </section>

          {/* Über uns */}
          <section className="about-section">
            <h2>{about?.title || 'Über uns'}</h2>
            <div className="about-content">
              <div className="about-text">
                <p>{about?.text || 'Hier steht ein Text über das Unternehmen.'}</p>
              </div>
              {about?.image && (
                <div className="about-image">
                  <img src={about.image} alt="Über uns" />
                </div>
              )}
            </div>
          </section>

          {/* Leistungen */}
          <section className="services-section">
            <h2>Unsere Leistungen</h2>
            <div className="services-grid">
              {services && services.length > 0 ? (
                services.map((service, index) => (
                  <div key={index} className="service-item">
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                ))
              ) : (
                <p>Keine Leistungen definiert.</p>
              )}
            </div>
          </section>

          {/* Galerie */}
          {gallery && gallery.length > 0 && (
            <section className="gallery-section">
              <h2>Galerie</h2>
              <div className="gallery-grid">
                {gallery.map((item, index) => (
                  <div key={index} className="gallery-item">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dienstleistungskatalog */}
          {content.servicesCatalog && content.servicesCatalog.categories && content.servicesCatalog.categories.length > 0 && (
            <section className="services-catalog-section">
              <h2>{content.servicesCatalog.title || 'Unsere Dienstleistungen'}</h2>
              <p className="services-catalog-description">{content.servicesCatalog.description || 'Hier finden Sie eine Übersicht unserer Dienstleistungen.'}</p>

              <div className="services-catalog">
                {content.servicesCatalog.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="service-category">
                    <h3 className="category-title">{category.name}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}

                    <div className="services-grid">
                      {category.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="service-card">
                          <div className="service-icon">{service.icon}</div>
                          <h4 className="service-title">{service.name}</h4>
                          <p className="service-description">{service.description}</p>
                          {service.details && (
                            <div className="service-details">
                              <p>{service.details}</p>
                            </div>
                          )}
                          {service.imageUrl && (
                            <div className="service-image">
                              <img src={service.imageUrl} alt={service.name} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Blog/News-Bereich */}
          {content.blog && content.blog.posts && content.blog.posts.length > 0 && (
            <section className="blog-section">
              <h2>{content.blog.title || 'Aktuelles & Neuigkeiten'}</h2>
              <p className="blog-description">{content.blog.description || 'Hier finden Sie aktuelle Informationen und Neuigkeiten.'}</p>

              <div className="blog-posts-grid">
                {content.blog.posts
                  .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
                  .slice(0, 3) // Zeige nur die neuesten 3 Beiträge in der Übersicht
                  .map((post, postIndex) => (
                    <div key={postIndex} className="blog-post-card">
                      {post.imageUrl && (
                        <div className="post-image">
                          <img src={post.imageUrl} alt={post.title} />
                        </div>
                      )}
                      <div className="post-content">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          {post.publishDate && (
                            <span className="post-date">
                              {new Date(post.publishDate).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                          {post.author && (
                            <span className="post-author">von {post.author}</span>
                          )}
                        </div>
                        {post.summary && (
                          <p className="post-summary">{post.summary}</p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="post-tags">
                            {post.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                        <a href={`#blog/${post.slug || postIndex}`} className="read-more-link">
                          Weiterlesen
                        </a>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="blog-archive-link">
                <a href="#blog">Alle Beiträge anzeigen</a>
              </div>

              {/* Einzelansicht eines Blog-Beitrags (normalerweise auf einer separaten Seite) */}
              <div className="blog-post-detail" style={{ display: 'none' }}>
                <div className="post-header">
                  <h2 className="post-title">Beispiel-Beitragstitel</h2>
                  <div className="post-meta">
                    <span className="post-date">01.01.2023</span>
                    <span className="post-author">von Max Mustermann</span>
                  </div>
                </div>

                <div className="post-featured-image">
                  <img src="" alt="Beispiel-Beitragsbild" />
                </div>

                <div className="post-full-content">
                  <p>Hier steht der vollständige Inhalt des Beitrags...</p>
                </div>

                <div className="post-tags">
                  <span className="tag">Tag 1</span>
                  <span className="tag">Tag 2</span>
                </div>

                <div className="post-navigation">
                  <a href="#blog" className="back-to-blog">Zurück zur Übersicht</a>
                </div>
              </div>
            </section>
          )}

          {/* FAQ-Bereich */}
          {content.faqs && content.faqs.length > 0 && (
            <section className="faq-section">
              <h2>Häufig gestellte Fragen</h2>
              <div className="faq-list">
                {content.faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Kontakt */}
          <section className="contact-section">
            <h2>Kontakt</h2>
            <div className="contact-info">
              {contact?.email && (
                <div className="contact-item">
                  <strong>E-Mail:</strong> {contact.email}
                </div>
              )}
              {contact?.phone && (
                <div className="contact-item">
                  <strong>Telefon:</strong> {contact.phone}
                </div>
              )}
              {/* Adresse aus einzelnen Feldern oder aus dem address-Feld */}
              {(contact?.street || contact?.address) && (
                <div className="contact-item">
                  <strong>Adresse:</strong> {
                    contact.street
                      ? `${contact.street} ${contact.houseNumber || ''}, ${contact.postalCode || ''} ${contact.city || ''}`
                      : contact.address
                  }
                </div>
              )}

              {/* Öffnungszeiten */}
              {content.openingHours && content.openingHours.length > 0 && (
                <div className="opening-hours">
                  <h3>Öffnungszeiten</h3>
                  <table className="hours-table">
                    <tbody>
                      {content.openingHours.map((day, index) => (
                        <tr key={index} className={isToday(day.day) ? 'today' : ''}>
                          <td className="day">{day.day}</td>
                          <td className="hours">
                            {day.closed ? (
                              <span className="closed">Geschlossen</span>
                            ) : (
                              `${day.open} - ${day.close} Uhr`
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Kontaktformular */}
              <div className="contact-form-container">
                <div className="contact-form">
                  <h3>Kontaktformular</h3>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Ihr Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-Mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Ihre E-Mail-Adresse"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Ihre Telefonnummer (optional)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Nachricht *</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Ihre Nachricht an uns"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">Nachricht senden</button>
                  <div id="form-messages"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer mit Social Media */}
          <footer className="site-footer">
            <div className="social-links">
              {socialMedia?.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                  Facebook
                </a>
              )}
              {socialMedia?.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
              )}
              {socialMedia?.whatsapp && (
                <a href={`https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="social-link">
                  WhatsApp
                </a>
              )}
              {socialMedia?.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                </a>
              )}
              {socialMedia?.xing && (
                <a href={socialMedia.xing} target="_blank" rel="noopener noreferrer" className="social-link">
                  Xing
                </a>
              )}
            </div>
            <p className="copyright">© {new Date().getFullYear()} {title || 'Meine Website'}</p>
          </footer>
        </div>
      );
    }

    // Für andere Layouts können hier weitere Vorschau-Varianten hinzugefügt werden
    return (
      <div className="preview-error">
        <p>Vorschau für dieses Layout ist noch nicht verfügbar.</p>
      </div>
    );
  };

  return renderWebsite();
}

export default PreviewRender;
