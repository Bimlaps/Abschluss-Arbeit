# 247Vitrine

Eine SaaS-Plattform für Handwerker mit React/Tailwind Frontend, Node.js/Express Backend und MongoDB.

## Über das Projekt

247Vitrine ist eine Self-Service-Plattform für Handwerker, um mit wenigen Klicks ihre eigene Website zu erstellen, sichtbar zu werden und digitale Präsenz aufzubauen. Der Name '247Vitrine' wurde gewählt, weil '247' für 'jederzeit' steht und 'Vitrine' das Fenster symbolisiert, durch das Besucher das Unternehmen betrachten können.

Das Projekt ist primär für den marokkanischen Markt bestimmt, um dort die notwendige digitale Infrastruktur bereitzustellen.

## Projektstruktur

```
/
├── backend/                # Backend-Code
│   ├── config/             # Konfigurationsdateien
│   ├── controllers/        # Controller für die API-Endpunkte
│   ├── middleware/         # Middleware-Funktionen
│   ├── models/             # Mongoose-Modelle
│   ├── public/             # Statische Dateien
│   ├── routes/             # API-Routen
│   ├── utils/              # Hilfsfunktionen
│   ├── .env                # Umgebungsvariablen
│   ├── index.js            # Hauptanwendungsdatei
│   └── package.json        # Backend-Abhängigkeiten
├── frontend/               # Frontend-Code
│   ├── admin/              # Admin-Dashboard
│   ├── customer/           # Kundenportal
│   ├── public/             # Statische Dateien
│   ├── assets/             # Bilder, Fonts, etc.
│   └── package.json        # Frontend-Abhängigkeiten
├── docs/                   # Dokumentation
├── .gitignore              # Git-Ignore-Datei
└── README.md               # Projektdokumentation
```

## Features

- **No-Code Website-Builder** auf Formularbasis
- **Live-Vorschau** von Layout, Farbschema, Template
- **Subdomain** automatisch erstellt (nutzer.247vitrine.ma)
- **Eigene Domain** optional integrierbar
- **Digitale Visitenkarte + QR-Code** für Social Media
- **Admin Dashboard** für Nutzerverwaltung, Site-Status und Analyse
- **Bildergalerie für Projekte** – Hochladen und Präsentieren von Bildern
- **Einfache Formular-basierte Bearbeitung** der Webseite durch den Kunden
- **Verschiedene Design-Templates & Farbschemata** zur Auswahl
- **Monatliches Abo + einmalige Setupgebühr** (ohne Provision)

## Installation

### Voraussetzungen

- Node.js (v20+)
- npm
- MongoDB

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Starten der Anwendung

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm start
```

## QR-Code-Funktionalität

Die QR-Code-Funktionalität umfasst:

1. **Generierung**: Automatische Generierung von QR-Codes für digitale Visitenkarten
2. **Neugenerierung**: Mehrstufiger Bestätigungsprozess für die Neugenerierung von QR-Codes
3. **Download**: Möglichkeit zum Herunterladen des QR-Codes für Marketingmaterialien
4. **Dokumentation**: Speicherung alter QR-Codes für zukünftige Referenz

## Lizenz

Proprietär - Alle Rechte vorbehalten
