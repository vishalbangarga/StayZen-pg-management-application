const { db } = require('../config/firebase');
const { logActivity } = require('../middleware/activityLogger');
const { sendNotification } = require('./notificationController');
const { auth } = require('../config/firebase');
const fs = require('fs');

const requestBooking = async (req, res) => {
  const { pg_id, room_type, message } = req.body;
  const user_id = req.user.uid;

  if (!pg_id || !room_type) {
    return res.status(400).json({ error: 'PG ID and room type are required' });
  }

  try {
    // Fetch PG name and User name for better display in Owner panel
    const pgDoc = await db.collection('pgs').doc(pg_id).get();
    if (!pgDoc.exists) return res.status(404).json({ error: 'PG not found' });
    const pg_name = pgDoc.data().pg_name;

    const userDoc = await db.collection('users').doc(user_id).get();
    const user_name = userDoc.exists ? userDoc.data().name : 'Unknown User';

    const bookingData = {
      user_id,
      user_name,
      pg_id,
      pg_name,
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
    // 1. Get all PGs owned by this owner
    const pgSnapshot = await db.collection('pgs').where('owner_id', '==', owner_id).get();
    const pgIds = new Set(pgSnapshot.docs.map(doc => doc.id));

    if (pgIds.size === 0) return res.json([]);

    // 2. Fetch all bookings
    const bookingSnapshot = await db.collection('booking_requests').get();
    let bookings = [];
    
    // Preparation for fetching missing names
    const userNames = new Map();
    const pgNames = new Map();

    for (const doc of bookingSnapshot.docs) {
        const data = doc.data();
        if (pgIds.has(data.pg_id)) {
            const booking = { id: doc.id, ...data };
            
            // Format date correctly for frontend
            if (booking.created_at && booking.created_at.toDate) {
                booking.created_at = booking.created_at.toDate().toISOString();
            } else if (booking.created_at && booking.created_at._seconds) {
                booking.created_at = new Date(booking.created_at._seconds * 1000).toISOString();
            }

            // Ensure user_name and pg_name exist
            if (!booking.user_name) {
                if (!userNames.has(booking.user_id)) {
                    const uDoc = await db.collection('users').doc(booking.user_id).get();
                    userNames.set(booking.user_id, uDoc.exists ? uDoc.data().name : 'Unknown');
                }
                booking.user_name = userNames.get(booking.user_id);
            }
            if (!booking.pg_name) {
                if (!pgNames.has(booking.pg_id)) {
                    const pDoc = await db.collection('pgs').doc(booking.pg_id).get();
                    pgNames.set(booking.pg_id, pDoc.exists ? pDoc.data().pg_name : 'Unknown');
                }
                booking.pg_name = pgNames.get(booking.pg_id);
            }

            bookings.push(booking);
        }
    }

    // Sort in-memory (descending creation order)
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
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

const getMyBookings = async (req, res) => {
  const user_id = req.user.uid;
  try {
    const bookingSnapshot = await db.collection('booking_requests')
      .where('user_id', '==', user_id)
      .get();

    let bookings = [];
    for (const doc of bookingSnapshot.docs) {
        const data = doc.data();
        const booking = { id: doc.id, ...data };

        // Format date
        if (booking.created_at && booking.created_at.toDate) {
            booking.created_at = booking.created_at.toDate().toISOString();
        } else if (booking.created_at && booking.created_at._seconds) {
            booking.created_at = new Date(booking.created_at._seconds * 1000).toISOString();
        }

        // Ensure pg_name exists
        if (!booking.pg_name) {
            const pDoc = await db.collection('pgs').doc(booking.pg_id).get();
            booking.pg_name = pDoc.exists ? pDoc.data().pg_name : 'Unknown';
        }

        bookings.push(booking);
    }
    
    // Sort in-memory (descending creation order)
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching tenant bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

module.exports = { requestBooking, getOwnerBookings, updateBookingStatus, getMyBookings };
