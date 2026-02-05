// =========================================
// DEFINISI TIPE DATA GLOBAL (TYPE DEFINITIONS)
// =========================================

// 1. Tipe untuk Menu Layanan (Services)
// Dipakai di: src/data/services.ts, Home.tsx, DockMenu.tsx
export interface Service {
  id: number;
  title: string;
  icon: string;
  angle: number; // Posisi derajat untuk menu melingkar di Home
  path?: string; // Opsional (tanda ?) karena tombol Login mungkin tidak punya path URL
}

// 2. Tipe untuk ID Widget (Fitur Zoom/Expand Chart)
// Dipakai di: src/pages/LingkunganHidup.tsx
export type WidgetId = 'tpa' | 'sampah' | 'perusahaan' | 'adiwiyata' | 'komposisi' | 'rth';

// 3. Tipe untuk Struktur Data Chart (Opsional, biar makin Pro)
// Dipakai di: src/data/dashboardData.ts

// Format umum untuk grafik batang/pie (BarChart/PieChart)
export interface ChartItem {
  name: string;
  value?: number;  // Bisa value, jumlah, atau ton (tergantung datanya)
  jumlah?: number;
  ton?: number;
  color?: string;  // Warna custom bar/pie
}

// Format khusus Data TPA
export interface TPAData {
  kapasitas: number;
  terisi: number;
  sisaTahun: number;
  sisaHari: number;
}

// Format khusus Data RTH
export interface RTHData {
  persen: number;
  target: number;
  luas: number;
}