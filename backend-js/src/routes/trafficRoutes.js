/**
 * Traffic Routes
 * ===============
 * Endpoint untuk data trafik internet
 */

const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// GET /api/traffic → Ambil data trafik dari API eksternal
router.get('/', trafficController.getTraffic);

module.exports = router;
