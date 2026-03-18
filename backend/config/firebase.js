const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// In a real application, you would use a service account key JSON file
// For this implementation, we'll initialize with environment variables or placeholder
try {
  const path = require('path');
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
const auth = admin.auth();

module.exports = { admin, db, auth };
