// =========================================
// TRAFFIC API SERVICE
// =========================================
// Fungsi untuk mengambil data trafik internet dari backend.
// Backend yang jadi perantara ke API eksternal (IP tersembunyi).

import { API_BASE_URL } from '../config/api';

export interface TrafficISP {
    name: string;
    rx: number;  // download (bytes)
    tx: number;  // upload (bytes)
}

export interface TrafficData {
    nexa: { rx: number; tx: number };
    astinet: { rx: number; tx: number };
    indibiz: { rx: number; tx: number };
}

/**
 * Format bytes ke satuan yang mudah dibaca (KB, MB, GB, TB)
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);

    return `${value.toFixed(1)} ${units[i]}`;
}

/**
 * Format bytes ke satuan bitrate (bps, Kbps, Mbps, Gbps)
 * Karena data API dalam bytes, kalikan 8 untuk bits
 */
export function formatBitrate(bytes: number): string {
    const bits = bytes * 8;
    if (bits === 0) return '0 bps';

    const units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
    const k = 1000;
    const i = Math.floor(Math.log(bits) / Math.log(k));
    const value = bits / Math.pow(k, i);

    return `${value.toFixed(1)} ${units[i]}`;
}

/**
 * Ambil data trafik internet dari BACKEND (bukan langsung ke API eksternal)
 * Backend yang jadi proxy, IP & API Key tersembunyi di server.
 */
export async function fetchTrafficData(): Promise<TrafficData | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/traffic`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: TrafficData = await response.json();
        return data;
    } catch (error) {
        console.error('Gagal mengambil data trafik:', error);
        return null;
    }
}

/**
 * Transform data API menjadi format yang siap ditampilkan di UI
 */
export function transformTrafficData(data: TrafficData) {
    const ispList = [
        {
            key: 'nexa' as const,
            name: 'Nexa',
            color: '#ef4444',
        },
        {
            key: 'astinet' as const,
            name: 'Astinet',
            color: '#3b82f6',
        },
        {
            key: 'indibiz' as const,
            name: 'Indibiz',
            color: '#10b981',
        },
    ];

    // Hitung total rx + tx
    const totalRx = data.nexa.rx + data.astinet.rx + data.indibiz.rx;
    const totalTx = data.nexa.tx + data.astinet.tx + data.indibiz.tx;
    const totalTraffic = totalRx + totalTx;

    const isp = ispList.map((item) => {
        const ispData = data[item.key];
        const ispTotal = ispData.rx + ispData.tx;
        const usage = totalTraffic > 0 ? Math.round((ispTotal / totalTraffic) * 100) : 0;

        return {
            name: item.name,
            download: formatBytes(ispData.rx),
            upload: formatBytes(ispData.tx),
            status: 'Online' as const,
            usage,
            color: item.color,
        };
    });

    return {
        totalDownload: formatBytes(totalRx),
        totalUpload: formatBytes(totalTx),
        totalTraffic: formatBytes(totalTraffic),
        isp,
    };
}
