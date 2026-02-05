import { type Service } from '../types/index'; // Import dari file types

export const services: Service[] = [
  // 1. ATAS (Login) - Tetap tanpa path (Popup)
  { id: 1, title: "Login", icon: "/login1.png", angle: 270 },
  
  // 2. KANAN (Lingkungan Hidup)
  { id: 2, title: "Lingkungan Hidup", icon: "/lingkungan2.png", angle: 0, path: "/lingkungan-hidup" },
  
  // 3. KANAN BAWAH (Infrastruktur) - BARU
  { 
    id: 3, 
    title: "Infrastruktur Pembangunan", 
    icon: "/infrastruktur2.png", 
    angle: 50,
    path: "/infrastruktur" // <--- Tambah Path
  },
  
  // 4. KIRI BAWAH (Kesehatan) - BARU
  { 
    id: 4, 
    title: "Kesehatan", 
    icon: "/kesehatan3.png", 
    angle: 130,
    path: "/kesehatan" // <--- Tambah Path
  },
  
  // 5. KIRI (Sosial Media) - BARU
  { 
    id: 5, 
    title: "Sosial Media Kominfo", 
    icon: "/sosmed2.png", 
    angle: 180,
    path: "/sosial-media" // <--- Tambah Path
  },
];