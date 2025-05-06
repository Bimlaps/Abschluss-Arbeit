# 247Vitrine - Architektur

Dieses Dokument beschreibt die Architektur des 247Vitrine-Projekts, einer SaaS-Plattform für Handwerker-Webseiten.

## Überblick

247Vitrine ist als modulare Microservices-Architektur aufgebaut, die Skalierbarkeit und Wartbarkeit gewährleistet. Die Anwendung besteht aus mehreren unabhängigen Diensten, die über APIs miteinander kommunizieren.

## Architekturdiagramm

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| Customer Portal  |     | Admin Dashboard  |     | Website Preview  |
| (React/Vite)     |     | (React/Vite)     |     | (React/Vite)     |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   API Gateway    |     |                  |     |                  |
|   (Express)      |---->|                  |     |                  |
|                  |     |                  |     |                  |
+--------+---------+     |                  |     |                  |
         |               |                  |     |                  |
         v               |    MongoDB       |     |                  |
+--------+---------+     |    Database      |     |                  |
|                  |     |                  |     |                  |
| Auth Service     |---->|                  |     |                  |
| (Express/Node)   |     |                  |     |                  |
|                  |     |                  |     |                  |
+--------+---------+     +------------------+     |                  |
         |                        ^               |                  |
         v                        |               |                  |
+--------+---------+              |               |                  |
|                  |              |               |                  |
| Builder Service  |--------------+               |                  |
| (Express/Node)   |                              |                  |
|                  |                              |                  |
+--------+---------+                              |                  |
         |                                        |                  |
         v                                        |                  |
+--------+---------+                              |                  |
|                  |                              |                  |
| Generator Service|------------------------------+                  |
| (Express/Node)   |                                                 |
|                  |                                                 |
+------------------+                                                 |
                                                                     |
+------------------+                                                 |
|                  |                                                 |
| Static Hosting   |<------------------------------------------------+
| (S3/CloudFront)  |
|                  |
+------------------+
```

## Komponenten

### Frontend-Anwendungen

1. **Customer Portal** (apps/customer-portal)
   - Benutzeroberfläche für Kunden
   - Implementiert mit React, Vite und Tailwind CSS
   - Funktionen: Registrierung, Login, Website-Builder, Dashboard

2. **Admin Dashboard** (apps/admin-dashboard) - zukünftig
   - Verwaltungsoberfläche für Administratoren
   - Implementiert mit React, Vite und Tailwind CSS
   - Funktionen: Benutzerverwaltung, Template-Verwaltung, Statistiken

3. **Website Preview** (apps/website-preview) - zukünftig
   - Live-Vorschau für erstellte Websites
   - Implementiert mit React
   - Funktionen: Echtzeit-Vorschau der Website während der Bearbeitung

### Backend-Dienste

1. **Auth Service** (services/auth-service)
   - Verantwortlich für Authentifizierung und Benutzerverwaltung
   - Implementiert mit Express.js und MongoDB
   - Funktionen: Registrierung, Login, JWT-Authentifizierung

2. **Builder Service** (services/builder-service)
   - Verantwortlich für Website-Erstellung und -Verwaltung
   - Implementiert mit Express.js und MongoDB
   - Funktionen: Website-CRUD, Template-Verwaltung

3. **Generator Service** (services/generator-service) - zukünftig
   - Verantwortlich für die Generierung statischer Websites
   - Implementiert mit Express.js
   - Funktionen: HTML/CSS-Generierung, Deployment auf S3/CloudFront

### Gemeinsame Pakete

1. **Config** (packages/config)
   - Gemeinsame Konfigurationen für alle Dienste
   - Umgebungsvariablen, Konstanten, etc.

2. **Types** (packages/types)
   - TypeScript-Typdefinitionen für alle Dienste
   - Gemeinsame Interfaces und Enums

3. **UI Components** (packages/ui-components) - zukünftig
   - Wiederverwendbare UI-Komponenten für Frontend-Anwendungen
   - Implementiert mit React und Tailwind CSS

4. **Utils** (packages/utils) - zukünftig
   - Gemeinsame Hilfsfunktionen für alle Dienste

## Datenmodell

### User
- id: string
- email: string
- password: string (hashed)
- name: string
- role: UserRole (ADMIN, CUSTOMER)
- subscriptionStatus: SubscriptionStatus (ACTIVE, INACTIVE, TRIAL, CANCELLED)
- subscriptionPlan: string
- createdAt: Date
- updatedAt: Date

### Website
- id: string
- userId: string (Relation zu User)
- subdomain: string
- customDomain: string (optional)
- templateId: string (Relation zu Template)
- colorSchemeId: string
- content: Record<string, any> (JSON)
- status: WebsiteStatus (DRAFT, PUBLISHED, ARCHIVED)
- createdAt: Date
- updatedAt: Date

### Template
- id: string
- name: string
- description: string
- thumbnail: string
- htmlStructure: string
- cssStructure: string
- availableSections: string[]
- createdAt: Date

## Kommunikation zwischen Diensten

Die Dienste kommunizieren über RESTful APIs miteinander. Die Authentifizierung erfolgt über JWT-Tokens, die vom Auth-Service ausgestellt werden.

## Deployment-Strategie

Das Projekt ist für Deployment in einer containerisierten Umgebung (Docker) konzipiert:

1. **Entwicklung**: Docker Compose für lokale Entwicklung
2. **Staging/Produktion**: Kubernetes oder AWS ECS für Orchestrierung
3. **Statisches Hosting**: AWS S3 + CloudFront für generierte Websites

## Skalierungsstrategie

Die modulare Architektur ermöglicht horizontale Skalierung:

1. **Stateless Services**: Alle Backend-Dienste sind zustandslos und können horizontal skaliert werden
2. **Datenbank-Skalierung**: MongoDB kann als Replica Set oder Sharded Cluster betrieben werden
3. **Caching**: Redis kann für Caching und Session-Management eingesetzt werden
