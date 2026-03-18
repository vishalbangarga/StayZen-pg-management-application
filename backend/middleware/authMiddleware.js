const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Fetch user details from Firestore to get the role
    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Unauthorized: User does not exist in database' });
    }

    const userData = userDoc.data();
    req.user = { 
      uid: decodedToken.uid, 
      email: decodedToken.email,
      role: userData.role 
    };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Note: To use roles, we need to fetch user data from Firestore 
    // or add custom claims to the Firebase ID token.
    // For now, we'll assume the user object in request should be checked against role in DB.
    // However, fetching from DB in every request is costly.
    // Practical approach: Check role from request user (which should be populated by a previous middleware)
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
