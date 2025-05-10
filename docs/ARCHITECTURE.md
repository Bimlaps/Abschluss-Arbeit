# 247Vitrine - Architektur

Dieses Dokument beschreibt die Architektur der 247Vitrine-Plattform.

## Überblick

Die 247Vitrine-Plattform besteht aus zwei Hauptkomponenten:

1. **Backend**: Eine Node.js/Express-Anwendung, die die API-Endpunkte bereitstellt und mit der MongoDB-Datenbank kommuniziert.
2. **Frontend**: Eine HTML/CSS/JavaScript-Anwendung mit Tailwind CSS für das Styling.

## Backend-Architektur

Das Backend folgt einer MVC-ähnlichen Architektur:

- **Models**: Mongoose-Modelle für die Datenbankinteraktion
- **Controllers**: Logik für die API-Endpunkte
- **Routes**: Definition der API-Routen
- **Middleware**: Funktionen für Authentifizierung, Fehlerbehandlung, etc.
- **Utils**: Hilfsfunktionen für verschiedene Aufgaben

### Datenmodelle

- **User**: Benutzerinformationen und Authentifizierung
- **Website**: Informationen über die erstellten Websites
- **Template**: Vorlagen für Websites
- **Layout**: Layouts für Websites
- **Design**: Designs für Websites
- **ColorScheme**: Farbschemata für Websites
- **BlogPost**: Blog-Beiträge für Websites

### API-Endpunkte

- **/api/auth**: Authentifizierung und Benutzerverwaltung
- **/api/websites**: Erstellung und Verwaltung von Websites
- **/api/templates**: Verwaltung von Templates
- **/api/uploads**: Hochladen von Dateien
- **/api/blog**: Verwaltung von Blog-Beiträgen

## Frontend-Architektur

Das Frontend besteht aus zwei Hauptteilen:

1. **Admin-Dashboard**: Verwaltung der Plattform durch Administratoren
2. **Kundenportal**: Erstellung und Verwaltung von Websites durch Kunden

### Admin-Dashboard

- Benutzerverwaltung
- Template-Verwaltung
- Website-Überwachung
- Statistiken und Analysen

### Kundenportal

- Website-Builder
- Website-Vorschau
- Digitale Visitenkarte
- Blog-Verwaltung

## Technologie-Stack

- **Backend**:
  - Node.js
  - Express
  - MongoDB (mit Mongoose)
  - JWT für Authentifizierung

- **Frontend**:
  - HTML/CSS/JavaScript
  - Tailwind CSS
  - Fetch API für HTTP-Anfragen

## Deployment

Die Anwendung wird auf Azure gehostet:

- Backend: Azure App Service
- Frontend: Azure Blob Storage mit CDN
- Datenbank: Azure Cosmos DB mit MongoDB-API
