// =========================================
// SERVER MONITORING API SERVICE
// =========================================
// Fungsi untuk mengambil data monitoring server
// (CPU, Memory, Storage) melalui backend proxy.
// IP internal tersembunyi dari client browser.

import { API_BASE_URL } from '../config/api';

// === TIPE DATA ===

export interface ServerCPU {
    capacityMHz: number;
    usedMHz: number;
    cores?: number;
}

export interface ServerMemory {
    capacityGB: number;
    usedGB: number;
}

export interface ServerStorage {
    capacityGB: number;
    freeGB: number;
    usedGB: number;
}

export interface ServerResources {
    cpu: ServerCPU;
    memory: ServerMemory;
    storage: ServerStorage;
}

/** Server yang berhasil diakses */
export interface ServerOnline {
    label: string;
    resources: ServerResources;
    error?: undefined;
}

/** Server yang error / timeout */
export interface ServerError {
    label: string;
    error: string;
    resources?: undefined;
}

export type ServerData = ServerOnline | ServerError;

// === HELPER FUNCTIONS ===

/** Hitung persentase penggunaan */
export function calcPercent(used: number, capacity: number): number {
    if (capacity <= 0) return 0;
    return Math.round((used / capacity) * 100);
}

/** Format angka GB menjadi lebih ringkas */
export function formatGB(gb: number): string {
    if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
    if (gb >= 100) return `${Math.round(gb)} GB`;
    return `${gb.toFixed(1)} GB`;
}

/** Format angka MHz menjadi lebih ringkas */
export function formatMHz(mhz: number): string {
    if (mhz >= 1000) return `${(mhz / 1000).toFixed(1)} GHz`;
    return `${Math.round(mhz)} MHz`;
}

/** Tentukan warna berdasarkan persentase */
export function getUsageColor(percent: number): string {
    if (percent >= 90) return '#ef4444'; // merah
    if (percent >= 70) return '#f59e0b'; // kuning
    if (percent >= 50) return '#3b82f6'; // biru
    return '#10b981'; // hijau
}

// === API CALLS (melalui backend proxy) ===

/**
 * Ambil data monitoring server dari backend proxy
 * Auto-refresh cocok dengan interval 5 detik
 */
export async function fetchServerData(): Promise<ServerData[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/servers`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: ServerData[] = await response.json();
        return data;
    } catch (error) {
        console.error('Gagal mengambil data server:', error);
        return null;
    }
}

/**
 * Ambil data monitoring server dari sumber kedua melalui proxy
 */
export async function fetchServerData2(): Promise<ServerData[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/servers2`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: ServerData[] = await response.json();
        return data;
    } catch (error) {
        console.error('Gagal mengambil data server 2:', error);
        return null;
    }
}

/**
 * Ambil data monitoring VM melalui proxy
 */
export async function fetchVmServerData(): Promise<ServerData[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/vm`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const rawData = await response.json();

        // Transform data agar sesuai dengan interface ServerData
        const transformed: ServerData[] = rawData.map((item: any) => ({
            label: item.label,
            resources: {
                cpu: {
                    capacityMHz: item.resources.cpu.totalMHz,
                    usedMHz: item.resources.cpu.usedMHz,
                    cores: item.resources.cpu.cores
                },
                memory: {
                    capacityGB: item.resources.memory.capacityGB,
                    usedGB: item.resources.memory.usedGB
                },
                storage: {
                    capacityGB: item.resources.storage.capacityGB,
                    usedGB: item.resources.storage.usedGB,
                    freeGB: item.resources.storage.capacityGB - item.resources.storage.usedGB
                }
            }
        }));

        return transformed;
    } catch (error) {
        console.error('Gagal mengambil data VM server:', error);
        return null;
    }
}
