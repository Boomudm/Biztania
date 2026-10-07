# Deploy Eco-Alert ขึ้น Vercel

โปรเจกต์นี้ deploy บน Vercel เป็น 2 ส่วนภายใต้ domain เดียวกัน:

- Vite build ใน `dist/` เป็น static frontend
- ไฟล์ใน `api/` เป็น Vercel Functions สำหรับ `/api/health`, `/api/analyze` และ `/api/submit`

จึงไม่ต้องเปิด Express port ค้าง และ frontend ยังเรียก `/api/*` ด้วย URL เดิม

## ขั้นตอนผ่าน Vercel Dashboard

1. Push branch `main` ขึ้น GitHub
2. เข้า Vercel แล้วเลือก **Add New → Project**
3. Import repository `Boomudm/Biztania`
4. Vercel จะอ่านค่าจาก `vercel.json` โดยใช้ Vite, `npm run build` และ output directory `dist`
5. เพิ่ม Environment Variables
6. กด **Deploy**
7. หลัง deploy เปิด `/api/health` และตรวจว่าตอบ `ok: true`

## Environment Variables

ตั้งใน **Project Settings → Environment Variables** และเลือก Production/Preview ตามต้องการ ห้ามใส่ secret ลง GitHub

| Key | ค่าแนะนำ | จำเป็นหรือไม่ |
|---|---|---|
| `DEMO_MODE` | `true` | แนะนำสำหรับวันนำเสนอ |
| `OPENAI_API_KEY` | API key จริง | ไม่จำเป็น ระบบ fallback เป็น mock ได้ |
| `OPENAI_MODEL` | `gpt-4.1-mini` | ไม่จำเป็น |
| `TRAFFY_LIVE` | `false` | แนะนำจนกว่าจะมี API จริง |
| `TRAFFY_API_BASE_URL` | URL ของ API | ใช้เมื่อ `TRAFFY_LIVE=true` |
| `TRAFFY_API_KEY` | API key | ใช้เมื่อ API ต้องยืนยันตัวตน |

ไม่ต้องตั้ง `PORT` เพราะ Vercel เรียก API เป็น Functions ไม่ได้รัน `npm start`

## Checklist ก่อนวัน Demo

- หน้าแรกเปิดได้และ refresh route ย่อยไม่เป็น 404
- `/api/health` ตอบ `ok: true`
- `/api/analyze` ทำงานใน Demo Mode แม้ไม่มี OpenAI key
- ทดลองครบ 3 เคส PB-024, PB-031 และ PB-041
- ตรวจว่า GitHub ไม่มี `.env` หรือ API key
- เปิดเว็บ Production บนอุปกรณ์ที่จะใช้ present

## หาก Deploy ไม่ผ่าน

- **Build failed:** เปิด Build Logs และทดสอบ `npm ci`, `npm run build`, `npm test` ในเครื่อง
- **หน้าเว็บ 404 เมื่อ refresh:** ตรวจว่า Vercel ใช้ `vercel.json` จาก repository root
- **API 404:** ตรวจว่าไฟล์ `api/health.ts`, `api/analyze.ts`, `api/submit.ts` อยู่ใน deployment
- **AI ไม่ทำงาน:** ตรวจ Environment Variable `OPENAI_API_KEY`; สำหรับ demo ให้ใช้ `DEMO_MODE=true`
- **Traffy ยังไม่พร้อม:** ตั้ง `TRAFFY_LIVE=false`
