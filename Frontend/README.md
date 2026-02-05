# React + TypeScript + Vite
# Smart City - Kabupaten Pati

Aplikasi front-end untuk portal Smart City Kabupaten Pati, dibuat dengan React + TypeScript dan Vite. Menyediakan halaman informasi layanan publik, infrastruktur, kesehatan, lingkungan hidup, sosial media, dan autentikasi sederhana.

## Ringkasan

- **Nama proyek:** smart-city-kabupaten-pati
- **Tujuan:** Menyajikan informasi dan layanan smart city untuk warga Kabupaten Pati.
- **Stack:** React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion

## Struktur proyek (sekilas)

- `src/` - kode sumber aplikasi
  - `components/` - komponen UI (Navbar, Footer, ChatBot, dll.)
  - `pages/` - halaman aplikasi (Home, Infrastruktur, Kesehatan, dll.)
  - `data/` - data statis / konfigurasi

Lihat struktur lengkap di folder proyek.

## Prasyarat

- Node.js (disarankan versi LTS terbaru)
- npm atau pnpm atau yarn

> Saya menggunakan `vite` dan TypeScript; script ditentukan di [package.json](package.json).

## Instalasi dan menjalankan (lokal)

1. Install dependensi:

```bash
npm install
```

2. Jalankan server development:

```bash
npm run dev
```

3. Build untuk produksi:

```bash
npm run build
```

4. Menjalankan preview hasil build:

```bash
npm run preview
```

5. Menjalankan lint (ESLint):

```bash
npm run lint
```

## Dependensi utama

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

Informasi lengkap dependensi ada di [package.json](package.json).

## Deploy

Hasil build Vite berada di folder `dist/`. Untuk deploy ke GitHub Pages, Netlify, atau layanan hosting statis lain, unggah isi folder `dist/`. Contoh singkat untuk GitHub Pages:

```bash
npm run build
# gunakan gh-pages, netlify-cli, atau workflow GitHub Actions untuk deploy
```

## Cara push ke GitHub (cepat)

1. Inisialisasi repository (jika belum):

```bash
git init
git add .
git commit -m "chore: initial commit"
```

2. Tambahkan remote dan push (ganti URL dengan repo Anda):

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

## Kontribusi

Silakan buka issue atau kirim pull request. Ikuti gaya kode yang ada dan jalankan `npm run lint` sebelum submit.

## Kontak

Untuk pertanyaan atau bantuan, hubungi pembuat proyek.

## Lisensi

Lisensi: pilih lisensi yang sesuai (mis. MIT). Jika belum, tambahkan file `LICENSE`.

---

Jika mau, saya bisa tambahkan bagian Badges (CI), cara set environment, atau template GitHub Actions untuk deploy otomatis — mau saya tambahkan sekarang? 
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
