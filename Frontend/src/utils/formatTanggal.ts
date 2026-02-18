// =========================================
// FORMAT TANGGAL INDONESIA
// =========================================
// Supaya gak nulis toLocaleDateString panjang-panjang di setiap halaman

/**
 * Format tanggal ke bahasa Indonesia
 * Output: "Senin, 13 Februari 2026"
 */
export function formatTanggal(date: Date = new Date()): string {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
