const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

console.log('Testing Firebase Initialization...');

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  console.log('Path:', serviceAccountPath);
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('File does not exist!');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  console.log('JSON parsed successfully');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase initialized successfully!');
  
  const db = admin.firestore();
  console.log('Firestore instance obtained');
  
  process.exit(0);
} catch (error) {
  console.error('ERROR during testing:', error);
  process.exit(1);
}
