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

```
/247vitrine
├── packages/                  # Gemeinsam genutzte Pakete
│   ├── config/                # Gemeinsame Konfigurationen
│   ├── ui-components/         # Wiederverwendbare UI-Komponenten
│   ├── utils/                 # Gemeinsame Hilfsfunktionen
│   └── types/                 # TypeScript-Typdefinitionen
│
├── services/                  # Microservices
│   ├── auth-service/          # Authentifizierung & Nutzerverwaltung
│   ├── builder-service/       # Website-Builder-Logik
│   ├── template-service/      # Template-Verwaltung
│   ├── domain-service/        # Domain-Verwaltung
│   ├── gallery-service/       # Bildergalerie-Funktionalität
│   ├── analytics-service/     # Nutzungsanalyse (später)
│   ├── payment-service/       # Zahlungsabwicklung
│   └── generator-service/     # Statische Site-Generierung
│
├── apps/
│   ├── customer-portal/       # Kundenportal (React)
│   ├── admin-dashboard/       # Admin-Dashboard (React)
│   ├── website-preview/       # Live-Vorschau-Komponente
│   └── api-gateway/           # API-Gateway für alle Services
│
├── infrastructure/            # Infrastruktur-Code
│   ├── terraform/             # IaC für Cloud-Ressourcen
│   ├── docker/                # Docker-Konfigurationen
│   └── ci-cd/                 # CI/CD-Pipelines
│
└── docs/                      # Projektdokumentation
```

## Entwicklung

### Voraussetzungen

- Node.js (v16+)
- Yarn
- MongoDB

### Installation

```bash
# Abhängigkeiten installieren
yarn install

# Entwicklungsserver starten
yarn dev
```

## Lizenz

Proprietär - Alle Rechte vorbehalten
