/**
 * Database Seeder
 * ================
 * Ini pengganti UserSeeder.php di CI4
 * Jalankan: node src/seed.js
 * 
 * Akan menambahkan 2 user default:
 * 1. superadmin (Super Administrator) - password: 123456
 * 2. admin_lh (Admin Lingkungan) - password: 123456
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
    console.log('🌱 Memulai seeding database...');

    try {
        // Hash password (sama seperti password_hash('123456', PASSWORD_BCRYPT))
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const users = [
            {
                username: 'superadmin',
                nama: 'Super Administrator',
                password: hashedPassword,
                opd: 'Diskominfo',
                role: 'super_admin',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: 'admin_lh',
                nama: 'Admin Lingkungan',
                password: hashedPassword,
                opd: 'Dinas Lingkungan Hidup',
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        for (const user of users) {
            try {
                await db.query('INSERT INTO users SET ?', [user]);
                console.log(`✅ User "${user.username}" berhasil ditambahkan`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`⚠️  User "${user.username}" sudah ada, skip...`);
                } else {
                    throw err;
                }
            }
        }

        console.log('\n🎉 Seeding selesai!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding gagal:', error);
        process.exit(1);
    }
}

seed();
