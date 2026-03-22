const express = require('express');
const router = express.Router();
const { assignTenant, getTenantsByPG, getMyRoomDetails } = require('../controllers/tenantController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRoles('owner'), assignTenant);
router.get('/pg/:pg_id', verifyToken, authorizeRoles('owner'), getTenantsByPG);
router.get('/my-room', verifyToken, authorizeRoles('tenant'), getMyRoomDetails);

module.exports = router;
