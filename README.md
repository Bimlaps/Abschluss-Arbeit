# 247Vitrine – SaaS-Plattform für Handwerker-Webseiten

*Eine Self-Service-Plattform für Handwerker, um mit wenigen Klicks ihre eigene Site-Vitrine zu erstellen, sichtbar zu werden und digitale Präsenz aufzubauen.*

## Features

- *No-Code Website-Builder* auf Formularbasis
- *Live-Vorschau* von Layout, Farbschema, Template
- *Subdomain* automatisch erstellt (nutzer.247vitrine.ma)
- *Eigene Domain* optional integrierbar
- *Digitale Visitenkarte + QR-Code* für Social Media
- *Admin Dashboard* für Nutzerverwaltung, Site-Status und Analyse
- *Bildergalerie für Projekte* – Hochladen und Präsentieren von Bildern
- *Einfache Formular-basierte Bearbeitung* der Webseite durch den Kunden
- *Verschiedene Design-Templates & Farbschemata* zur Auswahl
- *Monatliches Abo + einmalige Setupgebühr* (ohne Provision)

## Projektstruktur

Die Projektstruktur wurde bereinigt und vereinfacht:

```
247vitrine/
├── backend/
│   ├── config/         # Konfigurationsdateien
│   ├── controllers/    # Controller für die API-Endpunkte
│   ├── middleware/     # Middleware-Funktionen
│   ├── models/         # Mongoose-Modelle
│   ├── public/         # Statische Dateien
│   ├── routes/         # API-Routen
│   ├── utils/          # Hilfsfunktionen
│   ├── .env            # Umgebungsvariablen
│   ├── index.js        # Hauptanwendungsdatei
│   └── package.json    # Backend-Abhängigkeiten
├── frontend/
│   ├── admin-dashboard/ # Admin-Dashboard
│   ├── public/          # Statische Dateien
│   ├── src/             # Quellcode
│   ├── dashboard.html   # Dashboard-Seite
│   ├── login.html       # Login-Seite
│   ├── preview.html     # Vorschau-Seite
│   ├── register.html    # Registrierungsseite
│   └── website-builder.html # Website-Builder-Seite
└── docs/               # Dokumentation
```

## Entwicklung

### Voraussetzungen

- Node.js (v20+)
- npm
- MongoDB

### Installation

#### Backend

```bash
cd 247vitrine/backend
npm install
```

#### Frontend

```bash
cd 247vitrine/frontend
npm install
```

### Starten der Anwendung

#### Backend

```bash
cd 247vitrine/backend
npm start
```

#### Frontend

```bash
cd 247vitrine/frontend
npm start
```

## Funktionen

- **Benutzerauthentifizierung**: Registrierung, Login und Benutzerverwaltung
- **Website-Builder**: Erstellung und Bearbeitung von Websites
- **QR-Code-Generierung**: Generierung von QR-Codes für digitale Visitenkarten
- **Blog-System**: Erstellung und Verwaltung von Blog-Beiträgen

## QR-Code-Funktionalität

Die QR-Code-Funktionalität umfasst:

1. **Generierung**: Automatische Generierung von QR-Codes für digitale Visitenkarten
2. **Neugenerierung**: Mehrstufiger Bestätigungsprozess für die Neugenerierung von QR-Codes
3. **Download**: Möglichkeit zum Herunterladen des QR-Codes für Marketingmaterialien
4. **Dokumentation**: Speicherung alter QR-Codes für zukünftige Referenz

## Lizenz

Proprietär - Alle Rechte vorbehalten
