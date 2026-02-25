# Backend - Smart City Kabupaten Pati
Backend ini dibangun menggunakan **Node.js** dan **Express.js** untuk menggantikan backend lama (CodeIgniter 4). Backend ini berfungsi sebagai API server untuk aplikasi frontend Smart City.

## Fitur Utama
- **Proxy API**: Mengamankan endpoint eksternal (CCTV, Traffic, Server Monitoring, VM) dengan menjadikannya perantara antara frontend dan provider API asli.
- **RESTful API**: Menyediakan data untuk Monitoring Server, CCTV, Internet Traffic, Pemetaan Menara, dan Manajemen User.
- **Database Integration**: Terhubung dengan MySQL untuk data manajemen user dan pengaturan lainnya.

## Struktur Proyek
- `src/controllers/` - Logika utama untuk menangani request API.
- `src/routes/` - Definisi endpoint API.
- `src/config/` - Konfigurasi database dan environment.
- `src/services/` - Integrasi dengan layanan eksternal.

## Environment Variables (.env)
Pastikan kamu memiliki file `.env` di folder root dengan isi sebagai berikut:

```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=smart_city_db

# External API Proxy
TRAFFIC_API_URL=http://...
SERVER_API_URL=http://...
SERVER_API_URL_2=http://...
VM_API_URL=http://...
CCTV_BASE_URL=http://...
MENARA_API_URL=http://...
```

## Instalasi & Menjalankan
1. Install Dependensi:
   ```bash
   npm install
   ```
2. Jalankan Mode Development:
   ```bash
   npm run dev
   ```
3. Seed Database (Opsional):
   ```bash
   node src/seed.js
   ```

## Endpoint Monitoring
- `GET /api/servers` - Data Proxmox Cluster
- `GET /api/servers/2` - Data VM Linux Secondary
- `GET /api/servers/vm` - Data VM Provider (Streamer, UsCast, DockPati, DockWeb)
- `GET /api/traffic` - Data Real-time Internet Traffic
- `GET /api/cctv` - Daftar Stream CCTV
- `GET /api/menara` - Data Pemetaan Menara
