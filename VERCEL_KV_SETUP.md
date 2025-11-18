# 🗄️ Vercel KV Setup Guide

## ขั้นตอนการตั้งค่า Vercel KV

### 1. สร้าง KV Database ใน Vercel Dashboard

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Project: `benefit-one-mvp-voting`
3. ไปที่ Tab **"Storage"**
4. คลิก **"Create Database"**
5. เลือก **"KV"** (Key-Value)
6. ตั้งชื่อ Database (เช่น: `mvp-voting-kv`)
7. เลือก Region (แนะนำ: `Southeast Asia (Singapore)` หรือใกล้ที่สุด)
8. คลิก **"Create"**

### 2. ตั้งค่า Environment Variables

Vercel จะสร้าง Environment Variables อัตโนมัติ:

- `KV_REST_API_URL` - URL สำหรับ REST API
- `KV_REST_API_TOKEN` - Token สำหรับ authentication
- `KV_REST_API_READ_ONLY_TOKEN` - Read-only token (optional)

**ตรวจสอบว่า Environment Variables ถูกตั้งค่าแล้ว:**
1. ไปที่ Project Settings → Environment Variables
2. ตรวจสอบว่ามี `KV_REST_API_URL` และ `KV_REST_API_TOKEN`
3. ถ้ายังไม่มี ให้ไปที่ Storage → Database → Settings → Copy credentials

### 3. Deploy ใหม่

หลังจากตั้งค่า KV แล้ว:

1. **Auto Deploy:** Vercel จะ auto-deploy เมื่อ push code ใหม่
2. **Manual Deploy:** ไปที่ Deployments → คลิก "Redeploy" (ถ้าต้องการ)

### 4. ตรวจสอบการทำงาน

1. เปิดเว็บไซต์: `https://benefit-one-mvp-voting.vercel.app`
2. ไปที่หน้า Config → เพิ่มสมาชิก
3. ไปที่หน้า Vote → โหวต
4. ไปที่หน้า Results → ตรวจสอบว่าผลแสดงถูกต้อง
5. ไปที่หน้า Config → Tab Logs → ตรวจสอบว่า logs แสดงถูกต้อง

---

## ✅ ข้อดีของ Vercel KV

- ✅ **Persistent Storage** - ข้อมูลไม่หายเมื่อ cold start
- ✅ **Shared Across Functions** - ข้อมูล share กันระหว่าง functions
- ✅ **Fast** - Low latency
- ✅ **Free Tier** - ฟรีสำหรับการใช้งานเบื้องต้น
- ✅ **Easy Setup** - ตั้งง่าย ไม่ต้อง config ซับซ้อน

---

## 🔍 Troubleshooting

### Problem: `KV_REST_API_URL is not defined`

**Solution:**
1. ตรวจสอบว่า Environment Variables ถูกตั้งค่าใน Vercel Dashboard
2. ตรวจสอบว่า Variables ถูกตั้งค่าสำหรับ Production, Preview, และ Development
3. Redeploy project

### Problem: `Unauthorized` หรือ `401` error

**Solution:**
1. ตรวจสอบว่า `KV_REST_API_TOKEN` ถูกต้อง
2. ตรวจสอบว่า Token ไม่ได้ expire
3. สร้าง Token ใหม่ใน KV Database Settings

### Problem: ข้อมูลยังไม่แสดง

**Solution:**
1. ตรวจสอบ Vercel Function Logs
2. ตรวจสอบว่า KV Database ถูกสร้างแล้ว
3. ตรวจสอบว่า Environment Variables ถูกตั้งค่าแล้ว
4. Redeploy project

---

## 📝 หมายเหตุ

- Vercel KV ใช้ **REST API** สำหรับการเข้าถึงข้อมูล
- ข้อมูลจะถูกเก็บใน **Redis** (managed by Vercel)
- Free tier มี **512 MB storage** และ **30,000 requests/day**
- ข้อมูลจะ **persist** แน่นอน ไม่หายเมื่อ cold start

---

## 🔗 Links

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel KV Pricing](https://vercel.com/docs/storage/vercel-kv#pricing)

---

**Happy Coding! 🚀**

