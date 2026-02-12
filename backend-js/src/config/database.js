/**
 * Konfigurasi Koneksi Database MySQL
 * ===================================
 * Pakai mysql2 dengan promise-based supaya bisa pake async/await
 * Ini sama seperti Config/Database.php di CI4
 */

const mysql = require('mysql2/promise');

// Bikin pool koneksi (lebih efisien daripada single connection)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'smart_city_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
