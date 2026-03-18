const express = require('express');
const router = express.Router();
const { submitComplaint, getComplaintsByTenant, resolveComplaint, getComplaintsByPG, getAllComplaintsForOwner } = require('../controllers/complaintController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRoles('tenant'), submitComplaint);
router.get('/', verifyToken, authorizeRoles('owner'), getAllComplaintsForOwner);
router.get('/me', verifyToken, authorizeRoles('tenant'), getComplaintsByTenant);
router.get('/tenant/:tenant_id', verifyToken, getComplaintsByTenant);
router.get('/pg/:pg_id', verifyToken, authorizeRoles('owner'), getComplaintsByPG);
router.put('/:complaint_id/resolve', verifyToken, authorizeRoles('owner'), resolveComplaint);

module.exports = router;
