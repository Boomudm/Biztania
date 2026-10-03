# Eco-Alert AI Concierge — Competition Documentation

เอกสารชุดนี้อธิบายระบบตามเกณฑ์การแข่งขัน และใช้เป็นแหล่งอ้างอิงสำหรับทำสไลด์ ตอบคำถามกรรมการ และซ้อม Demo

## เอกสารตามเกณฑ์

1. [Technical Innovation](./01-technical-innovation.md) — ความใหม่และคุณค่าของแนวทาง
2. [AI System Design](./02-ai-system-design.md) — Architecture, model, data และ decision boundaries
3. [AI Application & Integration](./03-ai-application-integration.md) — การนำ AI ไปใช้ใน workflow และการเชื่อมระบบ
4. [Technical Feasibility](./04-technical-feasibility.md) — ความเป็นไปได้ ความน่าเชื่อถือ และแนวทาง production
5. [Prototype & Demonstration](./05-prototype-demonstration.md) — ขอบเขต Prototype และเส้นทาง Demo
6. [Presentation](./06-presentation.md) — Message, narrative และคำตอบสั้นสำหรับกรรมการ

## เอกสารเทคนิค

- [Clustering Logic](./clustering.md)
- [Urgency Scoring](./urgency-scoring.md)
- [Responsible AI](./responsible-ai.md)
- [Demo Script](./demo-script.md)

## สถานะระบบ

| ส่วน | สถานะ |
|---|---|
| Citizen และ Officer UI | ใช้งานได้ใน Prototype |
| Evidence understanding | OpenAI เมื่อมี key; deterministic fallback เมื่อไม่มี |
| Report clustering | Deterministic prototype logic |
| Urgency scoring | Transparent rule-based engine |
| Context retrieval | Mock providers ผ่าน provider interface |
| External submission | Mock adapter; ยังไม่ส่งหน่วยงานจริง |
| Human decision | เจ้าหน้าที่ตรวจสอบและกดส่งต่อเอง |

> ระบบนี้เป็น Decision Support Prototype ไม่ใช่ระบบยืนยันมลพิษหรือสั่งการหน่วยงานอัตโนมัติ
