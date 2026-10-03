# Responsible AI

## Safety boundary

Eco-Alert เป็นระบบช่วยจัดข้อมูลและจัดลำดับ ไม่ใช่ระบบวินิจฉัยมลพิษ

## Guardrails

1. `chemical_identity` ถูกบังคับให้เป็น `unknown`
2. `needs_field_verification` ถูกบังคับให้เป็น `true`
3. คะแนน urgency มาจาก deterministic engine
4. Cluster membership ไม่ใช้ LLM ตัดสินโดยตรง
5. Explanation ต้อง grounded จากผลลัพธ์ของระบบ
6. ไม่มี autonomous submission
7. Citizen ไม่เห็นข้อมูลส่วนตัวของรายงานอื่น
8. Officer เห็น source labels, confidence และข้อจำกัด

## Human-in-the-loop

เจ้าหน้าที่ต้อง:

- ตรวจหลักฐาน
- ตรวจบริบท
- ตรวจ Officer brief
- ยืนยันปลายทาง
- กดส่งต่อ

## Required verification

- ตรวจสอบพื้นที่จริง
- เก็บตัวอย่างโดยผู้มีหน้าที่
- ตรวจทางห้องปฏิบัติการเมื่อจำเป็น
- ใช้ protocol ของหน่วยงานสำหรับการยืนยันและ escalation

## Data governance ที่ต้องเพิ่มก่อน production

- Consent และ privacy notice
- Retention policy
- Access control
- Audit log
- Data minimization
- Redaction สำหรับภาพหรือข้อมูลส่วนบุคคล
- Incident response และ model/provider monitoring
