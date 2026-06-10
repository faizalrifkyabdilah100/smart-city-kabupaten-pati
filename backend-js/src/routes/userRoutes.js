/**
 * User Routes
 * ============
 * Ini pengganti $routes->resource('users') di CI4 Routes.php
 * Berisi semua endpoint CRUD user
 * 
 * Semua route dilindungi oleh JWT auth middleware
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const csrfMiddleware = require('../middleware/csrfMiddleware');

// Semua route user dilindungi auth middleware
router.use(authMiddleware);

// GET    /api/users       → Lihat semua user
router.get('/', userController.index);

// POST, PUT, DELETE butuh CSRF token tambahan
router.post('/', csrfMiddleware, userController.create);
router.put('/:id', csrfMiddleware, userController.update);
router.delete('/:id', csrfMiddleware, userController.delete);

module.exports = router;

