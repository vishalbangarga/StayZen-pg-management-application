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

    // If req.user exists and we want owner-only PGs (implied by the route or a flag)
    // Here I'll check if the owner is logged in and filter by their ID
    if (req.user && req.user.role === 'owner') {
      query = query.where('owner_id', '==', req.user.uid);
    }

    if (location) {
      query = query.where('location', '==', location);
    }

    const pgsSnapshot = await query.get();
    let pgs = [];
    
    for (const doc of pgsSnapshot.docs) {
      const pgData = doc.data();
      const roomsSnapshot = await db.collection('rooms').where('pg_id', '==', doc.id).get();
      const roomIds = roomsSnapshot.docs.map(room => room.id);
      
      let tenantCount = 0;
      if (roomIds.length > 0) {
        const tenantsSnapshot = await db.collection('tenants').where('room_id', 'in', roomIds.slice(0, 10)).get();
        tenantCount = tenantsSnapshot.size;
      }

      pgs.push({
        id: doc.id,
        ...pgData,
        room_count: roomsSnapshot.size,
        tenant_count: tenantCount
      });
    }

    // Client-side filtering...
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
