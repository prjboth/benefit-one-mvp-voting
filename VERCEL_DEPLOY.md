# วิธี Deploy บน Vercel

## ขั้นตอนการ Deploy

### 1. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)

```bash
npm i -g vercel
```

### 2. Login Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# Deploy
vercel

# หรือ Deploy production
vercel --prod
```

### 4. หรือ Deploy ผ่านเว็บ

1. ไปที่ [vercel.com](https://vercel.com)
2. คลิก **"Add New Project"**
3. Import repository `prjboth/benefit-one-mvp-voting`
4. Vercel จะ detect อัตโนมัติ
5. คลิก **"Deploy"**

## สิ่งที่ต้องรู้

### API Routes
- API routes อยู่ในโฟลเดอร์ `api/`
- Vercel จะแปลงเป็น Serverless Functions อัตโนมัติ
- URL: `https://your-app.vercel.app/api/members`

### Frontend
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

### Environment Variables
ตั้งค่าใน Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-app.vercel.app/api
```

### ข้อจำกัด

**สำคัญ:** Vercel Serverless Functions ไม่สามารถเขียนไฟล์ได้ถาวร (read-only filesystem)

**วิธีแก้:**
1. ใช้ Vercel KV (Key-Value store) - ฟรี
2. ใช้ Supabase / Firebase
3. ใช้ MongoDB Atlas (ฟรี tier)

## ใช้ Vercel KV (แนะนำ)

### 1. ติดตั้ง Vercel KV

```bash
npm install @vercel/kv
```

### 2. สร้าง KV Database
- ไปที่ Vercel Dashboard → Storage → Create Database
- เลือก KV
- Copy connection string

### 3. ตั้งค่า Environment Variable
```
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-token
```

### 4. แก้ไข API functions ให้ใช้ KV

ดูตัวอย่างใน `api/members-kv.js` (จะสร้างให้)

## Alternative: ใช้ Supabase (แนะนำมาก)

Supabase ให้ PostgreSQL database ฟรี และง่ายกว่า

1. สร้าง account ที่ [supabase.com](https://supabase.com)
2. สร้าง project ใหม่
3. Copy connection string
4. ใช้ Supabase client ใน API functions

## หมายเหตุ

- ข้อมูลจะ reset เมื่อ cold start (ถ้าใช้ in-memory)
- ควรใช้ database จริงสำหรับ production
- Vercel มี free tier ที่ดีมาก

