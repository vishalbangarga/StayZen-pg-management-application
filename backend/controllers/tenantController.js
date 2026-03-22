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
    const roomsSnapshot = await db.collection('rooms').where('pg_id', '==', pg_id).get();
    const roomIds = roomsSnapshot.docs.map(doc => doc.id);

    if (roomIds.length === 0) return res.json([]);

    const tenants = [];
    for (const doc of tenantsSnapshot.docs) {
      const tData = doc.data();
      const [userDoc, roomDoc, bedDoc] = await Promise.all([
        db.collection('users').doc(tData.user_id).get(),
        db.collection('rooms').doc(tData.room_id).get(),
        db.collection('beds').doc(tData.bed_id).get()
      ]);

      if (userDoc.exists) {
        const uData = userDoc.data();
        tenants.push({
          id: doc.id,
          ...tData,
          name: uData.name,
          email: uData.email,
          phone: uData.phone,
          room_number: roomDoc.exists ? roomDoc.data().room_number : 'N/A',
          bed_number: bedDoc.exists ? bedDoc.data().bed_number : 'N/A'
        });
      }
    }
    res.json(tenants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyRoomDetails = async (req, res) => {
  try {
    const user_id = req.user.uid;
    console.log(`Fetching room details for user: ${user_id}`);

    // 1. Get tenant record
    const tenantSnapshot = await db.collection('tenants')
      .where('user_id', '==', user_id)
      .limit(1)
      .get();

    if (tenantSnapshot.empty) {
      console.log(`No tenant record found for user: ${user_id}`);
      return res.status(404).json({ error: 'Tenant record not found' });
    }

    const tenantData = tenantSnapshot.docs[0].data();
    const { room_id, bed_id, joining_date, rent_amount } = tenantData;

    // 2. Get room details
    const roomDoc = await db.collection('rooms').doc(room_id).get();
    const roomData = roomDoc.exists ? roomDoc.data() : {};

    // 3. Get PG details
    const pg_id = roomData.pg_id;
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    const pgData = pgDoc.exists ? pgDoc.data() : {};

    // 4. Get roommates
    const roommatesSnapshot = await db.collection('tenants')
      .where('room_id', '==', room_id)
      .get();

    const roommates = [];
    for (const doc of roommatesSnapshot.docs) {
      const rData = doc.data();
      if (rData.user_id !== user_id) {
        const uDoc = await db.collection('users').doc(rData.user_id).get();
        if (uDoc.exists) {
          const uData = uDoc.data();
          roommates.push({
            name: uData.name,
            phone: uData.phone,
            from: uData.from || 'Not Specified',
            bed_id: rData.bed_id
          });
        }
      }
    }

    res.json({
      room_number: roomData.room_number,
      room_type: roomData.sharing_type + ' Sharing',
      pg_name: pgData.pg_name,
      pg_location: pgData.location,
      pg_facilities: pgData.facilities,
      bed_number: bed_id,
      joined_date: joining_date,
      rent: rent_amount,
      roommates
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { assignTenant, getTenantsByPG, getMyRoomDetails };
