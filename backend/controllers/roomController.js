const { db } = require('../config/firebase');

const createRoom = async (req, res) => {
  try {
    const { pg_id, room_number, room_type, total_beds, price_per_bed, deposit_amount } = req.body;
    
    // Check if PG exists and user is owner
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    if (!pgDoc.exists || pgDoc.data().owner_id !== req.user.uid) {
      return res.status(403).json({ error: 'Permission denied or PG not found' });
    }

    const roomRef = await db.collection('rooms').add({
      pg_id,
      room_number,
      room_type,
      total_beds,
      price_per_bed,
      deposit_amount,
      createdAt: new Date().toISOString()
    });

    // Create beds for the room
    const batch = db.batch();
    for (let i = 1; i <= total_beds; i++) {
      const bedRef = db.collection('beds').doc();
      batch.set(bedRef, {
        room_id: roomRef.id,
        bed_number: i,
        status: 'available',
        tenant_id: null
      });
    }
    await batch.commit();

    res.status(201).json({ id: roomRef.id, message: 'Room and beds created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRoomsByPG = async (req, res) => {
  try {
    const roomsSnapshot = await db.collection('rooms').where('pg_id', '==', req.params.pg_id).get();
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBedsByRoom = async (req, res) => {
  try {
    const bedsSnapshot = await db.collection('beds').where('room_id', '==', req.params.room_id).get();
    const beds = bedsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(beds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createRoom, getRoomsByPG, getBedsByRoom };
