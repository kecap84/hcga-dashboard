# HCGA 3S-GSM Dashboard

Sistem Manajemen Sumber Daya Manusia modern yang dibuat dengan Next.js 15, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

### 📊 Dashboard Utama
- Grid menu dengan 5 modul utama
- Statistik real-time (cuti, training, karyawan, dokumen)
- Dark/Light mode toggle
- Responsive design untuk desktop dan mobile
- Sidebar navigasi untuk mobile

### 📝 Modul Pengajuan Cuti
- Form lengkap dengan 19 field input
- Validasi otomatis
- Upload dokumen PDF
- Riwayat pengajuan dengan status tracking
- 5 jenis cuti (Periodik, Tahunan, Emergency, Dinas Luar, Ijin PP)

### 🎓 Modul Pengajuan Training
- Form input data karyawan lengkap
- 3 kategori training (Mandatory, Pengembangan, Perpanjangan Sertifikasi)
- Upload dokumen pendukung
- Riwayat pengajuan dengan status

### 👥 Modul Data Karyawan
- Tabel data karyawan dengan 9 kolom
- Fitur pencarian dan filter by departemen
- CRUD operations (Tambah, Edit, Hapus)
- Export ke CSV

### 📁 Modul Pusat Dokumen
- 4 kategori dokumen (SOP, IK, Internal Memo, Template Form)
- Upload/download file
- Sub folder organization
- Grid view dengan file type icons

### 📞 Modul Kontak HR/Helpdesk
- Form kontak lengkap
- Informasi kontak dan jam operasional
- Topik bantuan terorganisir

### ⚙️ Modul Admin
- Pengaturan website tanpa coding
- Customisasi warna tema
- Font selection
- Manajemen konten dinamis

## 🛠️ Teknologi

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), dapat diupgrade ke PostgreSQL
- **Authentication**: NextAuth.js (ready to implement)
- **Deployment**: Vercel, Netlify, atau GitHub Pages

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Git

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/username/hcga-dashboard.git
cd hcga-dashboard

# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev

# Buka http://localhost:3000
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository GitHub Anda
4. Klik Deploy

### Netlify
```bash
# Build untuk production
npm run build

# Deploy folder .out ke Netlify
```

### GitHub Pages
```bash
# Build static export
npm run build

# Folder .out siap di-deploy ke GitHub Pages
```

## 📁 Struktur Project

```
src/
├── app/                    # App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── data-karyawan/     # Data karyawan
│   ├── kontak-hr/         # Kontak HR
│   ├── pengajuan-cuti/    # Pengajuan cuti
│   ├── pengajuan-training/# Pengajuan training
│   ├── pusat-dokumen/     # Pusat dokumen
│   └── page.tsx           # Dashboard utama
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/                # Custom hooks
├── lib/                  # Utilities dan database
└── styles/               # Global styles
```

## 🎨 Customization

### Mengubah Warna Tema
Buka halaman `/admin` untuk mengubah:
- Warna primer, sekunder, dan aksen
- Font family
- Konten website

### Database Configuration
Edit `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

## 📱 Screenshots

*Tambah screenshot aplikasi Anda di sini*

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

© 2024 Yan Firdaus - HCGA 3S-GSM Dashboard

## 🆘 Support

Jika ada pertanyaan atau masalah, silakan hubungi:
- Email: hr@hcga.com
- Telepon: (021) 1234-5678