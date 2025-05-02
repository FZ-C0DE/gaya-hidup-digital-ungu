
# TechHabit Tracker

## Tentang Aplikasi

TechHabit Tracker adalah aplikasi pelacak kebiasaan dan produktivitas yang dirancang untuk membantu pengguna membangun kebiasaan teknologi yang baik. Aplikasi ini berfokus pada kebiasaan-kebiasaan terkait teknologi, pengembangan diri, dan produktivitas.

## Fitur Utama

- **Pelacak Kebiasaan**: Lacak kebiasaan harian dan mingguan Anda dengan mudah.
- **Kalender**: Lihat kemajuan Anda dalam tampilan kalender yang interaktif.
- **Tugas**: Kelola daftar tugas dengan prioritas yang berbeda.
- **Wawasan**: Dapatkan analisis tentang kemajuan dan konsistensi Anda.

## Teknologi yang Digunakan

Aplikasi ini dibangun dengan menggunakan:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- react-router-dom
- recharts (untuk visualisasi data)
- uuid (untuk pengelolaan ID unik)

## Cara Menjalankan Aplikasi

### Persyaratan

- Node.js versi terbaru
- npm atau yarn

### Langkah-langkah

1. Clone repositori ini:
   ```
   git clone [URL_REPOSITORI]
   ```

2. Masuk ke direktori proyek:
   ```
   cd techhabit-tracker
   ```

3. Install dependensi:
   ```
   npm install
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```
   npm run dev
   ```

5. Buka aplikasi di browser:
   ```
   http://localhost:8080
   ```

## Cara Deploy ke Vercel

1. Pastikan Anda memiliki akun di [Vercel](https://vercel.com)
2. Hubungkan repositori GitHub Anda dengan Vercel
3. Klik tombol "New Project" di dashboard Vercel
4. Pilih repositori aplikasi ini
5. Konfigurasi sudah otomatis disetel dengan file `vercel.json`
6. Klik "Deploy"

## Struktur Proyek

```
/src
  /components       # Komponen-komponen React
    /Layout         # Komponen tata letak (Navbar, AppLayout)
    /ui             # Komponen UI yang dapat digunakan kembali
  /lib              # Fungsi utilitas dan tipe data
  /pages            # Halaman-halaman aplikasi
  /hooks            # Custom React hooks
```

## Pengembangan Selanjutnya

- Implementasi sistem autentikasi
- Sinkronisasi data dengan cloud
- Notifikasi dan pengingat
- Dukungan tema gelap/terang
- Versi aplikasi mobile

## Lisensi

MIT License
