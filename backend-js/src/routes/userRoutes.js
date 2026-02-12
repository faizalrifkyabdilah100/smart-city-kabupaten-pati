/**
 * User Routes
 * ============
 * Ini pengganti $routes->resource('users') di CI4 Routes.php
 * Berisi semua endpoint CRUD user
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET    /api/users       → Lihat semua user
router.get('/', userController.index);

// POST   /api/users       → Tambah user baru
router.post('/', userController.create);

// PUT    /api/users/:id   → Update user
router.put('/:id', userController.update);

// DELETE /api/users/:id   → Hapus user
router.delete('/:id', userController.delete);

module.exports = router;
