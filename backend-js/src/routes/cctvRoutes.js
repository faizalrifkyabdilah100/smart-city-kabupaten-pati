/**
 * CCTV Routes
 * =============
 * Endpoint untuk daftar CCTV dan URL stream-nya
 */

const express = require('express');
const router = express.Router();
const cctvController = require('../controllers/cctvController');

// GET /api/cctv → Ambil daftar CCTV beserta stream URL
router.get('/', cctvController.getList);

module.exports = router;
