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
const { requireSuperAdmin } = require('../middleware/authMiddleware');
const csrfMiddleware = require('../middleware/csrfMiddleware');
const { validate, createUserSchema, updateUserSchema } = require('../middleware/validateMiddleware');

// Semua route user dilindungi auth middleware
router.use(authMiddleware);

// GET    /api/users       → Lihat semua user (semua role boleh)
router.get('/', userController.index);

// POST, PUT, DELETE → hanya super_admin + butuh CSRF token + validasi Zod
router.post('/',    requireSuperAdmin, csrfMiddleware, validate(createUserSchema), userController.create);
router.put('/:id',  requireSuperAdmin, csrfMiddleware, validate(updateUserSchema), userController.update);
router.delete('/:id', requireSuperAdmin, csrfMiddleware, userController.delete);

module.exports = router;

