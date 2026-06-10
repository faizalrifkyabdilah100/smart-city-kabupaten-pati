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
 * Ambil daftar CCTV dari backend.
 * URL & IP kamera tersimpan di backend .env — tidak terekspos di bundle frontend.
 */
export async function fetchCctvData(): Promise<CctvResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/cctv`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Gagal mengambil data CCTV:', error);
        return null;
    }
}
