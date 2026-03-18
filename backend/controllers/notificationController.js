const { db } = require('../config/firebase');

const sendNotification = async (userId, message, type) => {
  try {
    await db.collection('notifications').add({
      user_id: userId,
      message,
      type,
      read: false,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const getNotifications = async (req, res) => {
  const user_id = req.user.uid;
  try {
    const snapshot = await db.collection('notifications')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
    
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('notifications').doc(id).update({ read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

module.exports = { sendNotification, getNotifications, markAsRead };
