const { db } = require('../config/firebase');

const submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const tenant_id = req.user.uid;

    const complaintRef = await db.collection('complaints').add({
      tenant_id,
      title,
      description,
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
    const { status } = req.body;
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
