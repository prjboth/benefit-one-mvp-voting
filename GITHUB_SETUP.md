# วิธีอัปโหลดโปรเจกต์ขึ้น GitHub

## ขั้นตอนที่ 1: สร้าง Repository บน GitHub

1. ไปที่ [GitHub.com](https://github.com) และล็อกอิน
2. คลิกที่ปุ่ม **"+"** มุมขวาบน → เลือก **"New repository"**
3. ตั้งชื่อ repository เช่น `benefit-one-mvp-voting`
4. เลือก **Public** หรือ **Private** ตามต้องการ
5. **อย่า** check "Initialize this repository with a README" (เพราะเรามีไฟล์อยู่แล้ว)
6. คลิก **"Create repository"**

## ขั้นตอนที่ 2: เชื่อมต่อกับ GitHub

หลังจากสร้าง repository แล้ว GitHub จะแสดงคำสั่ง ให้ใช้คำสั่งเหล่านี้:

### ถ้า repository ยังว่าง (แนะนำ):

```bash
git remote add origin https://github.com/YOUR_USERNAME/benefit-one-mvp-voting.git
git branch -M main
git push -u origin main
```

### หรือถ้าใช้ SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/benefit-one-mvp-voting.git
git branch -M main
git push -u origin main
```

**หมายเหตุ:** แทนที่ `YOUR_USERNAME` ด้วย username GitHub ของคุณ

## ขั้นตอนที่ 3: Push โค้ดขึ้น GitHub

รันคำสั่ง:

```bash
git push -u origin main
```

ถ้าถูกถาม username และ password:
- Username: ใส่ username GitHub ของคุณ
- Password: ใช้ **Personal Access Token** (ไม่ใช่ password จริง)
  - สร้างได้ที่: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

## คำสั่งที่ใช้บ่อย

### ดูสถานะ
```bash
git status
```

### เพิ่มไฟล์ที่แก้ไข
```bash
git add .
```

### Commit การเปลี่ยนแปลง
```bash
git commit -m "คำอธิบายการเปลี่ยนแปลง"
```

### Push ขึ้น GitHub
```bash
git push
```

### ดึงโค้ดล่าสุดจาก GitHub
```bash
git pull
```

## หมายเหตุ

- โปรเจกต์นี้ใช้ LocalStorage เก็บข้อมูล (ไม่ต้องมี backend)
- ไฟล์ `node_modules` จะไม่ถูกอัปโหลด (อยู่ใน .gitignore)
- ต้องรัน `npm install` หลังจาก clone repository

