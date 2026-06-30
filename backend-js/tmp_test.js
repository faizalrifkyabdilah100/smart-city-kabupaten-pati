require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/database');
async function test() {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = 'superadmin'");
        const user = rows[0];
        console.log('User found:', user ? 'yes' : 'no');
        if (user) {
            console.log('Hash prefix:', user.password.substring(0,5));
            console.log('Hash:', user.password.substring(0,30));
            const m1 = await bcrypt.compare('123456', user.password);
            const m2 = await bcrypt.compare('SmartCity@Pati2026!', user.password);
            console.log('Match 123456:', m1);
            console.log('Match SmartCity@Pati2026!:', m2);
        }
        process.exit(0);
    } catch(e) { console.error('ERR:', e.message); process.exit(1); }
}
test();