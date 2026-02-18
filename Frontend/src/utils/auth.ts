// =========================================
// AUTH UTILITY FUNCTIONS
// =========================================
// Fungsi login dipusatkan di sini supaya tidak ditulis ulang
// di Login.tsx dan PopupView.tsx

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
 * - Simpan data user ke localStorage kalau berhasil
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
            // Sukses - Simpan data user ke localStorage
            localStorage.setItem('user_data', JSON.stringify(result.data));
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
 * - Hapus data dari localStorage
 * - Dispatch event supaya Navbar & Home update
 */
export function logoutUser(): void {
    localStorage.removeItem('user_data');
    window.dispatchEvent(new Event('user_logout_success'));
}
