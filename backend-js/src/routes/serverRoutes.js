/**
 * Server Monitoring Routes
 * =========================
 * Endpoint untuk data monitoring server (CPU, Memory, Storage)
 */

const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');

// GET /api/servers → Ambil data monitoring dari API eksternal (sumber 1)
router.get('/', serverController.getServers);

// GET /api/servers/2 → Ambil data monitoring dari API eksternal (sumber 2)
router.get('/2', serverController.getServers2);

module.exports = router;
