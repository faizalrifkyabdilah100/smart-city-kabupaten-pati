// =========================================
// AUTH UTILITY FUNCTIONS
// =========================================
// Fungsi login, logout, dan helper autentikasi.
// Token JWT disimpan di localStorage untuk dikirim di setiap request.

import { API_BASE_URL } from '../config/api';

// Tipe response dari fungsi loginUser
interface LoginResult {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Fungsi Login User
 * - Kirim username & password ke backend
 * - Simpan data user + JWT token ke localStorage kalau berhasil
 * - Dispatch event 'user_login_success' supaya Navbar & Home update
 */
export async function loginUser(username: string, password: string): Promise<LoginResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Sukses - Simpan data user & token ke localStorage
            localStorage.setItem('user_data', JSON.stringify(result.data));
            localStorage.setItem('auth_token', result.token);
            window.dispatchEvent(new Event('user_login_success'));
            return { success: true, data: result.data };
        } else {
            // Gagal - Kembalikan pesan error
            return { success: false, error: result.messages?.error || 'Login Gagal. Periksa username/password.' };
        }
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Gagal terhubung ke server Backend.' };
    }
}

/**
 * Fungsi Logout User
 * - Hapus data & token dari localStorage
 * - Dispatch event supaya Navbar & Home update
 */
export function logoutUser(): void {
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('user_logout_success'));
}

/**
 * Ambil auth token dari localStorage
 */
export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}

/**
 * Buat header Authorization untuk fetch request
 */
export function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * Cek apakah token masih valid (belum expired)
 * Decode JWT tanpa library (payload = base64)
 */
export function isTokenValid(): boolean {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch {
        return false;
    }
}
