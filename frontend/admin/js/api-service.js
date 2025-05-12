/**
 * API-Service für die Admin-Funktionalität
 * Stellt Methoden für den Zugriff auf die Backend-API bereit
 */
class ApiService {
  constructor() {
    this.baseUrl = '/api';
    this.adminUrl = `${this.baseUrl}/admin`;

    // Für lokale Entwicklung
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.baseUrl = 'http://localhost:3001/api';
      this.adminUrl = `${this.baseUrl}/admin`;
    }
  }

  /**
   * Hilfsmethode für API-Aufrufe
   * @param {string} url - API-Endpunkt
   * @param {string} method - HTTP-Methode (GET, POST, PUT, DELETE)
   * @param {object} data - Daten für POST/PUT-Anfragen
   * @returns {Promise} - Promise mit der API-Antwort
   */
  async fetchApi(url, method = 'GET', data = null) {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };

    const options = {
      method,
      headers,
      credentials: 'same-origin'
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Wenn der Token abgelaufen ist, zur Login-Seite umleiten
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return null;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ein Fehler ist aufgetreten');
      }

      return result;
    } catch (error) {
      console.error('API-Fehler:', error);
      throw error;
    }
  }

  // ===== Benutzer-API =====

  /**
   * Alle Benutzer abrufen
   * @returns {Promise} - Promise mit der Liste der Benutzer
   */
  async getUsers() {
    return this.fetchApi(`${this.adminUrl}/users`);
  }

  /**
   * Einen Benutzer nach ID abrufen
   * @param {string} id - Benutzer-ID
   * @returns {Promise} - Promise mit dem Benutzer
   */
  async getUserById(id) {
    return this.fetchApi(`${this.adminUrl}/users/${id}`);
  }

  /**
   * Neuen Benutzer erstellen
   * @param {object} userData - Benutzerdaten
   * @returns {Promise} - Promise mit dem erstellten Benutzer
   */
  async createUser(userData) {
    return this.fetchApi(`${this.adminUrl}/users`, 'POST', userData);
  }

  /**
   * Benutzer aktualisieren
   * @param {string} id - Benutzer-ID
   * @param {object} userData - Benutzerdaten
   * @returns {Promise} - Promise mit dem aktualisierten Benutzer
   */
  async updateUser(id, userData) {
    return this.fetchApi(`${this.adminUrl}/users/${id}`, 'PUT', userData);
  }

  /**
   * Benutzer löschen
   * @param {string} id - Benutzer-ID
   * @returns {Promise} - Promise mit der Bestätigung
   */
  async deleteUser(id) {
    return this.fetchApi(`${this.adminUrl}/users/${id}`, 'DELETE');
  }

  /**
   * Benutzerstatistiken abrufen
   * @returns {Promise} - Promise mit den Benutzerstatistiken
   */
  async getUserStats() {
    return this.fetchApi(`${this.adminUrl}/users/stats`);
  }

  // ===== Template-API =====

  /**
   * Alle Templates abrufen
   * @returns {Promise} - Promise mit der Liste der Templates
   */
  async getTemplates() {
    return this.fetchApi(`${this.adminUrl}/templates`);
  }

  /**
   * Ein Template nach ID abrufen
   * @param {string} id - Template-ID
   * @returns {Promise} - Promise mit dem Template
   */
  async getTemplateById(id) {
    return this.fetchApi(`${this.adminUrl}/templates/${id}`);
  }

  /**
   * Neues Template erstellen
   * @param {object} templateData - Template-Daten
   * @returns {Promise} - Promise mit dem erstellten Template
   */
  async createTemplate(templateData) {
    return this.fetchApi(`${this.adminUrl}/templates`, 'POST', templateData);
  }

  /**
   * Template aktualisieren
   * @param {string} id - Template-ID
   * @param {object} templateData - Template-Daten
   * @returns {Promise} - Promise mit dem aktualisierten Template
   */
  async updateTemplate(id, templateData) {
    return this.fetchApi(`${this.adminUrl}/templates/${id}`, 'PUT', templateData);
  }

  /**
   * Template löschen
   * @param {string} id - Template-ID
   * @returns {Promise} - Promise mit der Bestätigung
   */
  async deleteTemplate(id) {
    return this.fetchApi(`${this.adminUrl}/templates/${id}`, 'DELETE');
  }

  /**
   * Template-Statistiken abrufen
   * @returns {Promise} - Promise mit den Template-Statistiken
   */
  async getTemplateStats() {
    return this.fetchApi(`${this.adminUrl}/templates/stats`);
  }

  // ===== Design-API =====

  /**
   * Alle Designs abrufen
   * @returns {Promise} - Promise mit der Liste der Designs
   */
  async getDesigns() {
    return this.fetchApi(`${this.adminUrl}/designs`);
  }

  /**
   * Ein Design nach ID abrufen
   * @param {string} id - Design-ID
   * @returns {Promise} - Promise mit dem Design
   */
  async getDesignById(id) {
    return this.fetchApi(`${this.adminUrl}/designs/${id}`);
  }

  /**
   * Designs nach Layout-ID abrufen
   * @param {string} layoutId - Layout-ID
   * @returns {Promise} - Promise mit der Liste der Designs
   */
  async getDesignsByLayout(layoutId) {
    return this.fetchApi(`${this.adminUrl}/designs/by-layout/${layoutId}`);
  }

  /**
   * Designs nach Layout-Kategorie abrufen
   * @param {string} category - Layout-Kategorie
   * @returns {Promise} - Promise mit der Liste der Designs
   */
  async getDesignsByCategory(category) {
    return this.fetchApi(`${this.adminUrl}/designs/by-category/${category}`);
  }

  /**
   * Neues Design erstellen
   * @param {object} designData - Design-Daten
   * @returns {Promise} - Promise mit dem erstellten Design
   */
  async createDesign(designData) {
    return this.fetchApi(`${this.adminUrl}/designs`, 'POST', designData);
  }

  /**
   * Design aktualisieren
   * @param {string} id - Design-ID
   * @param {object} designData - Design-Daten
   * @returns {Promise} - Promise mit dem aktualisierten Design
   */
  async updateDesign(id, designData) {
    return this.fetchApi(`${this.adminUrl}/designs/${id}`, 'PUT', designData);
  }

  /**
   * Design löschen
   * @param {string} id - Design-ID
   * @returns {Promise} - Promise mit der Bestätigung
   */
  async deleteDesign(id) {
    return this.fetchApi(`${this.adminUrl}/designs/${id}`, 'DELETE');
  }

  /**
   * Design-Statistiken abrufen
   * @returns {Promise} - Promise mit den Design-Statistiken
   */
  async getDesignStats() {
    return this.fetchApi(`${this.adminUrl}/designs/stats`);
  }

  // ===== Farbschema-API =====

  /**
   * Alle Farbschemata abrufen
   * @returns {Promise} - Promise mit der Liste der Farbschemata
   */
  async getColorSchemes() {
    return this.fetchApi(`${this.adminUrl}/color-schemes`);
  }

  /**
   * Ein Farbschema nach ID abrufen
   * @param {string} id - Farbschema-ID
   * @returns {Promise} - Promise mit dem Farbschema
   */
  async getColorSchemeById(id) {
    return this.fetchApi(`${this.adminUrl}/color-schemes/${id}`);
  }

  /**
   * Neues Farbschema erstellen
   * @param {object} colorSchemeData - Farbschema-Daten
   * @returns {Promise} - Promise mit dem erstellten Farbschema
   */
  async createColorScheme(colorSchemeData) {
    return this.fetchApi(`${this.adminUrl}/color-schemes`, 'POST', colorSchemeData);
  }

  /**
   * Farbschema aktualisieren
   * @param {string} id - Farbschema-ID
   * @param {object} colorSchemeData - Farbschema-Daten
   * @returns {Promise} - Promise mit dem aktualisierten Farbschema
   */
  async updateColorScheme(id, colorSchemeData) {
    return this.fetchApi(`${this.adminUrl}/color-schemes/${id}`, 'PUT', colorSchemeData);
  }

  /**
   * Farbschema löschen
   * @param {string} id - Farbschema-ID
   * @returns {Promise} - Promise mit der Bestätigung
   */
  async deleteColorScheme(id) {
    return this.fetchApi(`${this.adminUrl}/color-schemes/${id}`, 'DELETE');
  }

  /**
   * Farbschema-Statistiken abrufen
   * @returns {Promise} - Promise mit den Farbschema-Statistiken
   */
  async getColorSchemeStats() {
    return this.fetchApi(`${this.adminUrl}/color-schemes/stats`);
  }

  // ===== Dashboard-API =====

  /**
   * Dashboard-Statistiken abrufen
   * @returns {Promise} - Promise mit den Dashboard-Statistiken
   */
  async getDashboardStats() {
    return this.fetchApi(`${this.adminUrl}/dashboard`);
  }
}

// Singleton-Instanz exportieren
const apiService = new ApiService();
