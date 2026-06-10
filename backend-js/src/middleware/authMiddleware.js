/**
 * Auth Middleware (JWT)
 * =====================
 * Middleware untuk memproteksi route yang butuh login.
 * Cek header Authorization: Bearer <token>
 * Jika valid, lanjut ke controller. Jika tidak, tolak 401.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smart-city-pati-secret-key-change-me';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            messages: { error: 'Akses ditolak. Token tidak ditemukan.' },
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user data ke request
        next();
    } catch (err) {
        return res.status(401).json({
            status: 401,
            messages: { error: 'Token tidak valid atau sudah kedaluwarsa.' },
        });
    }
}

module.exports = authMiddleware;
