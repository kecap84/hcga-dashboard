# HCGA Dashboard - GitHub Pages Deployment

## 🚀 **CARA HOSTING DI GITHUB**

### **Metode 1: Vercel (Recommended untuk Full-Stack)**

**Step 1: Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit - HCGA Dashboard Complete"
git branch -M main
git remote add origin https://github.com/YANFIRDAUS/hcga-dashboard.git
git push -u origin main
```

**Step 2: Deploy ke Vercel**
1. Buka [vercel.com](https://vercel.com)
2. Login dengan akun GitHub
3. Klik "New Project"
4. Pilih repository `hcga-dashboard`
5. Vercel akan otomatis mendeteksi Next.js
6. Klik "Deploy"

**Keuntungan Vercel:**
- ✅ API Routes berfungsi penuh
- ✅ Database SQLite berjalan
- ✅ Upload file berfungsi
- ✅ Auto SSL dan CDN
- ✅ Gratis untuk project kecil

---

### **Metode 2: GitHub Pages (Static Only)**

**⚠️ Limitasi:**
- API Routes tidak berfungsi
- Database tidak tersimpan
- Upload file tidak berfungsi
- Hanya untuk demo/tampilan

**Step 1: Build Static Export**
```bash
npm run build
```

**Step 2: Deploy Manual**
1. Folder `out/` akan dibuat
2. Upload folder `out` ke GitHub Pages
3. Atau gunakan GitHub Actions (otomatis)

**Step 3: GitHub Settings**
1. Buka repository GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: gh-pages
5. Folder: /root

---

### **Metode 3: Netlify**

**Step 1: Build**
```bash
npm run build
```

**Step 2: Deploy**
1. Buka [netlify.com](https://netlify.com)
2. Drag & drop folder `out`
3. Atau connect GitHub repository

---

## 🎯 **RECOMMENDASI**

**Untuk Production Use: Vercel**
- Full functionality
- Auto deployment
- Serverless functions
- Database support

**Untuk Demo/Portfolio: GitHub Pages**
- Static only
- Free hosting
- GitHub integration

**Untuk Custom Domain: Netlify**
- Custom domain gratis
- Form handling
- Edge functions

---

## 📋 **CHECKLIST DEPLOYMENT**

### Sebelum Deploy:
- [ ] Test semua fitur di local
- [ ] Run `npm run lint` (no errors)
- [ ] Update environment variables
- [ ] Optimize images

### Setelah Deploy:
- [ ] Test semua halaman
- [ ] Test responsive design
- [ ] Test form submissions
- [ ] Test file uploads
- [ ] Check SEO meta tags

---

## 🔧 **TROUBLESHOOTING**

### Common Issues:

**1. Build Error di Vercel**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. API Routes tidak berfungsi di GitHub Pages**
- Gunakan Vercel atau Netlify
- Atau konversi ke static site

**3. File Upload tidak berfungsi**
- Gunakan Vercel untuk serverless functions
- Atau gunakan external service (Cloudinary, AWS S3)

**4. Database tidak tersimpan**
- GitHub Pages tidak support database
- Gunakan Vercel dengan external database (PostgreSQL, MongoDB)

---

## 🌐 **DOMAIN CUSTOM**

### Vercel:
1. Dashboard → Domains
2. Add custom domain
3. Update DNS records

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records

### GitHub Pages:
1. Settings → Pages
2. Custom domain
3. Update DNS records

---

## 📊 **MONITORING**

### Vercel Analytics:
- Real-time visitors
- Performance metrics
- Error tracking

### Netlify Analytics:
- Page views
- Bandwidth usage
- Form submissions

### Google Analytics:
- Add tracking code
- Monitor traffic
- User behavior

---

## 🚀 **NEXT STEPS**

1. **Pilih hosting platform** (Vercel recommended)
2. **Push ke GitHub**
3. **Deploy ke platform**
4. **Test production**
5. **Setup custom domain** (optional)
6. **Monitor performance**

---

## 📞 **SUPPORT**

Jika ada masalah deployment:
- 📧 Email: hr@hcga.com
- 📱 WhatsApp: +62 812-3456-7890
- 🌐 Website: hcga-dashboard.vercel.app

---

**© 2024 Yan Firdaus - HCGA 3S-GSM Dashboard**