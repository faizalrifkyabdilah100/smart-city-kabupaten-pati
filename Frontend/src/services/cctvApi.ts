// =========================================
// CCTV API SERVICE
// =========================================
// Fungsi untuk mengambil daftar CCTV dari backend.
// URL CCTV stream tersimpan di backend (.env), bukan di frontend.

import { API_BASE_URL } from '../config/api';

export interface CctvItem {
    id: number;
    name: string;
    location: string;
    streamUrl: string;
}

export interface CctvMain {
    location: string;
    status: string;
    streamUrl: string;
}

export interface CctvResponse {
    main: CctvMain;
    list: CctvItem[];
}

/**
 * Ambil daftar CCTV dari backend
 * Backend yang menyimpan URL stream, frontend tinggal pakai.
 */
export async function fetchCctvData(): Promise<CctvResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/cctv`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: CctvResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Gagal mengambil data CCTV:', error);
        return null;
    }
}
