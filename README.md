# Benefit-One MVP Voting System

ระบบโหวต MVP ของ Benefit-One ที่ให้ผู้ใช้แจกคะแนนสูงสุด 100 คะแนนต่อคน

## ✨ ฟีเจอร์

- ✅ **ระบบโหวต**: แจกคะแนนสูงสุด 100 คะแนนต่อผู้โหวต
- ✅ **ผลการโหวต**: แสดงอันดับ Top 3 พร้อม Animation
- ✅ **Import รายชื่อ**: เพิ่มรายชื่อสมาชิกพร้อมอัปโหลดรูปภาพ
- ✅ **ระบบ Logging**: บันทึกทุกการให้คะแนน
- ✅ **2 ภาษา**: รองรับภาษาไทยและอังกฤษ
- ✅ **Password Protection**: ป้องกันหน้า Results และ Import
- ✅ **Server-side Storage**: เก็บข้อมูลบน server (JSON files)
- ✅ **Vercel Ready**: พร้อม deploy บน Vercel

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend (in another terminal)
cd server
npm install
npm run dev
```

### Deploy on Vercel

1. Push code ขึ้น GitHub
2. ไปที่ [vercel.com](https://vercel.com)
3. Import repository
4. Deploy! (ดู [DEPLOY_NOW.md](./DEPLOY_NOW.md) สำหรับคำแนะนำละเอียด)

## 📁 โครงสร้างโปรเจกต์

```
MVP/
├── api/                 # Vercel Serverless Functions
│   ├── members.js
│   ├── votes.js
│   ├── results.js
│   └── vote-logs.js
├── server/              # Backend server (for local dev)
│   ├── server.js
│   └── utils.js
├── src/
│   ├── pages/           # React pages
│   ├── components/      # React components
│   └── utils/           # Utilities (API, i18n, storage)
└── dist/                # Build output
```

## 🔧 Configuration

### Environment Variables

สร้างไฟล์ `.env`:

```
VITE_API_URL=http://localhost:3001/api
```

สำหรับ Vercel: ไม่ต้องตั้งค่า (จะ auto-detect)

## 📚 Documentation

- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - วิธี deploy บน Vercel
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deploy guide
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Vercel deployment details
- [README_SERVER.md](./server/README.md) - Server documentation

## 🎯 API Endpoints

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

## 🔐 Security

- Password protection สำหรับหน้า Results และ Import
- Default password: `0909`

## 🌐 Technologies

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Express.js, Vercel Serverless Functions
- **Storage:** JSON files (local) / Vercel KV (production)
- **Font:** IBM Plex Sans Thai

## 📝 License

MIT

## 🔗 Links

- GitHub: https://github.com/prjboth/benefit-one-mvp-voting
- Vercel: (หลังจาก deploy)

---

**พร้อมใช้งานแล้ว! 🎉**
