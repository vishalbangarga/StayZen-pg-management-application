const { db } = require('../config/firebase');

const logActivity = async (userId, action, details = {}) => {
  try {
    await db.collection('activity_logs').add({
      user_id: userId,
      action: action,
      details: details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const activityLogger = (action) => {
  return async (req, res, next) => {
    // This is a post-response logger or a hook
    // We can use it as a middleware if we want to log the attempt
    // But usually we log after success.
    // Let's make it a utility instead of a middleware for more flexibility.
    next();
  };
};

module.exports = { logActivity, activityLogger };
