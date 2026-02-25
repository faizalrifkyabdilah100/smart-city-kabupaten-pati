const express = require('express');
const router = express.Router();
const menaraController = require('../controllers/menaraController');

/**
 * @route   GET /api/menara
 * @desc    Ambil data pemetaan menara
 * @access  Public
 */
router.get('/', menaraController.getMenara);

module.exports = router;
