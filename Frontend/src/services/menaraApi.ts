
import { API_BASE_URL } from '../config/api';

export interface MenaraData {
    id: string;
    id_menara: string;
    nama_menara: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    lat: number;
    longitude: number;
    tipe_site: string;
    tinggi_menara: number;
    struktur: string;
    tahun_pembuatan: string;
    no_rekom_kominfo?: string | null;
}

/**
 * Ambil data menara melalui backend proxy
 * (IP internal tersembunyi dari browser)
 */
export async function fetchMenaraData(): Promise<MenaraData[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/menara`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const resData = await response.json();

        // Data biasanya dibungkus dalam properti 'data' dari proxy backend saya
        if (resData.data && Array.isArray(resData.data)) {
            return resData.data;
        }

        return Array.isArray(resData) ? resData : [];
    } catch (error) {
        console.error('Gagal mengambil data menara:', error);
        return [];
    }
}
