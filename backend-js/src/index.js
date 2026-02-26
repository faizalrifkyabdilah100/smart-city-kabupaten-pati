/**
 * ============================================
 * Smart City Kabupaten Pati - Backend JS
 * ============================================
 * 
 * Ini pengganti backend CI4 (CodeIgniter 4)
 * Pakai Express.js, sama persis endpoint & response format-nya
 * Supaya Frontend gak perlu diubah sama sekali!
 * 
 * Endpoints:
 *   POST   /api/login        → Login
 *   GET    /api/users         → Lihat semua user
 *   POST   /api/users         → Tambah user baru
 *   PUT    /api/users/:id     → Update user
 *   DELETE /api/users/:id     → Hapus user
 *   GET    /api/traffic       → Data trafik internet (proxy ke API eksternal)
 *   GET    /api/cctv          → Daftar CCTV beserta stream URL
 */

// Load environment variables dari .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Bikin Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ================================
// MIDDLEWARE
// ================================

// CORS - sama seperti Cors.php filter di CI4
// Allow frontend di localhost:5173
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'X-API-KEY',
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Request-Method',
    ],
    exposedHeaders: ['Content-Type'],
    maxAge: 7200,
}));

// Parse JSON body (pengganti $this->request->getJSON() di CI4)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// ROUTES
// ================================

// Mount routes di /api (sama seperti $routes->group('api') di CI4)
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

// Root route - health check
app.get('/', (req, res) => {
    res.json({
        message: 'Smart City Kabupaten Pati - Backend JS',
        status: 'running',
        version: '1.0.0',
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        messages: { error: 'Endpoint tidak ditemukan' },
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        status: 500,
        messages: { error: 'Internal server error' },
    });
});

// ================================
// START SERVER
// ================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🏙️  Smart City Kabupaten Pati - Backend JS');
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('='.repeat(50));
});

module.exports = app;
