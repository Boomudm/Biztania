# 4. Technical Feasibility — 15%

## เหตุผลที่พัฒนาต่อเป็นระบบจริงได้

1. Frontend, API, orchestration และ providers แยกชั้นกัน
2. AI output มี schema และ validation
3. คะแนนและ clustering ไม่พึ่งข้อความที่ LLM สร้าง
4. External systems อยู่หลัง adapter interface
5. ระบบทำงานต่อได้ด้วย fallback เมื่อ AI provider ไม่พร้อม

## Reliability controls ปัจจุบัน

- ตรวจชนิดและขนาด image payload
- จำกัดขนาดข้อความและ array
- Validate latitude/longitude และ timestamp
- Server-only secrets
- Deterministic test scenario
- Unit/integration tests สำหรับ orchestration, clustering และ urgency
- Responsible AI notice ใน Officer workflow

## Evaluation ปัจจุบัน

ชุดข้อมูลจำลองที่ติด label มี 25 รายงาน สำหรับ binary evaluation ของ PB-024:

- Expected cluster: 8 reports
- Expected non-cluster: 17 reports
- Precision: 100%
- Recall: 100%
- F1: 100%

ตัวเลขนี้เป็น **synthetic regression result** ไม่ใช่ผลความแม่นยำภาคสนาม

## Production gaps

| Gap | แนวทางต่อยอด |
|---|---|
| ไม่มีฐานข้อมูลถาวร | PostgreSQL/PostGIS และ audit log |
| ไม่มี auth จริง | OIDC และ role-based access control |
| Mock nearby reports | เชื่อม documented incident API |
| Mock context | ใช้ official geospatial/open-data layers |
| Synthetic evaluation | สร้าง anonymized labeled dataset กับผู้เชี่ยวชาญ |
| ไม่มี monitoring | เพิ่ม tracing, error metrics, drift และ data-quality checks |
| ไม่มี field validation | ทดลองใช้งานแบบ shadow mode ก่อน operational use |

## Deployment path

1. Pilot แบบ read-only/shadow mode
2. ให้เจ้าหน้าที่เปรียบเทียบ AI suggestion กับการตัดสินใจจริง
3. เก็บ feedback และ labeled outcomes
4. ปรับ threshold และ evaluate ใหม่
5. เปิด submission เฉพาะเมื่อมี authorization และ audit trail
