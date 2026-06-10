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

// Pastikan JWT_SECRET dikonfigurasi — jangan pakai fallback hardcoded
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET belum dikonfigurasi di .env. Server tidak dapat dijalankan.');
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const proxyRoutes = require('./routes/proxyRoutes');

// Bikin Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ================================
// MIDDLEWARE
// ================================

// Rate limiter untuk endpoint login (mencegah brute force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10,                   // max 10 percobaan per IP
    message: {
        status: 429,
        messages: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS — credentials: true wajib untuk HttpOnly cookie
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 7200,
}));

// Cookie parser — untuk membaca HttpOnly auth cookie
app.use(cookieParser());

// Parse JSON body (pengganti $this->request->getJSON() di CI4)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Terapkan rate limiter hanya pada route login
app.use('/api/login', loginLimiter);

// ================================
// ROUTES
// ================================

// Mount routes di /api (sama seperti $routes->group('api') di CI4)
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', proxyRoutes);

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
