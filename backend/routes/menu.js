const express = require('express');
const router = express.Router();
const { updateMenu, getMenuByPG } = require('../controllers/menuController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/:pg_id', verifyToken, getMenuByPG);
router.post('/', verifyToken, authorizeRoles('owner'), updateMenu);

module.exports = router;
