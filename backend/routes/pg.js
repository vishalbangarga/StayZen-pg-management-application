const express = require('express');
const router = express.Router();
const { createPG, getAllPGs, getPGById, updatePG, deletePG } = require('../controllers/pgController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllPGs);
router.get('/:id', getPGById);
router.post('/', verifyToken, authorizeRoles('owner'), createPG);
router.put('/:id', verifyToken, authorizeRoles('owner'), updatePG);
router.delete('/:id', verifyToken, authorizeRoles('owner'), deletePG);

module.exports = router;
