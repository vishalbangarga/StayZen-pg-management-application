const { db } = require('../config/firebase');

const submitComplaint = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const tenant_id = req.user.uid;

    // 1. Find the tenant's pg_id and names
    const tenantSnapshot = await db.collection('tenants')
      .where('user_id', '==', tenant_id)
      .limit(1)
      .get();

    if (tenantSnapshot.empty) {
      return res.status(400).json({ error: 'Tenant record not found. Please contact the owner.' });
    }

    const tenantData = tenantSnapshot.docs[0].data();
    const room_id = tenantData.room_id;

    // Get tenant name from users collection
    const userDoc = await db.collection('users').doc(tenant_id).get();
    const tenant_name = userDoc.exists ? userDoc.data().name : 'Anonymous';

    // Then find the room to get the pg_id
    const roomDoc = await db.collection('rooms').doc(room_id).get();
    if (!roomDoc.exists) {
      return res.status(400).json({ error: 'Room record not found.' });
    }

    const pg_id = roomDoc.data().pg_id;

    // Get PG name
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    const pg_name = pgDoc.exists ? pgDoc.data().pg_name : 'Unknown PG';

    // 2. Add the complaint with denormalized names
    const complaintRef = await db.collection('complaints').add({
      tenant_id,
      tenant_name,
      pg_id,
      pg_name,
      title,
      description,
      type: type || 'General',
      status: 'pending',
      created_at: new Date().toISOString(),
      resolved_at: null
    });

    res.status(201).json({ id: complaintRef.id, message: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComplaintsByTenant = async (req, res) => {
  try {
    const tenant_id = req.params.tenant_id === 'me' ? req.user.uid : (req.params.tenant_id || req.user.uid);
    const complaintsSnapshot = await db.collection('complaints')
      .where('tenant_id', '==', tenant_id)
      .get();
    const complaints = complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const { status = 'resolved' } = req.body;
    const { complaint_id } = req.params;

    await db.collection('complaints').doc(complaint_id).update({
      status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null
    });

    res.json({ message: `Complaint marked as ${status}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComplaintsByPG = async (req, res) => {
  try {
    const { pg_id } = req.params;
    
    // Check if PG exists and user is owner
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    if (!pgDoc.exists || pgDoc.data().owner_id !== req.user.uid) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const complaintsSnapshot = await db.collection('complaints')
      .where('pg_id', '==', pg_id)
      .get();
    const complaints = complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllComplaintsForOwner = async (req, res) => {
  try {
    const owner_id = req.user.uid;
    // 1. Get all PG IDs owned by this user
    const pgsSnapshot = await db.collection('pgs').where('owner_id', '==', owner_id).get();
    const pgIds = pgsSnapshot.docs.map(doc => doc.id);

    if (pgIds.length === 0) return res.json([]);

    // 2. Get all complaints for these PGs
    const complaintsSnapshot = await db.collection('complaints')
      .where('pg_id', 'in', pgIds)
      .get();
    
    const complaints = complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { submitComplaint, getComplaintsByTenant, resolveComplaint, getComplaintsByPG, getAllComplaintsForOwner };
