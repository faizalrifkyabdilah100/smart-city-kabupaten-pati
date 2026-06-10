const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/login
router.post('/login', authController.login);

// POST /api/logout — hapus HttpOnly cookie
router.post('/logout', authController.logout);

// GET /api/me — verifikasi sesi aktif & kembalikan data user
router.get('/me', authMiddleware, authController.me);

module.exports = router;
