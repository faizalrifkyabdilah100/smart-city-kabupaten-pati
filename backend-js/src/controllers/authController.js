const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Opsi cookie — HttpOnly mencegah akses dari JavaScript (XSS protection)
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only di production
    sameSite: 'strict',                             // Mitigasi CSRF
    maxAge: 24 * 60 * 60 * 1000,                   // 24 jam dalam milidetik
    path: '/',
};

// CSRF cookie — httpOnly: false agar JS frontend bisa membacanya (Double Submit Cookie pattern)
const CSRF_COOKIE_OPTIONS = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
};

// Dummy hash untuk timing-safe check saat user tidak ditemukan
const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';

const authController = {

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Username dan password wajib diisi.' },
                });
            }

            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            // Pesan error SAMA untuk user tidak ada maupun password salah
            // (mencegah user enumeration attack)
            const INVALID_MSG = 'Username atau password salah.';

            if (!user) {
                // Tetap jalankan bcrypt.compare untuk mencegah timing attack
                await bcrypt.compare(password, DUMMY_HASH);
                return res.status(401).json({ status: 401, messages: { error: INVALID_MSG } });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ status: 401, messages: { error: INVALID_MSG } });
            }

            const dataResponse = {
                id: user.id,
                username: user.username,
                nama: user.nama,
                role: user.role,
                opd: user.opd,
            };

            const token = jwt.sign(dataResponse, process.env.JWT_SECRET, { expiresIn: '24h' });

            // Set JWT sebagai HttpOnly cookie — tidak bisa diakses JavaScript
            res.cookie('authToken', token, COOKIE_OPTIONS);

            // Set CSRF token sebagai cookie biasa — dibaca frontend dan dikirim sebagai header
            const csrfToken = crypto.randomBytes(32).toString('hex');
            res.cookie('csrfToken', csrfToken, CSRF_COOKIE_OPTIONS);

            return res.status(200).json({
                status: 200,
                message: 'Login Berhasil',
                data: dataResponse,
                // token TIDAK dikembalikan di body
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Internal server error' },
            });
        }
    },

    logout: (req, res) => {
        res.clearCookie('authToken', { ...COOKIE_OPTIONS, maxAge: 0 });
        res.clearCookie('csrfToken', { ...CSRF_COOKIE_OPTIONS, maxAge: 0 });
        return res.status(200).json({ status: 200, message: 'Logout berhasil' });
    },

    me: (req, res) => {
        // req.user sudah di-attach oleh authMiddleware setelah verifikasi signature JWT
        return res.status(200).json({ status: 200, data: req.user });
    },
};

module.exports = authController;
