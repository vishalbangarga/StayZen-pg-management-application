const { db } = require('../config/firebase');
const { logActivity } = require('../middleware/activityLogger');
const { sendNotification } = require('./notificationController');

const requestBooking = async (req, res) => {
  const { pg_id, room_type, message } = req.body;
  const user_id = req.user.uid;

  if (!pg_id || !room_type) {
    return res.status(400).json({ error: 'PG ID and room type are required' });
  }

  try {
    const bookingData = {
      user_id,
      pg_id,
      room_type,
      message: message || '',
      status: 'Pending',
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await db.collection('booking_requests').add(bookingData);
    await logActivity(user_id, 'BOOKING_REQUEST', { booking_id: docRef.id, pg_id });

    res.status(201).json({ id: docRef.id, ...bookingData });
  } catch (error) {
    console.error('Error creating booking request:', error);
    res.status(500).json({ error: 'Failed to create booking request' });
  }
};

const getOwnerBookings = async (req, res) => {
  const owner_id = req.user.uid;
  try {
    // Phase 1: Get all PGs owned by this owner
    const pgSnapshot = await db.collection('pgs').where('owner_id', '==', owner_id).get();
    const pgIds = pgSnapshot.docs.map(doc => doc.id);

    if (pgIds.length === 0) return res.json([]);

    // Phase 2: Get booking requests for these PGs
    const bookingSnapshot = await db.collection('booking_requests')
      .where('pg_id', 'in', pgIds)
      .orderBy('created_at', 'desc')
      .get();

    const bookings = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved / Rejected

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const bookingRef = db.collection('booking_requests').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) return res.status(404).json({ error: 'Booking not found' });

    await bookingRef.update({ 
      status, 
      updated_at: new Date() 
    });

    const bookingData = bookingDoc.data();
    await sendNotification(
      bookingData.user_id, 
      `Your booking request for ${status === 'Approved' ? 'approved' : 'rejected'}.`,
      'BOOKING_UPDATE'
    );

    await logActivity(req.user.uid, 'BOOKING_STATUS_UPDATE', { booking_id: id, status });

    res.json({ message: `Booking ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

module.exports = { requestBooking, getOwnerBookings, updateBookingStatus };
