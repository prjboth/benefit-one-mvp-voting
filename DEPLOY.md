# วิธี Deploy โปรเจกต์ Benefit-One MVP Voting บนเว็บ

มีหลายวิธีในการ deploy โปรเจกต์ React + Vite นี้ให้ใช้งานบนเว็บได้:

## 🚀 วิธีที่ 1: Vercel (แนะนำ - ง่ายที่สุด)

### ขั้นตอน:
1. ไปที่ [vercel.com](https://vercel.com) และล็อกอินด้วย GitHub account
2. คลิก **"Add New Project"**
3. เลือก repository `prjboth/benefit-one-mvp-voting`
4. Vercel จะ detect อัตโนมัติว่าเป็น Vite project
5. คลิก **"Deploy"** (ไม่ต้องเปลี่ยน settings)
6. รอสักครู่ Vercel จะ build และ deploy ให้อัตโนมัติ
7. จะได้ URL เช่น: `https://benefit-one-mvp-voting.vercel.app`

### ข้อดี:
- ✅ ฟรี
- ✅ Deploy อัตโนมัติทุกครั้งที่ push ขึ้น GitHub
- ✅ HTTPS อัตโนมัติ
- ✅ เร็วมาก

---

## 🌐 วิธีที่ 2: Netlify

### ขั้นตอน:
1. ไปที่ [netlify.com](https://netlify.com) และล็อกอินด้วย GitHub
2. คลิก **"Add new site"** → **"Import an existing project"**
3. เลือก repository `prjboth/benefit-one-mvp-voting`
4. ตั้งค่า:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. คลิก **"Deploy site"**

### ข้อดี:
- ✅ ฟรี
- ✅ Deploy อัตโนมัติ
- ✅ HTTPS อัตโนมัติ

---

## 📄 วิธีที่ 3: GitHub Pages

### ขั้นตอน:
1. แก้ไข `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/benefit-one-mvp-voting/' // เปลี่ยนเป็นชื่อ repo ของคุณ
})
```

2. สร้างไฟล์ `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. ไปที่ GitHub repository → Settings → Pages
4. เลือก Source: **GitHub Actions**
5. Push โค้ดขึ้น GitHub จะ deploy อัตโนมัติ

### URL:
`https://prjboth.github.io/benefit-one-mvp-voting/`

---

## ⚡ วิธีที่ 4: GitHub Codespaces (Run ใน Browser)

### ขั้นตอน:
1. ไปที่ repository บน GitHub
2. คลิก **"Code"** → **"Codespaces"** → **"Create codespace on main"**
3. รอให้ Codespace เปิดขึ้นมา
4. เปิด Terminal และรัน:
```bash
npm install
npm run dev
```
5. คลิกที่ URL ที่แสดงใน terminal

### ข้อดี:
- ✅ Run ได้ทันทีใน browser
- ✅ ไม่ต้องติดตั้งอะไร
- ✅ ฟรี (มี quota)

---

## 📝 หมายเหตุสำคัญ

### สำหรับ Vercel และ Netlify:
- ต้องแก้ไข `vite.config.js` เพื่อรองรับ React Router:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ไม่ต้องเพิ่ม base สำหรับ Vercel/Netlify
})
```

### สำหรับ GitHub Pages:
- ต้องเพิ่ม `base` ใน `vite.config.js` (ดูข้างบน)
- React Router ต้องใช้ HashRouter แทน BrowserRouter

---

## 🎯 แนะนำ

**ใช้ Vercel** เพราะ:
- ง่ายที่สุด
- ไม่ต้อง config อะไร
- Deploy อัตโนมัติ
- เร็วและเสถียร

---

## 🔗 หลังจาก Deploy แล้ว

โปรเจกต์จะสามารถเข้าถึงได้ผ่าน URL ที่ได้ และ:
- ✅ ใช้งานได้เหมือนรัน local
- ✅ ข้อมูลจะเก็บใน LocalStorage ของแต่ละ browser
- ✅ รองรับ 2 ภาษา (ไทย/อังกฤษ)
- ✅ Password protection ทำงานปกติ

