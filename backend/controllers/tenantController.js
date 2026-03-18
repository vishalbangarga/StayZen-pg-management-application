const { db } = require('../config/firebase');

const assignTenant = async (req, res) => {
  try {
    const { user_id, room_id, bed_id, joining_date, leaving_date, rent_amount } = req.body;

    // Check if bed is available
    const bedDoc = await db.collection('beds').doc(bed_id).get();
    if (!bedDoc.exists || bedDoc.data().status !== 'available') {
      return res.status(400).json({ error: 'Bed is not available' });
    }

    // Assign tenant to bed and update bed status
    const batch = db.batch();
    
    const tenantRef = db.collection('tenants').doc();
    batch.set(tenantRef, {
      user_id,
      room_id,
      bed_id,
      joining_date,
      leaving_date: leaving_date || null,
      rent_amount,
      createdAt: new Date().toISOString()
    });

    batch.update(db.collection('beds').doc(bed_id), {
      status: 'occupied',
      tenant_id: user_id
    });

    // Update user role to tenant if needed (optional enrichment)
    // batch.update(db.collection('users').doc(user_id), { role: 'tenant' });

    await batch.commit();

    res.status(201).json({ id: tenantRef.id, message: 'Tenant assigned to bed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTenantsByPG = async (req, res) => {
  try {
    const { pg_id } = req.params;
    // This requires a join-like query. In Firestore, we might need to query rooms first.
    const roomsSnapshot = await db.collection('rooms').where('pg_id', '==', pg_id).get();
    const roomIds = roomsSnapshot.docs.map(doc => doc.id);

    if (roomIds.length === 0) return res.json([]);

    const tenantsSnapshot = await db.collection('tenants').where('room_id', 'in', roomIds.limit(10)).get();
    const tenants = tenantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tenants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { assignTenant, getTenantsByPG };
