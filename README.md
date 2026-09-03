# 🚀 ExamHub — คลังข้อสอบและแบบฝึกหัดออนไลน์

> แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษาและสายไอที สรุปแนวข้อสอบ Data Science, Machine Learning, AWS Cloud, ISD, Medical Image, MIS และ Data Warehouse พร้อมเฉลยละเอียดเชิงลึก

🌐 **เข้าใช้งานได้ที่**: [https://exam-hub-seven.vercel.app/](https://exam-hub-seven.vercel.app/)

---

## 📱 คู่มือการติดตั้งเป็นแอปพลิเคชัน (PWA Installation Guide)

ExamHub รองรับเทคโนโลยี **Progressive Web App (PWA)** ทำให้ผู้ใช้สามารถ **"ติดตั้งเป็นแอปพลิเคชัน"** ลงบนคอมพิวเตอร์ แท็บเล็ต หรือสมาร์ตโฟนได้โดยตรง โดย**ไม่ต้องดาวน์โหลดผ่าน App Store หรือ Google Play Store**

### 🌟 ข้อดีของการติดตั้งเป็นแอป
* ⚡ **เปิดใช้งานได้ทันที**: เข้าสู่ระบบและทำข้อสอบได้รวดเร็วกว่าเดิม ไม่ต้องคอยพิมพ์ URL หรือค้นหาในบุ๊กมาร์ก
* 📶 **รองรับโหมดออฟไลน์**: Service Worker จะทำการ Pre-cache ข้อมูลข้อสอบ ฟอนต์ และสไตล์ ทำให้ยังคงเปิดอ่านและฝึกทำข้อสอบได้ต่อเนื่องแม้สัญญาณอินเทอร์เน็ตไม่เสถียร
* 🖥️ **หน้าต่างแอปเดี่ยว (Standalone Window)**: แสดงผลเต็มหน้าจอ ไร้แถบ URL หรือแท็บเบราว์เซอร์กวนใจ มอบประสบการณ์เสมือน Native Application
* 💾 **ประหยัดพื้นที่อุปกรณ์**: ใช้พื้นที่จัดเก็บน้อยกว่าแอปทั่วไปในสโตร์หลายเท่าตัว

---

### 💻 1. วิธีติดตั้งบนคอมพิวเตอร์ (Windows / macOS / Linux)

> **เบราว์เซอร์ที่แนะนำ**: Google Chrome หรือ Microsoft Edge

* **วิธีที่ 1 (ผ่านปุ่มแนะนำในหน้าเว็บ)**:
  1. เปิดเว็บไซต์ [ExamHub](https://exam-hub-seven.vercel.app/)
  2. รอประมาณ 3 วินาที จะมีแถบสีม่วงปรากฏที่มุมขวาล่างว่า **"ติดตั้งแอป ExamHub"**
  3. คลิกปุ่ม **"ติดตั้งทันที"** แล้วคลิก **"Install" (ติดตั้ง)** ในกล่องยืนยันของเบราว์เซอร์
* **วิธีที่ 2 (ผ่านแถบ URL / Address Bar)**:
  1. สังเกตที่ด้านขวาสุดของช่องพิมพ์ URL ด้านบน
  2. คลิกที่ไอคอน **หน้าจอคอมพิวเตอร์ 🖥️** หรือ **เครื่องหมายบวก (+)** (จะมีข้อความแสดงว่า *Install ExamHub* หรือ *ติดตั้ง ExamHub*)
  3. กดยืนยัน **"Install"** แอปจะเปิดขึ้นมาในหน้าต่างใหม่พร้อมใช้งานทันที

---

### 🤖 2. วิธีติดตั้งบนสมาร์ตโฟนและแท็บเล็ต Android

> **เบราว์เซอร์ที่แนะนำ**: Google Chrome

1. เปิดเว็บไซต์ [ExamHub](https://exam-hub-seven.vercel.app/) บนเบราว์เซอร์ Chrome
2. จะมีป๊อปอัปแจ้งเตือนที่ขอบล่างหน้าจอ ให้แตะปุ่ม **"ติดตั้งทันที"** หรือ **"เพิ่มลงในหน้าจอหลัก"**
3. *กรณีป๊อปอัปไม่แสดง*:
   * แตะที่ปุ่ม **จุด 3 จุด (⋮)** ที่มุมขวาบนของเบราว์เซอร์ Chrome
   * เลือกเมนู **"ติดตั้งแอป" (Install app)** หรือ **"เพิ่มลงในหน้าจอหลัก" (Add to Home screen)**
   * กดยืนยันการติดตั้ง
4. ไอคอน ExamHub จะปรากฏบนหน้าจอหลัก (Home Screen) ของคุณ สามารถแตะเพื่อเปิดใช้งานได้เสมือนแอปพลิเคชันทั่วไป

---

### 🍏 3. วิธีติดตั้งบน iPhone และ iPad (iOS / iPadOS)

> **เบราว์เซอร์ที่ต้องใช้**: Safari เท่านั้น (ตามมาตรฐานของระบบ iOS)

1. เปิดเว็บไซต์ [ExamHub](https://exam-hub-seven.vercel.app/) ด้วยเบราว์เซอร์ **Safari**
2. แตะปุ่ม **แชร์ (Share)** ที่แถบเครื่องมือด้านล่าง (ไอคอนสี่เหลี่ยมที่มีลูกศรชี้ขึ้น `⎋`)
3. เลื่อนรายการคำสั่งลงมาด้านล่าง แล้วเลือก **"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)**
4. ตรวจสอบชื่อแอปพลิเคชัน จากนั้นแตะปุ่ม **"เพิ่ม" (Add)** ที่มุมขวาบน
5. ไอคอน ExamHub จะถูกเพิ่มลงในหน้าจอโฮมของอุปกรณ์ พร้อมเปิดใช้งานแบบเต็มหน้าจอทันที

---

## ✨ ฟีเจอร์เด่นของระบบ (Key Features)

* **คลังข้อสอบแยกตามระดับชั้นปีและหมวดหมู่วิชา**: รวบรวมแนวข้อสอบ Midterm และ Final ตรงตามหลักสูตรมหาวิทยาลัย (ISD, Machine Learning, AWS Cloud, Data Warehouse, Medical Image, MIS ฯลฯ)
* **ระบบทำข้อสอบที่สมบูรณ์**: จับเวลาเสมือนจริง, Question Navigator สำหรับกระโดดข้ามข้อ, และระบบ Bookmark ปักหมุดข้อที่ต้องการทบทวน
* **เฉลยละเอียดแบบ Step-by-Step**: รองรับสูตรคณิตศาสตร์ด้วย KaTeX และโค้ดบล็อกไฮไลต์
* **ระบบวิเคราะห์ทักษะ (Skill Assessment)**: บันทึกคะแนนและคำนวณสถิติความเชี่ยวชาญในแต่ละหมวดวิชา แสดงผลเป็น Radar Chart
* **ระบบรายงานและรับฟังข้อเสนอแนะ**: ส่งข้อร้องเรียนข้อสอบผิด หรือขอเพิ่มรายวิชาใหม่ พร้อมหน้า Admin Dashboard สำหรับผู้ดูแลระบบ
* **Dark / Light Theme**: สลับธีมมืดและสว่างได้อย่างราบรื่น พร้อมเอฟเฟกต์ Aurora Background และ Border Glow

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vite.dev/), [Lucide React](https://lucide.dev/)
* **PWA**: `vite-plugin-pwa`, Workbox Pre-caching, Web App Manifest
* **Database & Auth**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Row Level Security)
* **Data Visualization & Math**: [Recharts](https://recharts.org/), [KaTeX](https://katex.org/), `react-katex`, `mathjs`
* **Styling**: Modern CSS Variables, Glassmorphism, [OGL](https://github.com/oframe/ogl) (WebGL Aurora)
* **Performance & SEO**: OpenGraph, Twitter Cards, JSON-LD Structured Data, Vercel Speed Insights, Oxlint

---

## 🚀 เริ่มต้นพัฒนาบนเครื่อง (Development Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. กำหนดค่าตัวแปรสภาพแวดล้อม (Environment Variables)
สร้างไฟล์ `.env` ที่โฟลเดอร์รากของโปรเจกต์:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. รันโปรเจกต์ในโหมด Development
```bash
npm run dev
```

### 4. ตรวจสอบโค้ด (Linting)
```bash
npm run lint
```

### 5. บิลด์สำหรับ Production & ทดสอบ PWA
```bash
npm run build
npm run preview
```
เปิดบราวเซอร์ไปที่ `http://localhost:4173/` เพื่อทดสอบการทำงานของ PWA และ Service Worker

---

## 👨‍💻 ผู้พัฒนา (Developer)
* **Pawarit** - Lead Developer & Creator
  * Portfolio: [https://dewdew978.github.io/portfolio/](https://dewdew978.github.io/portfolio/)

---

## 📄 ใบอนุญาต (License)
สงวนลิขสิทธิ์ © ExamHub Project. รายละเอียดเพิ่มเติมดูได้ที่หน้า Terms of Service & Privacy Policy ภายในแอปพลิเคชัน
