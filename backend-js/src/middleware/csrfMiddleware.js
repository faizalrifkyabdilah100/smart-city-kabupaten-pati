/**
 * CSRF Middleware — Double Submit Cookie pattern
 * Validasi X-CSRF-Token header terhadap csrfToken cookie.
 * Terapkan hanya pada request yang mengubah state (POST, PUT, DELETE).
 */
function csrfMiddleware(req, res, next) {
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies?.csrfToken;

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return res.status(403).json({
            status: 403,
            messages: { error: 'Token CSRF tidak valid. Muat ulang halaman dan coba lagi.' },
        });
    }
    next();
}

module.exports = csrfMiddleware;
