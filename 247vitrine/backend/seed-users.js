const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Umgebungsvariablen laden
dotenv.config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding users'))
.catch(err => console.error('MongoDB connection error:', err));

// Beispiel-Benutzer
const usersData = [
  {
    email: 'admin@247vitrine.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'customer@example.com',
    password: 'customer123',
    firstName: 'Max',
    lastName: 'Mustermann',
    role: 'customer',
    company: {
      name: 'Mustermann GmbH',
      address: 'Musterstraße 123, 12345 Musterstadt',
      phone: '+49 123 456789',
      industry: 'Sanitär'
    }
  }
];

// Datenbank mit Beispieldaten initialisieren
async function seedDatabase() {
  try {
    // Datenbank leeren
    await User.deleteMany({});
    
    // Benutzer erstellen
    for (const userData of usersData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      await User.create({
        ...userData,
        password: hashedPassword
      });
    }
    
    console.log('Users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
