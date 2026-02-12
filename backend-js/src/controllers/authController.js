/**
 * Auth Controller
 * ================
 * Ini pengganti AuthController.php di CI4
 * Handle login user
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

const authController = {
    /**
     * LOGIN
     * POST /api/login
     * Body: { username, password }
     * 
     * Sama persis logikanya sama AuthController.php:
     * 1. Ambil data JSON
     * 2. Cari user di database
     * 3. Cek password
     * 4. Kembalikan data tanpa password
     */
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // 1. Cek ada data yang dikirim gak?
            if (!username || !password) {
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Tidak ada data yang dikirim.' },
                });
            }

            // 2. Cari user di database
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            // 3. Cek User Ada?
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    messages: { error: 'Username tidak ditemukan.' },
                });
            }

            // 4. Cek Password (bcrypt compare)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: 401,
                    messages: { error: 'Password salah.' },
                });
            }

            // 5. Sukses! Kembalikan data (Tanpa Password)
            const dataResponse = {
                id: user.id,
                username: user.username,
                nama: user.nama,
                role: user.role,
                opd: user.opd,
            };

            return res.status(200).json({
                status: 200,
                message: 'Login Berhasil',
                data: dataResponse,
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Internal server error' },
            });
        }
    },
};

module.exports = authController;
