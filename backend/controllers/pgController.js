const { db } = require('../config/firebase');

const createPG = async (req, res) => {
  try {
    const { pg_name, location, description, contact_number, facilities } = req.body;
    const owner_id = req.user.uid;

    const pgRef = await db.collection('pgs').add({
      owner_id,
      pg_name,
      location,
      description,
      contact_number,
      facilities,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: pgRef.id, message: 'PG created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPGs = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, sharingType } = req.query;
    let query = db.collection('pgs');

    if (location) {
      query = query.where('location', '==', location);
    }

    const pgsSnapshot = await query.get();
    let pgs = pgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Client-side filtering for price and sharing if needed, 
    // or handle more complex Firestore queries (requires indexes)
    if (minPrice) pgs = pgs.filter(pg => pg.price >= Number(minPrice));
    if (maxPrice) pgs = pgs.filter(pg => pg.price <= Number(maxPrice));
    if (sharingType) pgs = pgs.filter(pg => pg.sharing_types && pg.sharing_types.includes(Number(sharingType)));

    res.json(pgs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPGById = async (req, res) => {
  try {
    const pgDoc = await db.collection('pgs').doc(req.params.id).get();
    if (!pgDoc.exists) {
      return res.status(404).json({ error: 'PG not found' });
    }
    res.json({ id: pgDoc.id, ...pgDoc.data() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePG = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const pgDoc = await db.collection('pgs').doc(id).get();
    
    if (!pgDoc.exists || pgDoc.data().owner_id !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden: You do not own this PG' });
    }

    await db.collection('pgs').doc(id).update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'PG updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePG = async (req, res) => {
  try {
    const { id } = req.params;
    const pgDoc = await db.collection('pgs').doc(id).get();
    
    if (!pgDoc.exists || pgDoc.data().owner_id !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden: You do not own this PG' });
    }

    // Note: In a real app, delete associated rooms, beds, etc.
    await db.collection('pgs').doc(id).delete();
    res.json({ message: 'PG deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPG, getAllPGs, getPGById, updatePG, deletePG };
