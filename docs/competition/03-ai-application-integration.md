# 3. AI Application & Integration — 20%

## AI อยู่ตรงไหนใน Product

AI ไม่ได้เป็นหน้าสนทนา แต่เป็น Concierge ที่ทำงานเบื้องหลังระหว่างประชาชนกับเจ้าหน้าที่

### Citizen experience

ประชาชนทำเพียง:

1. เพิ่มภาพ
2. ใช้ GPS และเวลาปัจจุบัน
3. เขียนคำอธิบายเพิ่มเติมถ้าต้องการ
4. ส่งรายงาน
5. รับหมายเลขอ้างอิงและติดตามสถานะ

ประชาชนไม่เห็น clustering weights, risk score หรือรายงานของผู้อื่น

### Officer experience

เจ้าหน้าที่ได้รับ:

- คิวเหตุที่ AI จัดลำดับ
- แผนที่และ cluster ของรายงาน
- หลักฐานดิบแต่ละรายการ
- observation ที่ AI สกัด
- context พื้นที่พร้อม source label
- urgency score และเหตุผล
- Officer brief ที่เตรียมไว้
- routing recommendation

## Integration architecture

```text
React UI
  ↓ HTTP
Local Express API
  ↓
Concierge Orchestrator
  ├─ AI Provider
  ├─ Nearby Report Provider
  ├─ Context Providers
  ├─ Clustering Engine
  ├─ Urgency Engine
  └─ Submission Provider
```

## API ปัจจุบัน

- `POST /api/analyze` — วิเคราะห์หลักฐานและคืน Concierge result
- `POST /api/submit` — ส่งผ่าน submission provider
- `GET /api/health` — รายงานสถานะ configuration โดยไม่เปิดเผย secret

## REAL / MOCK / FUTURE

### REAL

- Server-side AI integration เมื่อกำหนด `OPENAI_API_KEY`
- Schema validation
- Clustering และ urgency engine
- Officer report preparation
- API/provider boundaries

### MOCK

- รายงานประชาชน 25 รายงาน
- โรงงาน พื้นที่น้ำท่วม และประวัติเหตุ
- Agency directory
- Submission และ tracking status

### FUTURE

- Traffy หรือระบบรับเรื่องที่มี documented API
- Government/open-data context providers
- Database และ event history จริง
- Authentication และ role-based authorization

## Routing

สำหรับ PB-024 ระบบแนะนำ:

- หน่วยงานหลัก: สำนักงานสิ่งแวดล้อมและควบคุมมลพิษในพื้นที่
- สนับสนุน: องค์กรปกครองส่วนท้องถิ่น
- สนับสนุนเมื่อเกี่ยวข้อง: หน่วยงานกำกับโรงงานในพื้นที่

คำแนะนำนี้เป็น mock routing และต้องให้เจ้าหน้าที่ยืนยันก่อนส่ง
