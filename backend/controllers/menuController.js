const { db } = require('../config/firebase');

const updateMenu = async (req, res) => {
  try {
    const { pg_id, date, breakfast, lunch, dinner } = req.body;

    // Verify owner
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    if (!pgDoc.exists || pgDoc.data().owner_id !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized to update menu for this PG' });
    }

    const menuRef = await db.collection('menus').add({
      pg_id,
      date: date || new Date().toISOString().split('T')[0],
      breakfast,
      lunch,
      dinner,
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({ id: menuRef.id, message: 'Food menu updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMenuByPG = async (req, res) => {
  try {
    const { pg_id } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const menuSnapshot = await db.collection('menus')
      .where('pg_id', '==', pg_id)
      .where('date', '==', date)
      .get();

    if (menuSnapshot.empty) {
      return res.status(404).json({ error: 'Menu not found for this date' });
    }

    const menu = menuSnapshot.docs[0].data();
    res.json({ id: menuSnapshot.docs[0].id, ...menu });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateMenu, getMenuByPG };
