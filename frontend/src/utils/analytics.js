/**
 * Analytics Service für 247Vitrine
 */
class Analytics {
  constructor() {
    this.events = [];
    this.initialized = false;
  }

  /**
   * Initialisiert Analytics
   */
  init() {
    if (this.initialized) return;

    // Performance-Metriken sammeln
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const metrics = this.collectPerformanceMetrics();
        this.trackEvent('performance', metrics);
      });
    }

    // Benutzerinteraktionen tracken
    this.trackUserInteractions();

    this.initialized = true;
  }

  /**
   * Sammelt Performance-Metriken
   */
  collectPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      loadTime: navigation.loadEventEnd - navigation.startTime,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      resourceCount: performance.getEntriesByType('resource').length
    };
  }

  /**
   * Trackt Benutzerinteraktionen
   */
  trackUserInteractions() {
    // Klick-Events
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, [role="button"]');
      if (target) {
        this.trackEvent('interaction', {
          type: 'click',
          element: target.tagName.toLowerCase(),
          id: target.id,
          text: target.textContent?.trim(),
          path: window.location.pathname
        });
      }
    });

    // Formular-Submissions
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        this.trackEvent('interaction', {
          type: 'form_submit',
          formId: e.target.id,
          path: window.location.pathname
        });
      }
    });

    // Seitenaufrufe
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });
  }

  /**
   * Trackt einen Seitenaufruf
   */
  trackPageView() {
    this.trackEvent('pageview', {
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title
    });
  }

  /**
   * Trackt ein Event
   */
  trackEvent(category, data) {
    const event = {
      category,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };

    this.events.push(event);
    this.sendToServer(event);
  }

  /**
   * Sendet Events an den Server
   */
  async sendToServer(event) {
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.error('Fehler beim Senden des Analytics-Events:', response.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Senden des Analytics-Events:', error);
      // Events für späteren Versuch speichern
      this.storeEventLocally(event);
    }
  }

  /**
   * Speichert Events lokal
   */
  storeEventLocally(event) {
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    storedEvents.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
  }

  /**
   * Versucht gespeicherte Events erneut zu senden
   */
  async retrySendingStoredEvents() {
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    if (storedEvents.length === 0) return;

    const successfulEvents = [];

    for (const event of storedEvents) {
      try {
        await this.sendToServer(event);
        successfulEvents.push(event);
      } catch (error) {
        console.error('Fehler beim erneuten Senden des Events:', error);
      }
    }

    // Erfolgreiche Events aus dem Speicher entfernen
    const remainingEvents = storedEvents.filter(
      event => !successfulEvents.includes(event)
    );
    localStorage.setItem('analytics_events', JSON.stringify(remainingEvents));
  }

  /**
   * Generiert oder holt Session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Holt User ID
   */
  getUserId() {
    // Implementierung abhängig von Ihrer Authentifizierungsmethode
    return localStorage.getItem('user_id') || null;
  }
}

export default new Analytics(); 