/**
 * Auth Routes
 * ============
 * Ini pengganti route 'api/login' di CI4 Routes.php
 * Berisi endpoint untuk login
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/login
router.post('/login', authController.login);

module.exports = router;
