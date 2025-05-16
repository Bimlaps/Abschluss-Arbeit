const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Umgebungsvariablen laden
dotenv.config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected successfully');
  
  try {
    // Prüfen, ob Testbenutzer bereits existiert
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
    } else {
      // Testbenutzer erstellen
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
        company: {
          name: 'Test Company',
          address: 'Test Address',
          phone: '123456789',
          industry: 'Test Industry'
        }
      });
      
      await user.save();
      console.log('Test user created successfully');
    }
    
    // Verbindung schließen
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test user:', error);
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
