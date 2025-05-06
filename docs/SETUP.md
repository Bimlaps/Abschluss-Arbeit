# 247Vitrine - Einrichtungsanleitung

Diese Anleitung führt dich durch die Einrichtung des 247Vitrine-Projekts für die Entwicklung.

## Voraussetzungen

- Node.js (v16+)
- Yarn
- Docker und Docker Compose
- MongoDB (wird über Docker bereitgestellt)

## Installation

1. **Repository klonen**

```bash
git clone <repository-url>
cd 247vitrine
```

2. **Abhängigkeiten installieren**

```bash
yarn install
```

3. **Umgebungsvariablen konfigurieren**

Kopiere die Beispiel-Umgebungsdateien und passe sie an:

```bash
cp services/auth-service/.env.example services/auth-service/.env
cp services/builder-service/.env.example services/builder-service/.env
```

4. **Gemeinsame Pakete bauen**

```bash
yarn workspace @247vitrine/config build
yarn workspace @247vitrine/types build
```

## Entwicklung

### Mit Docker

Der einfachste Weg, die gesamte Anwendung zu starten, ist mit Docker Compose:

```bash
docker-compose up
```

Dies startet alle Dienste:
- MongoDB auf Port 27017
- Auth-Service auf Port 3001
- Builder-Service auf Port 3002
- Customer Portal auf Port 3000

### Ohne Docker

Alternativ kannst du die Dienste auch einzeln starten:

1. **MongoDB starten**

Stelle sicher, dass MongoDB lokal läuft oder starte es mit Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. **Auth-Service starten**

```bash
cd services/auth-service
yarn dev
```

3. **Builder-Service starten**

```bash
cd services/builder-service
yarn dev
```

4. **Customer Portal starten**

```bash
cd apps/customer-portal
yarn dev
```

## Erste Schritte

1. Öffne http://localhost:3000 in deinem Browser, um das Customer Portal zu sehen.
2. Registriere einen neuen Benutzer über die Registrierungsseite.
3. Melde dich an und erstelle deine erste Website im Dashboard.

## API-Endpunkte

### Auth-Service (http://localhost:3001)

- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/profile` - Benutzerprofil abrufen (erfordert Authentifizierung)

### Builder-Service (http://localhost:3002)

- `GET /api/templates` - Alle Templates abrufen
- `GET /api/templates/:id` - Einzelnes Template abrufen
- `POST /api/websites` - Neue Website erstellen (erfordert Authentifizierung)
- `GET /api/websites` - Alle Websites des Benutzers abrufen (erfordert Authentifizierung)
- `GET /api/websites/:id` - Einzelne Website abrufen (erfordert Authentifizierung)
- `PUT /api/websites/:id` - Website aktualisieren (erfordert Authentifizierung)
- `DELETE /api/websites/:id` - Website löschen (erfordert Authentifizierung)

## Fehlerbehebung

### Verbindungsprobleme mit MongoDB

Wenn du Probleme mit der Verbindung zu MongoDB hast, überprüfe:

1. Ob MongoDB läuft: `docker ps | grep mongodb`
2. Die MongoDB-URI in den .env-Dateien

### API-Verbindungsprobleme

Wenn das Frontend keine Verbindung zu den APIs herstellen kann:

1. Überprüfe, ob die API-Dienste laufen
2. Überprüfe die CORS-Einstellungen in den .env-Dateien
3. Überprüfe die API-URLs im Frontend
