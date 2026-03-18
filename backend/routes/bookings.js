const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { requestBooking, getOwnerBookings, updateBookingStatus } = require('../controllers/bookingController');

// Visitors (Logged-in) can request bookings
router.post('/request', verifyToken, requestBooking);

// Owners can see bookings for their PGs
router.get('/owner', verifyToken, authorizeRoles('owner'), getOwnerBookings);

// Owners can approve/reject
router.put('/:id/status', verifyToken, authorizeRoles('owner'), updateBookingStatus);

module.exports = router;
