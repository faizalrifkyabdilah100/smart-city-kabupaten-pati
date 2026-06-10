import { API_BASE_URL } from '../config/api';

interface LoginResult {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Login — token JWT disimpan server sebagai HttpOnly cookie (tidak bisa dicuri via XSS).
 * Hanya data user (non-sensitif) yang disimpan di sessionStorage untuk keperluan UI.
 */
export async function loginUser(username: string, password: string): Promise<LoginResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include', // Terima HttpOnly cookie dari server
        });

        const result = await response.json();

        if (response.ok) {
            sessionStorage.setItem('user_data', JSON.stringify(result.data));
            window.dispatchEvent(new Event('user_login_success'));
            return { success: true, data: result.data };
        } else {
            return { success: false, error: result.messages?.error || 'Login gagal.' };
        }
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Gagal terhubung ke server backend.' };
    }
}

/**
 * Logout — bersihkan sessionStorage lokal dan minta server hapus cookie.
 * UI langsung update; penghapusan cookie di server berjalan di background.
 */
export function logoutUser(): void {
    sessionStorage.removeItem('user_data');
    window.dispatchEvent(new Event('user_logout_success'));

    // Hapus HttpOnly cookie di server (fire and forget)
    fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    }).catch(() => {});
}

/**
 * Header untuk request yang butuh Content-Type.
 * Autentikasi dilakukan via cookie (dikirim otomatis oleh browser dengan credentials: 'include').
 */
export function getAuthHeaders(): HeadersInit {
    return { 'Content-Type': 'application/json' };
}

/**
 * Cek apakah ada sesi aktif (berdasarkan keberadaan user_data di sessionStorage).
 * Validasi sesungguhnya dilakukan server via cookie pada setiap API call.
 */
export function isTokenValid(): boolean {
    return sessionStorage.getItem('user_data') !== null;
}

/**
 * Panggil ini saat API mengembalikan 401 — sesi habis atau tidak valid.
 */
export function handleUnauthorized(): void {
    sessionStorage.removeItem('user_data');
    window.dispatchEvent(new Event('user_logout_success'));
    window.location.href = '/login';
}

/**
 * Baca CSRF token dari cookie — dikirim sebagai X-CSRF-Token header pada request mutasi.
 * Cookie ini disetel server saat login dan bisa dibaca JS (non-HttpOnly).
 */
export function getCsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
