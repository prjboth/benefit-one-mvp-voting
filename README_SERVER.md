# Server Setup Guide

## วิธีรัน Backend Server

### 1. ติดตั้ง Dependencies

```bash
cd server
npm install
```

### 2. รัน Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server จะรันที่ `http://localhost:3001`

## ข้อมูลเก็บใน JSON Files

ข้อมูลจะถูกเก็บในโฟลเดอร์ `server/data/`:
- `members.json` - รายชื่อสมาชิก
- `votes.json` - การโหวตทั้งหมด
- `logs.json` - Log การให้คะแนน

## API Endpoints

### Members
- `GET /api/members` - ดึงรายชื่อสมาชิกทั้งหมด
- `POST /api/members` - เพิ่มสมาชิกใหม่
- `PUT /api/members/:id` - แก้ไขสมาชิก
- `DELETE /api/members/:id` - ลบสมาชิก

### Votes
- `GET /api/votes` - ดึงการโหวตทั้งหมด
- `POST /api/votes` - ส่งการโหวต
- `DELETE /api/votes` - รีเซ็ตการโหวตทั้งหมด

### Results
- `GET /api/results` - ดึงผลการโหวต (Top 3 เท่านั้น)

### Logs
- `GET /api/vote-logs` - ดึง logs ทั้งหมด (100 รายการล่าสุด)
- `GET /api/vote-logs/:voteId` - ดึง logs ของการโหวตเฉพาะ

## Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/`:

```
PORT=3001
```

## Frontend Configuration

ในไฟล์ `.env` ของ frontend (หรือ `vite.config.js`):

```
VITE_API_URL=http://localhost:3001/api
```

## Deploy

### Vercel / Netlify

1. Deploy frontend ตามปกติ
2. Deploy backend แยก (ใช้ Vercel Serverless Functions หรือ Railway, Render)

### Railway / Render (แนะนำ)

1. Push code ขึ้น GitHub
2. สร้าง project ใหม่บน Railway/Render
3. Connect GitHub repository
4. Set root directory เป็น `server/`
5. Deploy

