# 247Vitrine - Website-Builder für Handwerker

## Übersicht

247Vitrine ist eine moderne Plattform, die es Handwerkern ermöglicht, professionelle Websites schnell und einfach zu erstellen. Die Plattform bietet eine formularbasierte Erstellung mit verschiedenen Templates und Designs.

## Features

- 🎨 Formularbasierte Website-Erstellung
- 🎯 SEO-Optimierung
- 📱 Mobile-First Design
- 🔒 SSL-Verschlüsselung
- 📊 Analytics & Reporting
- 🔄 Automatische Backups
- 🚀 Performance-Optimierung
- 📦 Modularer Aufbau

## Technologie-Stack

### Frontend
- React.js
- React Router
- Styled Components
- PWA Support
- Service Worker

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Winston Logger

### Infrastruktur
- Docker
- Nginx
- Let's Encrypt
- GitHub Actions

## Installation

### Voraussetzungen
- Node.js >= 18
- Docker & Docker Compose
- MongoDB >= 6.0

### Entwicklung

1. Repository klonen:
```bash
git clone https://github.com/ihr-username/247vitrine.git
cd 247vitrine
```

2. Dependencies installieren:
```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Umgebungsvariablen setzen:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/vitrine
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Entwicklungsserver starten:
```bash
# Frontend (Terminal 1)
cd frontend
npm start

# Backend (Terminal 2)
cd backend
npm run dev
```

### Produktion

1. Docker Images bauen:
```bash
docker-compose build
```

2. Container starten:
```bash
docker-compose up -d
```

## Deployment

### Staging
```bash
git checkout develop
git push origin develop
```

### Produktion
```bash
git checkout main
git merge develop
git push origin main
```

## Monitoring & Logging

### Logs abrufen
```bash
# Backend Logs
docker-compose logs -f backend

# Frontend Logs
docker-compose logs -f frontend

# Nginx Logs
docker-compose logs -f nginx
```

### Metriken
- Performance-Metriken: `/api/metrics`
- Status: `/api/health`
- Analytics Dashboard: `/admin/analytics`

## Backup & Recovery

### Manuelles Backup erstellen
```bash
docker-compose exec backend npm run backup
```

### Backup wiederherstellen
```bash
docker-compose exec backend npm run restore <backup-file>
```

## CI/CD Pipeline

Die Pipeline durchläuft folgende Schritte:
1. Tests
2. Build
3. Deployment (Staging/Production)
4. Benachrichtigung

## Dokumentation

Weitere Dokumentation finden Sie in den folgenden Verzeichnissen:
- `/docs/api` - API-Dokumentation
- `/docs/deployment` - Deployment-Anleitungen
- `/docs/development` - Entwickler-Dokumentation

## Beitragen

1. Fork erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## Support

Bei Fragen oder Problemen:
- Issue erstellen
- E-Mail: support@247vitrine.com
- Dokumentation konsultieren

## Team

- Entwicklung: [Ihr Name]
- Design: [Designer Name]
- DevOps: [DevOps Name]

## Roadmap

- [ ] Multi-Language Support
- [ ] E-Commerce Integration
- [ ] Erweiterte Analytics
- [ ] AI-basierte Template-Vorschläge
- [ ] Verbesserte Performance-Optimierung
