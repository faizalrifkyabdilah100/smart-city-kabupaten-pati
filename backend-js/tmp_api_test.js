require('dotenv').config();
const http = require('http');

const body = JSON.stringify({ username: 'superadmin', password: '123456' });
const options = {
    hostname: 'localhost', port: 8080, path: '/api/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        console.log('Cookies:', res.headers['set-cookie']);
    });
});
req.on('error', e => console.error('Request error:', e.message));
req.write(body);
req.end();