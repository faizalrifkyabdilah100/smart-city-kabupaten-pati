/**
 * Database Migration
 * ===================
 * Ini pengganti 2026-02-05-055238_Users.php di CI4
 * Jalankan: node src/migrate.js
 * 
 * Akan membuat tabel 'users' dengan struktur yang SAMA PERSIS
 * seperti migration CI4
 */

require('dotenv').config();
const db = require('./config/database');

async function migrate() {
    console.log('🔧 Memulai migrasi database...');

    try {
        // Buat tabel users (sama persis dengan migration CI4)
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        opd VARCHAR(100) NULL,
        role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
        created_at DATETIME NULL,
        updated_at DATETIME NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

        await db.query(createUsersTable);
        console.log('✅ Tabel "users" berhasil dibuat (atau sudah ada)');

        console.log('\n🎉 Migrasi selesai!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migrasi gagal:', error);
        process.exit(1);
    }
}

migrate();
