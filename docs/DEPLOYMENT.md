# Deploy Eco-Alert ขึ้น Render

โปรเจกต์นี้ deploy เป็น **Web Service เดียว** ได้: Express ให้บริการทั้ง `/api/*` และไฟล์ frontend ที่ Vite build ไว้ใน `dist/` จึงไม่ต้องแยก frontend/backend และไม่ต้องตั้ง CORS เพิ่ม

## ค่าที่ใช้บน Render

| ช่อง | ค่า |
|---|---|
| Runtime | Node |
| Branch | `main` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

โปรเจกต์กำหนดช่วง Node.js ที่รองรับไว้ที่ major version 22–26 ผ่าน `package.json` เพื่อไม่ให้ production เลือก runtime ที่เก่าหรือใหม่เกินช่วงที่ทดสอบ

## Environment variables

ตั้งในหน้า **Environment** ของ Render ห้ามใส่ secret ลง GitHub

| Key | ค่าแนะนำ | จำเป็นหรือไม่ |
|---|---|---|
| `DEMO_MODE` | `true` | แนะนำสำหรับวันนำเสนอ |
| `OPENAI_API_KEY` | API key จริง | ไม่จำเป็น ระบบ fallback เป็น mock ได้ |
| `OPENAI_MODEL` | `gpt-4.1-mini` | ไม่จำเป็น |
| `TRAFFY_LIVE` | `false` | แนะนำจนกว่าจะมี API จริง |
| `TRAFFY_API_BASE_URL` | URL ของ API | ใช้เมื่อ `TRAFFY_LIVE=true` |
| `TRAFFY_API_KEY` | API key | ใช้เมื่อ API ต้องยืนยันตัวตน |

ไม่ต้องตั้ง `PORT` เอง เพราะแอปอ่านค่าที่ Render กำหนดให้ และรับ traffic ที่ `0.0.0.0`

## ขั้นตอน

1. Push branch `main` ขึ้น GitHub
2. เข้า Render แล้วเลือก **New → Web Service**
3. เชื่อม GitHub และเลือก repository นี้
4. กรอกค่าจากตารางด้านบน เลือก region ใกล้ผู้ใช้ และเลือกแผนที่ต้องการ
5. เพิ่ม environment variables โดยเริ่มจาก `DEMO_MODE=true` และ `TRAFFY_LIVE=false`
6. กด **Create Web Service** แล้วรอ build และ health check ผ่าน
7. เปิด URL `*.onrender.com` และทดสอบ `/api/health`

เมื่อเปิด Auto-Deploy ทุกครั้งที่ push เข้า `main` Render จะ build และ deploy เวอร์ชันใหม่ให้อัตโนมัติ

## Checklist ก่อนวัน Demo

- หน้าแรกเปิดและ refresh URL ย่อยได้โดยไม่เป็น 404
- `/api/health` ตอบ `ok: true`
- ทดลองครบ 3 เคส PB-024, PB-031 และ PB-041
- ทดสอบทั้งกรณีมีและไม่มี `OPENAI_API_KEY`
- ตรวจว่า GitHub ไม่มีไฟล์ `.env` หรือ API key
- เปิดเว็บจริงบน Wi-Fi/อุปกรณ์ที่จะใช้ present

## หาก deploy ไม่ผ่าน

- **Build failed:** เปิด Deploy logs แล้วลอง `npm ci`, `npm run build`, `npm test` ในเครื่อง
- **Health check failed:** ตรวจว่า Start Command คือ `npm start` และ path คือ `/api/health`
- **หน้าเว็บเปิดได้แต่ AI ไม่ทำงาน:** ตรวจ `OPENAI_API_KEY`; หากต้อง demo ทันทีให้ตั้ง `DEMO_MODE=true`
- **Traffy ล่มหรือยังไม่มีสิทธิ์:** ตั้ง `TRAFFY_LIVE=false` เพื่อใช้ข้อมูลจำลอง
