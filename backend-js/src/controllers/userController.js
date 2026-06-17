/**
 * User Controller
 * =================
 * Ini pengganti UserController.php di CI4
 * Handle CRUD user (index, create, update, delete)
 * 
 * Response format SAMA PERSIS supaya frontend gak perlu diubah
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

const userController = {

    /**
     * 1. LIHAT SEMUA USER (GET /api/users)
     * Sama seperti index() di UserController.php
     */
    index: async (req, res) => {
        try {
            // Hanya ambil kolom yang dibutuhkan (tanpa password)
            const [rows] = await db.query(
                'SELECT id, username, nama, opd, role, created_at, updated_at FROM users ORDER BY id DESC'
            );

            return res.status(200).json(rows);
        } catch (error) {
            console.error('Fetch users error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Gagal mengambil data user' },
            });
        }
    },

    /**
     * 2. TAMBAH USER BARU (POST /api/users)
     * Sama seperti create() di UserController.php
     */
    create: async (req, res) => {
        try {
            const { username, nama, opd, role, password } = req.body;

            if (!username || !nama || !password) {
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Data JSON tidak ditemukan' },
                });
            }

            // Hash Password (bcrypt, sama seperti password_hash di PHP)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const data = {
                username,
                nama,
                opd: opd || null,
                role: role || 'admin', // Default role admin
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            };

            try {
                await db.query('INSERT INTO users SET ?', [data]);
                return res.status(201).json({
                    status: 201,
                    error: null,
                    messages: {
                        success: 'User berhasil ditambahkan',
                    },
                });
            } catch (dbError) {
                // Biasanya error kalau username sudah ada (UNIQUE constraint)
                console.error('Insert error:', dbError);
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Gagal menambah user. Username mungkin sudah dipakai.' },
                });
            }

        } catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Internal server error' },
            });
        }
    },

    /**
     * 3. UPDATE USER (PUT /api/users/:id)
     * Sama seperti update() di UserController.php
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, nama, opd, role, password } = req.body;

            if (!username || !nama) {
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Data JSON tidak ditemukan' },
                });
            }

            // Cek dulu user-nya ada gak?
            const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({
                    status: 404,
                    messages: { error: 'User tidak ditemukan' },
                });
            }

            const data = {
                username,
                nama,
                opd: opd || null,
                role,
                updated_at: new Date(),
            };

            // LOGIKA PASSWORD:
            // Kalau password dikirim kosong, berarti TIDAK diganti.
            // Kalau diisi, baru kita hash ulang.
            if (password && password.trim() !== '') {
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(password, salt);
            }

            try {
                await db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
                return res.status(200).json({
                    status: 200,
                    message: 'Data user berhasil diupdate',
                });
            } catch (dbError) {
                console.error('Update error:', dbError);
                return res.status(400).json({
                    status: 400,
                    messages: { error: 'Gagal update data.' },
                });
            }

        } catch (error) {
            console.error('Update user error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Internal server error' },
            });
        }
    },

    /**
     * 4. HAPUS USER (DELETE /api/users/:id)
     * Sama seperti delete() di UserController.php
     */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Cegah user menghapus akun dirinya sendiri
            if (parseInt(id) === req.user?.id) {
                return res.status(403).json({
                    status: 403,
                    messages: { error: 'Tidak dapat menghapus akun Anda sendiri.' },
                });
            }

            // Cek user ada gak?
            const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({
                    status: 404,
                    messages: { error: 'User tidak ditemukan' },
                });
            }

            await db.query('DELETE FROM users WHERE id = ?', [id]);

            return res.status(200).json({
                status: 200,
                message: 'User berhasil dihapus',
            });

        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Internal server error' },
            });
        }
    },
};

module.exports = userController;
