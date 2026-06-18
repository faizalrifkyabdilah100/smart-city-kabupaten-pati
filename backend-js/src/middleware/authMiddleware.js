const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Baca token dari HttpOnly cookie (bukan Authorization header)
    const token = req.cookies?.authToken;

    if (!token) {
        return res.status(401).json({
            status: 401,
            messages: { error: 'Akses ditolak. Sesi tidak ditemukan, silakan login.' },
        });
    }

    try {
        // Verifikasi signature JWT dengan secret dari environment
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Hapus cookie yang tidak valid
        res.clearCookie('authToken', { httpOnly: true, sameSite: 'strict', path: '/' });
        return res.status(401).json({
            status: 401,
            messages: { error: 'Sesi tidak valid atau sudah berakhir. Silakan login ulang.' },
        });
    }
}

function requireSuperAdmin(req, res, next) {
    if (req.user?.role !== 'super_admin') {
        return res.status(403).json({
            status: 403,
            messages: { error: 'Akses ditolak. Hanya Super Admin yang dapat melakukan aksi ini.' },
        });
    }
    next();
}

module.exports = authMiddleware;
module.exports.requireSuperAdmin = requireSuperAdmin;
