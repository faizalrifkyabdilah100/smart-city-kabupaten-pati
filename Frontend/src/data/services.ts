import { type Service } from '../types'; // Import dari file types (pastikan path sesuai)

export const services: Service[] = [
  // 1. ATAS (Login) -> Arahkan ke /login
  { 
    id: 1, 
    title: "Login", 
    icon: "/login1.png", 
    angle: 270, 
    path: '/login' // <--- PENTING: Huruf kecil
  },
  
  // 2. KANAN (Lingkungan Hidup)
  { 
    id: 2, 
    title: "Lingkungan Hidup", 
    icon: "/lingkungan2.png", 
    angle: 0, 
    path: "/lingkungan-hidup" 
  },
  
  // 3. KANAN BAWAH (Infrastruktur)
  { 
    id: 3, 
    title: "Infrastruktur Pembangunan", 
    icon: "/infrastruktur2.png", 
    angle: 50,
    path: "/infrastruktur"
  },
  
  // 4. KIRI BAWAH (Kesehatan)
  { 
    id: 4, 
    title: "Kesehatan", 
    icon: "/kesehatan3.png", 
    angle: 130,
    path: "/kesehatan"
  },
  
  // 5. KIRI (Sosial Media)
  { 
    id: 5, 
    title: "Sosial Media Kominfo", 
    icon: "/sosmed2.png", 
    angle: 180,
    path: "/sosial-media"
  },
];