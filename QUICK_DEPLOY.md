# 🚀 Quick Deploy to Vercel

## วิธี Deploy (ง่ายที่สุด)

### 1. Push code ขึ้น GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Deploy บน Vercel

**วิธีที่ 1: ผ่านเว็บ (แนะนำ)**
1. ไปที่ [vercel.com](https://vercel.com)
2. คลิก **"Add New Project"**
3. เลือก repository `prjboth/benefit-one-mvp-voting`
4. Vercel จะ detect อัตโนมัติ:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **ไม่ต้องตั้งค่า Environment Variables** (จะ auto-detect)
6. คลิก **"Deploy"**
7. รอสักครู่ จะได้ URL เช่น: `https://benefit-one-mvp-voting.vercel.app`

**วิธีที่ 2: ผ่าน CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

## ✅ หลังจาก Deploy

1. **ทดสอบ API:**
   - ไปที่ `https://your-app.vercel.app/api/members`
   - ควรเห็น `[]` (empty array)

2. **ทดสอบ Frontend:**
   - ไปที่ `https://your-app.vercel.app`
   - ควรเห็นหน้าโหวต

## ⚠️ ข้อจำกัดสำคัญ

**ข้อมูลจะ reset เมื่อ cold start** เพราะ Vercel Serverless Functions ใช้ `/tmp` ที่เป็น ephemeral storage

### วิธีแก้ (เลือก 1 วิธี):

#### 1. ใช้ Vercel KV (แนะนำ - ฟรี)
```bash
# ติดตั้ง
npm install @vercel/kv

# สร้าง KV Database
# ไปที่ Vercel Dashboard → Storage → Create KV Database
# Copy connection details
```

#### 2. ใช้ Supabase (แนะนำมาก - ฟรี)
- สร้าง account ที่ [supabase.com](https://supabase.com)
- สร้าง project
- ใช้ Supabase client แทน JSON files

#### 3. ใช้ MongoDB Atlas (ฟรี tier)
- สร้าง account ที่ [mongodb.com](https://mongodb.com)
- สร้าง free cluster
- ใช้ MongoDB driver

## 📝 หมายเหตุ

- API routes อยู่ใน `api/` folder
- Vercel จะแปลงเป็น Serverless Functions อัตโนมัติ
- Frontend จะ build เป็น static files
- Deploy อัตโนมัติทุกครั้งที่ push ขึ้น GitHub

## 🔗 URLs

- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/members`
- Results: `https://your-app.vercel.app/api/results`

