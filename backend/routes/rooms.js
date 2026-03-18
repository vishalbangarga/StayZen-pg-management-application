const express = require('express');
const router = express.Router();
const { createRoom, getRoomsByPG, getBedsByRoom } = require('../controllers/roomController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/pg/:pg_id', getRoomsByPG);
router.get('/:room_id/beds', getBedsByRoom);
router.post('/', verifyToken, authorizeRoles('owner'), createRoom);

module.exports = router;
