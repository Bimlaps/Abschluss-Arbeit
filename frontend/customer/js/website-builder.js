/**
 * Website-Builder JavaScript
 * Implementiert die Logik für das mehrstufige Formular zur Website-Erstellung
 */

// Globale Variablen für die Website-Konfiguration
const websiteConfig = {
  layout: '',
  template: '',
  colorScheme: '',
  design: '',
  content: {
    websiteName: '',
    companyName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  }
};

// DOM-Elemente
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressPercentage = document.getElementById('progressPercentage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const previewBtn = document.getElementById('previewBtn');
const previewModal = document.getElementById('previewModal');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const mobileViewBtn = document.getElementById('mobileViewBtn');
const desktopViewBtn = document.getElementById('desktopViewBtn');
const previewContainer = document.getElementById('previewContainer');
const previewContent = document.getElementById('previewContent');

// Aktuelle Schritt-Nummer
let currentStep = 1;
const totalSteps = steps.length;

// Event-Listener
document.addEventListener('DOMContentLoaded', () => {
  // Benutzer-Informationen laden
  loadUserInfo();

  // Layout-Buttons
  document.querySelectorAll('.select-layout-btn').forEach(button => {
    button.addEventListener('click', () => selectLayout(button.dataset.layout));
  });

  // Navigation-Buttons
  prevBtn.addEventListener('click', goToPreviousStep);
  nextBtn.addEventListener('click', goToNextStep);
  finishBtn.addEventListener('click', finishWebsiteCreation);

  // Vorschau-Funktionen
  previewBtn.addEventListener('click', openPreview);
  closePreviewBtn.addEventListener('click', closePreview);
  mobileViewBtn.addEventListener('click', () => switchPreviewMode('mobile'));
  desktopViewBtn.addEventListener('click', () => switchPreviewMode('desktop'));

  // Logout-Button
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Mock-Daten laden
  loadMockData();
});

/**
 * Benutzer-Informationen aus dem localStorage laden
 */
function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.firstName) {
    document.getElementById('userName').textContent = user.firstName;
  }
}

/**
 * Layout auswählen
 * @param {string} layout - Das ausgewählte Layout
 */
function selectLayout(layout) {
  websiteConfig.layout = layout;
  goToNextStep();
}

/**
 * Zum nächsten Schritt gehen
 */
function goToNextStep() {
  // Aktuelle Schritt-Daten speichern
  saveCurrentStepData();

  // Zum nächsten Schritt wechseln
  if (currentStep < totalSteps) {
    steps[currentStep - 1].classList.add('step-inactive');
    currentStep++;
    steps[currentStep - 1].classList.remove('step-inactive');
    updateProgress();

    // Zurück-Button anzeigen
    prevBtn.classList.remove('hidden');

    // Fertig-Button anzeigen, wenn letzter Schritt erreicht ist
    if (currentStep === totalSteps) {
      nextBtn.classList.add('hidden');
      finishBtn.classList.remove('hidden');
    }
  }
}

/**
 * Zum vorherigen Schritt gehen
 */
function goToPreviousStep() {
  if (currentStep > 1) {
    steps[currentStep - 1].classList.add('step-inactive');
    currentStep--;
    steps[currentStep - 1].classList.remove('step-inactive');
    updateProgress();

    // Zurück-Button ausblenden, wenn erster Schritt erreicht ist
    if (currentStep === 1) {
      prevBtn.classList.add('hidden');
    }

    // Weiter-Button anzeigen und Fertig-Button ausblenden
    nextBtn.classList.remove('hidden');
    finishBtn.classList.add('hidden');
  }
}

/**
 * Fortschrittsanzeige aktualisieren
 */
function updateProgress() {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `Schritt ${currentStep} von ${totalSteps}`;
  progressPercentage.textContent = `${percentage}%`;
}

/**
 * Aktuelle Schritt-Daten speichern
 */
function saveCurrentStepData() {
  switch (currentStep) {
    case 1:
      // Layout wird bereits beim Klick auf den Button gespeichert
      break;
    case 2:
      // Template speichern
      const selectedTemplate = document.querySelector('.template-selected');
      if (selectedTemplate) {
        websiteConfig.template = selectedTemplate.dataset.templateId;
      }
      break;
    case 3:
      // Farbschema speichern
      const selectedColorScheme = document.querySelector('.color-scheme-selected');
      if (selectedColorScheme) {
        websiteConfig.colorScheme = selectedColorScheme.dataset.colorSchemeId;
      }
      break;
    case 4:
      // Design speichern
      const selectedDesign = document.querySelector('.design-selected');
      if (selectedDesign) {
        websiteConfig.design = selectedDesign.dataset.designId;
      }
      break;
    case 5:
      // Inhalte speichern
      websiteConfig.content.websiteName = document.getElementById('websiteName').value;
      websiteConfig.content.companyName = document.getElementById('companyName').value;
      websiteConfig.content.description = document.getElementById('description').value;
      websiteConfig.content.contactEmail = document.getElementById('contactEmail').value;
      websiteConfig.content.contactPhone = document.getElementById('contactPhone').value;
      websiteConfig.content.address = document.getElementById('address').value;
      break;
  }
}

/**
 * Website-Erstellung abschließen
 */
function finishWebsiteCreation() {
  // Aktuelle Schritt-Daten speichern
  saveCurrentStepData();

  // In einer echten Anwendung würden wir hier die Daten an den Server senden
  console.log('Website-Konfiguration:', websiteConfig);

  // Erfolgsmeldung anzeigen
  alert('Ihre Website wurde erfolgreich erstellt!');

  // Zur Vorschau weiterleiten
  window.location.href = 'website-preview.html';
}

/**
 * Vorschau öffnen
 */
function openPreview() {
  // Aktuelle Schritt-Daten speichern
  saveCurrentStepData();

  // Vorschau-Inhalt generieren
  generatePreview();

  // Modal öffnen
  previewModal.classList.remove('hidden');
}

/**
 * Vorschau schließen
 */
function closePreview() {
  previewModal.classList.add('hidden');
}

/**
 * Vorschau-Modus wechseln (mobil/desktop)
 * @param {string} mode - Der Vorschau-Modus ('mobile' oder 'desktop')
 */
function switchPreviewMode(mode) {
  if (mode === 'mobile') {
    previewContainer.className = 'preview-mobile';
    mobileViewBtn.classList.add('text-primary-600');
    mobileViewBtn.classList.remove('text-gray-400');
    desktopViewBtn.classList.add('text-gray-400');
    desktopViewBtn.classList.remove('text-primary-600');
  } else {
    previewContainer.className = 'preview-desktop';
    desktopViewBtn.classList.add('text-primary-600');
    desktopViewBtn.classList.remove('text-gray-400');
    mobileViewBtn.classList.add('text-gray-400');
    mobileViewBtn.classList.remove('text-primary-600');
  }
}

/**
 * Vorschau generieren
 */
function generatePreview() {
  // In einer echten Anwendung würden wir hier die Vorschau basierend auf der Konfiguration generieren
  let previewHtml = '';

  if (!websiteConfig.layout) {
    previewHtml = '<div class="text-center p-8"><p class="text-gray-500">Wählen Sie ein Layout, Template, Farbschema und Design, um eine Vorschau zu sehen.</p></div>';
  } else {
    // Einfache Vorschau basierend auf der aktuellen Konfiguration
    const colorClass = websiteConfig.colorScheme === 'blue' ? 'bg-blue-600' :
                      websiteConfig.colorScheme === 'green' ? 'bg-green-600' :
                      websiteConfig.colorScheme === 'red' ? 'bg-red-600' : 'bg-primary-600';

    previewHtml = `
      <header class="${colorClass} text-white p-4">
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold">${websiteConfig.content.websiteName || 'Meine Website'}</h1>
          <nav class="mt-2">
            <ul class="flex space-x-4">
              <li><a href="#" class="hover:underline">Startseite</a></li>
              <li><a href="#" class="hover:underline">Über uns</a></li>
              <li><a href="#" class="hover:underline">Dienstleistungen</a></li>
              <li><a href="#" class="hover:underline">Kontakt</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section class="py-12 px-4 bg-gray-100">
          <div class="container mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4">${websiteConfig.content.companyName || 'Mein Unternehmen'}</h2>
            <p class="max-w-2xl mx-auto">${websiteConfig.content.description || 'Hier steht eine Beschreibung Ihres Unternehmens.'}</p>
          </div>
        </section>

        <section class="py-12 px-4">
          <div class="container mx-auto">
            <h2 class="text-2xl font-bold mb-6 text-center">Unsere Dienstleistungen</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-2">Dienstleistung 1</h3>
                <p>Beschreibung der Dienstleistung 1.</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-2">Dienstleistung 2</h3>
                <p>Beschreibung der Dienstleistung 2.</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-2">Dienstleistung 3</h3>
                <p>Beschreibung der Dienstleistung 3.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="py-12 px-4 bg-gray-100">
          <div class="container mx-auto">
            <h2 class="text-2xl font-bold mb-6 text-center">Kontakt</h2>
            <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
              <p class="mb-2"><strong>E-Mail:</strong> ${websiteConfig.content.contactEmail || 'info@example.com'}</p>
              <p class="mb-2"><strong>Telefon:</strong> ${websiteConfig.content.contactPhone || '+49 123 456789'}</p>
              <p><strong>Adresse:</strong> ${websiteConfig.content.address || 'Musterstraße 123, 12345 Musterstadt'}</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="${colorClass} text-white p-4 mt-12">
        <div class="container mx-auto text-center">
          <p>&copy; 2023 ${websiteConfig.content.companyName || 'Mein Unternehmen'}. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    `;
  }

  previewContent.innerHTML = previewHtml;
}

/**
 * Abmelden
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

/**
 * Mock-Daten laden
 */
function loadMockData() {
  // Templates laden
  loadMockTemplates();

  // Farbschemas laden
  loadMockColorSchemes();

  // Designs laden
  loadMockDesigns();
}

/**
 * Mock-Templates laden
 */
function loadMockTemplates() {
  const templates = [
    { id: '1', name: 'Handwerker Basic', description: 'Einfaches Template für Handwerker mit allen wichtigen Sektionen.', layout: 'one-page', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Basic+Template' },
    { id: '2', name: 'Handwerker Pro', description: 'Professionelles Template mit mehreren Seiten für umfangreiche Inhalte.', layout: 'multi-page', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Pro+Template' },
    { id: '3', name: 'Handwerker Premium', description: 'Premium-Template mit Sidebar-Navigation und erweiterten Funktionen.', layout: 'sidebar', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Premium+Template' }
  ];

  const templatesContainer = document.getElementById('templatesContainer');
  templatesContainer.innerHTML = '';

  templates.forEach(template => {
    const templateElement = document.createElement('div');
    templateElement.className = 'border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow';
    templateElement.dataset.templateId = template.id;

    templateElement.innerHTML = `
      <img src="${template.thumbnail}" alt="${template.name}" class="w-full h-40 object-cover rounded mb-4">
      <h4 class="font-medium text-gray-900">${template.name}</h4>
      <p class="text-sm text-gray-500">${template.description}</p>
      <div class="mt-4">
        <button class="select-template-btn w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700" data-template-id="${template.id}">Auswählen</button>
      </div>
    `;

    templatesContainer.appendChild(templateElement);

    // Event-Listener für Template-Auswahl
    templateElement.querySelector('.select-template-btn').addEventListener('click', () => {
      // Alle Templates deselektieren
      document.querySelectorAll('[data-template-id]').forEach(el => {
        el.classList.remove('ring-2', 'ring-primary-500', 'template-selected');
      });

      // Ausgewähltes Template markieren
      templateElement.classList.add('ring-2', 'ring-primary-500', 'template-selected');

      // Template in Konfiguration speichern
      websiteConfig.template = template.id;
    });
  });
}

/**
 * Mock-Farbschemas laden
 */
function loadMockColorSchemes() {
  const colorSchemes = [
    { id: 'blue', name: 'Blau', primary: '#0284c7', secondary: '#0ea5e9', text: '#1e293b', background: '#f8fafc' },
    { id: 'green', name: 'Grün', primary: '#16a34a', secondary: '#22c55e', text: '#1e293b', background: '#f8fafc' },
    { id: 'red', name: 'Rot', primary: '#dc2626', secondary: '#ef4444', text: '#1e293b', background: '#f8fafc' },
    { id: 'orange', name: 'Orange', primary: '#ea580c', secondary: '#f97316', text: '#1e293b', background: '#f8fafc' },
    { id: 'purple', name: 'Lila', primary: '#7c3aed', secondary: '#8b5cf6', text: '#1e293b', background: '#f8fafc' },
    { id: 'gray', name: 'Grau', primary: '#4b5563', secondary: '#6b7280', text: '#1e293b', background: '#f8fafc' },
    { id: 'dark', name: 'Dunkel', primary: '#1e293b', secondary: '#334155', text: '#f8fafc', background: '#0f172a' },
    { id: 'light', name: 'Hell', primary: '#e2e8f0', secondary: '#f1f5f9', text: '#1e293b', background: '#ffffff' }
  ];

  const colorSchemesContainer = document.getElementById('colorSchemesContainer');
  colorSchemesContainer.innerHTML = '';

  colorSchemes.forEach(colorScheme => {
    const colorSchemeElement = document.createElement('div');
    colorSchemeElement.className = 'border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow';
    colorSchemeElement.dataset.colorSchemeId = colorScheme.id;

    colorSchemeElement.innerHTML = `
      <div class="h-20 rounded-md mb-4 overflow-hidden">
        <div class="h-1/2" style="background-color: ${colorScheme.primary}"></div>
        <div class="h-1/2" style="background-color: ${colorScheme.secondary}"></div>
      </div>
      <h4 class="font-medium text-gray-900 text-center">${colorScheme.name}</h4>
      <div class="mt-4">
        <button class="select-color-scheme-btn w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700" data-color-scheme-id="${colorScheme.id}">Auswählen</button>
      </div>
    `;

    colorSchemesContainer.appendChild(colorSchemeElement);

    // Event-Listener für Farbschema-Auswahl
    colorSchemeElement.querySelector('.select-color-scheme-btn').addEventListener('click', () => {
      // Alle Farbschemas deselektieren
      document.querySelectorAll('[data-color-scheme-id]').forEach(el => {
        el.classList.remove('ring-2', 'ring-primary-500', 'color-scheme-selected');
      });

      // Ausgewähltes Farbschema markieren
      colorSchemeElement.classList.add('ring-2', 'ring-primary-500', 'color-scheme-selected');

      // Farbschema in Konfiguration speichern
      websiteConfig.colorScheme = colorScheme.id;
    });
  });
}

/**
 * Mock-Designs laden
 */
function loadMockDesigns() {
  const designs = [
    { id: '1', name: 'Modern', description: 'Klares, modernes Design mit viel Weißraum.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Modern+Design' },
    { id: '2', name: 'Klassisch', description: 'Zeitloses Design mit traditionellen Elementen.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Klassisch+Design' },
    { id: '3', name: 'Minimalistisch', description: 'Reduziertes Design mit Fokus auf das Wesentliche.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Minimalistisch+Design' },
    { id: '4', name: 'Bold', description: 'Auffälliges Design mit starken Kontrasten.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Bold+Design' },
    { id: '5', name: 'Elegant', description: 'Stilvolles Design mit feinen Details.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Elegant+Design' },
    { id: '6', name: 'Rustikal', description: 'Warmes Design mit natürlichen Elementen.', thumbnail: 'https://via.placeholder.com/300x200/0284c7/FFFFFF?text=Rustikal+Design' }
  ];

  const designsContainer = document.getElementById('designsContainer');
  designsContainer.innerHTML = '';

  designs.forEach(design => {
    const designElement = document.createElement('div');
    designElement.className = 'border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow';
    designElement.dataset.designId = design.id;

    designElement.innerHTML = `
      <img src="${design.thumbnail}" alt="${design.name}" class="w-full h-40 object-cover rounded mb-4">
      <h4 class="font-medium text-gray-900">${design.name}</h4>
      <p class="text-sm text-gray-500">${design.description}</p>
      <div class="mt-4">
        <button class="select-design-btn w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700" data-design-id="${design.id}">Auswählen</button>
      </div>
    `;

    designsContainer.appendChild(designElement);

    // Event-Listener für Design-Auswahl
    designElement.querySelector('.select-design-btn').addEventListener('click', () => {
      // Alle Designs deselektieren
      document.querySelectorAll('[data-design-id]').forEach(el => {
        el.classList.remove('ring-2', 'ring-primary-500', 'design-selected');
      });

      // Ausgewähltes Design markieren
      designElement.classList.add('ring-2', 'ring-primary-500', 'design-selected');

      // Design in Konfiguration speichern
      websiteConfig.design = design.id;
    });
  });
}
