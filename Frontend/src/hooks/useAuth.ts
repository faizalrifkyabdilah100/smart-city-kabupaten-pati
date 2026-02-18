// =========================================
// CUSTOM HOOK: useAuth
// =========================================
// Menggabungkan logika baca user dari localStorage + listen event
// yang sebelumnya duplikat di Home.tsx dan Navbar.tsx

import { useState, useEffect } from 'react';
import { type UserInfo } from '../types';

/**
 * Hook untuk mendapatkan state user yang sedang login.
 * Otomatis update saat login/logout terjadi.
 */
export function useAuth() {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        // Fungsi baca user dari localStorage
        const updateUser = () => {
            try {
                const raw = localStorage.getItem('user_data');
                if (raw) setUser(JSON.parse(raw));
                else setUser(null);
            } catch (e) {
                setUser(null);
            }
        };

        // Baca pertama kali
        updateUser();

        // Listen event login, logout, dan storage change
        const handleChange = () => updateUser();

        window.addEventListener('user_login_success', handleChange);
        window.addEventListener('user_logout_success', handleChange);
        window.addEventListener('storage', handleChange);

        return () => {
            window.removeEventListener('user_login_success', handleChange);
            window.removeEventListener('user_logout_success', handleChange);
            window.removeEventListener('storage', handleChange);
        };
    }, []);

    return user;
}
