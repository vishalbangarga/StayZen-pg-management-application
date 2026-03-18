const express = require('express');
const router = express.Router();
const { assignTenant, getTenantsByPG } = require('../controllers/tenantController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRoles('owner'), assignTenant);
router.get('/pg/:pg_id', verifyToken, authorizeRoles('owner'), getTenantsByPG);

module.exports = router;
