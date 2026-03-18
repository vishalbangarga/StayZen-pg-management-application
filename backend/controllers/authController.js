const { auth, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, name, phone, role, uid } = req.body;

    let targetUid = uid;

    if (!targetUid) {
      // Create user in Firebase Auth using Admin SDK
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
      targetUid = userRecord.uid;
    }

    // Save additional user info in Firestore
    await db.collection('users').doc(targetUid).set({
      name,
      email,
      phone,
      role: role || 'tenant',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      uid: targetUid 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  // Note: Client-side Firebase SDK is typically used for login to get the ID token
  // For backend-only login (if needed), we might need a different approach or verify the token sent from client
  try {
    const { idToken } = req.body;
    
    // Verify the ID token from client
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user details from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userData = userDoc.data();
    
    // Generate a session token if desired, or just return user data
    // In this case, we'll return user data and the verified uid
    res.json({ 
      uid, 
      ...userData 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };
