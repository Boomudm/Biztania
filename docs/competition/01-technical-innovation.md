# 1. Technical Innovation — 25%

## แนวคิดหลัก

Eco-Alert เปลี่ยนหลักฐานที่กระจัดกระจายจากประชาชนให้เป็น **incident intelligence ที่พร้อมให้เจ้าหน้าที่ตรวจสอบ** โดยประชาชนไม่ต้องรู้ประเภทมลพิษ ไม่ต้องเลือกหน่วยงาน และไม่ต้องวิเคราะห์ความรุนแรงเอง

```text
Citizen evidence
→ AI เข้าใจและจัดโครงสร้าง
→ ค้นรายงานที่เกี่ยวข้อง
→ จัดกลุ่มเป็นเหตุการณ์
→ ดึงบริบทพื้นที่
→ จัดลำดับความสำคัญ
→ เตรียม Officer brief
→ Human decision
```

## ความแตกต่างจากระบบรับแจ้งเหตุทั่วไป

| ระบบรับแจ้งเหตุทั่วไป | Eco-Alert AI Concierge |
|---|---|
| เก็บรายงานทีละรายการ | เชื่อมหลายรายงานเป็นเหตุการณ์เดียว |
| ประชาชนต้องเลือกหมวด | AI สกัด observation จากหลักฐาน |
| เจ้าหน้าที่อ่านทุกเรื่องเอง | AI เตรียม evidence, context และ priority |
| ข้อมูลหยุดอยู่ใน inbox | ข้อมูลถูกแปลงเป็น Officer brief |
| AI เป็น chatbot | AI เป็น orchestration layer ใน workflow |

## นวัตกรรมเชิงเทคนิค

1. **Evidence-to-intelligence pipeline** — เชื่อม multimodal understanding, retrieval, clustering, scoring และ report preparation
2. **Hybrid AI design** — ใช้ Generative AI เฉพาะงานที่ต้องเข้าใจภาษา/หลักฐาน และใช้ deterministic logic กับสิ่งที่ต้องตรวจสอบย้อนกลับได้
3. **Role-aware intelligence** — ประชาชนเห็นเฉพาะสถานะง่าย ๆ ขณะที่เจ้าหน้าที่เห็น reasoning, sources และ confidence
4. **Grounded explanation** — AI อธิบายจากผล clustering, risk factors และ context ที่ระบบคำนวณแล้ว ไม่สร้างคะแนนเอง
5. **Human-controlled routing** — AI แนะนำปลายทาง แต่เจ้าหน้าที่เป็นผู้ยืนยัน

## สิ่งที่ไม่กล่าวอ้าง

- ไม่ระบุชนิดสารเคมีจากภาพ
- ไม่ยืนยันว่ามีการปนเปื้อนจริง
- ไม่ใช้คะแนน urgency แทนผลทางวิทยาศาสตร์
- ไม่ส่งคำสั่งให้หน่วยงานอัตโนมัติ

## หลักฐานใน Prototype

- Citizen Portal และ Officer Console แยกกัน
- PB-024 รวม 8 รายงานจากฐานข้อมูลจำลอง 25 รายงาน
- Officer เห็น raw evidence → structured observations → related incident
- AI Concierge Workbench แสดงงานแต่ละขั้นและชนิดเทคโนโลยีที่ใช้
