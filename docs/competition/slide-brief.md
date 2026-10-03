# Eco-Alert — Slide Brief สำหรับทีม Presentation

เอกสารนี้ย่อเนื้อหาให้พร้อมนำไปวางในสไลด์ โดยเน้น 4 เกณฑ์รวม 80% ของคะแนน

---

## Slide 1 — แนวคิดของ Eco-Alert

### Headline

**จากรายงานประชาชนที่กระจัดกระจาย สู่เหตุการณ์ที่พร้อมให้เจ้าหน้าที่ตรวจสอบ**

### Problem

- ประชาชนหลายคนอาจรายงานเหตุเดียวกัน แต่ข้อมูลถูกแยกเป็นคนละเรื่อง
- ประชาชนอาจไม่รู้ประเภทมลพิษหรือหน่วยงานที่ต้องรับผิดชอบ
- เจ้าหน้าที่ต้องอ่านรายงานจำนวนมาก เชื่อมโยงข้อมูล และจัดลำดับเอง
- เหตุที่ควรได้รับการตรวจสอบเร็วอาจถูกมองเป็นรายงานทั่วไป

### Solution

Eco-Alert เป็น **AI Concierge ด้านสิ่งแวดล้อม** ที่รับหลักฐานจากประชาชน เข้าใจสิ่งที่สังเกตได้ ค้นรายงานใกล้เคียง รวมรายงานที่สัมพันธ์กันเป็นเหตุการณ์ ดึงบริบทพื้นที่ จัดลำดับความสำคัญ และเตรียม Officer Brief ให้เจ้าหน้าที่ตรวจสอบ

```text
Citizen evidence
→ Understand
→ Connect reports
→ Add local context
→ Prioritize
→ Prepare officer brief
→ Human decision
```

### Key message สำหรับพูด

> Eco-Alert ไม่ได้ใช้ AI เพื่อตัดสินแทนเจ้าหน้าที่ แต่ใช้ AI ลดงานค้นหาและเชื่อมโยงข้อมูล เพื่อให้เจ้าหน้าที่เห็นภาพของเหตุการณ์ได้เร็วขึ้น

---

## Slide 2 — Technical Innovation (25%)

### Headline

**AI ไม่ได้เป็นเพียง Chatbot แต่เป็น Intelligence Layer ของกระบวนการรับแจ้งเหตุ**

### จุดเด่นเชิงนวัตกรรม

1. **Evidence-to-Intelligence Pipeline**  
   เปลี่ยนภาพ ข้อความ GPS และเวลา ให้เป็นข้อมูลที่จัดโครงสร้าง เชื่อมโยง และพร้อมตรวจสอบ

2. **Multi-report Incident Clustering**  
   วิเคราะห์ตำแหน่ง เวลา และความหมายของสิ่งที่ประชาชนสังเกต เพื่อรวมหลายรายงานเป็นเหตุการณ์เดียว

3. **Hybrid AI**  
   ใช้ Generative AI กับงานเข้าใจภาษาและหลักฐาน แต่ใช้กฎที่ตรวจสอบได้กับ clustering และ urgency score

4. **Context-aware Prioritization**  
   เชื่อมบริบท เช่น พื้นที่น้ำท่วม โรงงานใกล้เคียง และประวัติเหตุ เพื่อช่วยจัดลำดับการตรวจสอบ

5. **Human-controlled Routing**  
   AI แนะนำหน่วยงานที่เหมาะสม แต่เจ้าหน้าที่เป็นผู้ยืนยันและส่งเรื่อง

### ความแตกต่าง

| ระบบรับแจ้งทั่วไป | Eco-Alert |
|---|---|
| เก็บรายงานทีละรายการ | รวมหลายรายงานเป็นเหตุการณ์ |
| เจ้าหน้าที่ค้นความสัมพันธ์เอง | AI เตรียมความสัมพันธ์และเหตุผล |
| ข้อมูลหยุดอยู่ใน inbox | เปลี่ยนเป็น Officer Brief |
| AI ตอบคำถาม | AI orchestrate workflow |

### Proof ใน Prototype

- ฐานข้อมูลจำลอง 25 รายงาน
- AI เชื่อม 8 รายงานเป็นเหตุ PB-024
- แสดงเหตุผลจากตำแหน่ง เวลา และลักษณะเหตุ
- จัดลำดับความสำคัญ 87/100 พร้อมที่มาของคะแนน

---

## Slide 3 — AI System Design (20%)

### Headline

**ออกแบบให้ AI ทำสิ่งที่ AI ถนัด และให้ Logic ที่ตรวจสอบได้ควบคุมการตัดสินใจสำคัญ**

### Architecture

```text
Citizen Portal
   ↓ ภาพ + ข้อความ + GPS + เวลา
Express API
   ↓
Evidence Understanding (AI)
   ↓ structured observations
Nearby Report Retrieval
   ↓
Clustering Engine (Rule-based)
   ↓
Context Retrieval
   ↓
Urgency Engine (Rule-based)
   ↓
Grounded Explanation (AI)
   ↓
Officer Console → Human Verification
```

### การแบ่งหน้าที่

| Generative AI | Deterministic System |
|---|---|
| เข้าใจข้อความและภาพ | ตัดสินสมาชิกของ cluster |
| สกัดสิ่งที่สังเกตได้ | คำนวณ urgency score |
| สรุปเหตุผลเป็นภาษาคน | ตรวจ schema และข้อจำกัด |
| เตรียมคำอธิบาย | ควบคุม workflow และ routing |

### Clustering ทำงานอย่างไร

ระบบคำนวณความสัมพันธ์จาก 3 มิติ:

- ระยะทาง 40%
- ช่วงเวลา 30%
- ความคล้ายของ observation 30%

รายงานจะถูกรวมเมื่อคะแนนรวมผ่าน threshold ที่กำหนด บริบทอย่างโรงงานหรือพื้นที่น้ำท่วม **ไม่ใช้ตัดสินว่าเป็นเหตุเดียวกัน** แต่ใช้ประกอบการจัดลำดับภายหลัง

### Responsible AI Boundary

- ไม่ระบุชนิดสารเคมีจากภาพ
- ไม่ยืนยันการปนเปื้อน
- ไม่ให้ LLM สร้างคะแนนเอง
- ไม่ส่งเรื่องอัตโนมัติ
- ทุกผลลัพธ์ต้องให้เจ้าหน้าที่ตรวจสอบ

---

## Slide 4 — AI Application & Integration (20%)

### Headline

**AI ถูกฝังอยู่ใน User Journey ตั้งแต่รับหลักฐานจนถึงการเตรียมข้อมูลให้เจ้าหน้าที่**

### Citizen Journey

1. ส่งภาพ รายละเอียด ตำแหน่ง และเวลา
2. ระบบตรวจสอบและจัดโครงสร้างหลักฐาน
3. ประชาชนได้รับหมายเลขอ้างอิง
4. ติดตามสถานะได้ โดยไม่ต้องเข้าใจศัพท์เทคนิคหรือเลือกหน่วยงานเอง

### Officer Journey

1. เห็นคิวเหตุการณ์ที่จัดลำดับแล้ว
2. เปิดดู cluster บนแผนที่และหลักฐานดิบ
3. ตรวจ observation และเหตุผลที่ AI เชื่อมรายงาน
4. ตรวจ urgency factors และบริบทพื้นที่
5. อ่าน Officer Brief
6. ยืนยันหน่วยงานปลายทางและส่งต่อ

### Integration Layer

- `POST /api/analyze` — วิเคราะห์หลักฐานและสร้างผลจาก Concierge
- `POST /api/submit` — ส่งเรื่องผ่าน submission adapter
- `GET /api/health` — ตรวจสถานะระบบโดยไม่เปิดเผย secret
- Provider pattern ทำให้เปลี่ยน mock data เป็น Traffy, open data หรือฐานข้อมูลจริงได้ โดยไม่ต้องเขียน workflow ใหม่

### REAL / MOCK / FUTURE

| REAL ใน Prototype | MOCK เพื่อ Demo | FUTURE Integration |
|---|---|---|
| AI structured output | รายงานประชาชน 25 รายงาน | Traffy API ที่ได้รับอนุญาต |
| Clustering engine | โรงงาน/น้ำท่วม/ประวัติเหตุ | Government open data |
| Urgency engine | Agency directory | Database และ audit log |
| Officer Brief | การส่งเรื่องและ tracking | Authentication/RBAC |

### Key message สำหรับพูด

> จุดสำคัญไม่ใช่แค่เราเรียก AI API ได้ แต่เรานำ AI มาวางใน workflow ที่แก้ปัญหาของทั้งประชาชนและเจ้าหน้าที่อย่างมีขอบเขต

---

## Slide 5 — Technical Feasibility (15%)

### Headline

**Prototype ทำงานครบเส้นทาง และ Architecture รองรับการเปลี่ยนจาก Mock ไปสู่ระบบจริง**

### สิ่งที่ทำงานแล้ว

- React Citizen Portal และ Officer Console
- Express API และ server-side AI integration
- Schema validation ด้วย Zod
- Clustering และ urgency engine ที่ทำซ้ำได้
- Provider/adapter สำหรับเปลี่ยนแหล่งข้อมูลภายนอก
- Fallback mode เมื่อ AI provider ไม่พร้อม
- Unit และ integration tests
- Deploy frontend และ API เป็น web service เดียวได้

### ผลทดสอบ Prototype

- Test ผ่าน 7/7
- Production build ผ่าน
- ชุดข้อมูลจำลอง 25 รายงาน
- PB-024 มี expected cluster 8 รายงาน
- Synthetic regression: Precision 100%, Recall 100%, F1 100%

> ต้องระบุบนสไลด์ว่าผลนี้เป็นการทดสอบกับ synthetic dataset เพื่อยืนยัน logic ของ prototype ไม่ใช่ความแม่นยำในภาคสนาม

### Roadmap สู่ Production

1. เชื่อม PostgreSQL/PostGIS และ official data providers
2. เพิ่ม OIDC, role-based access และ audit log
3. ทดลองแบบ read-only หรือ shadow mode กับเจ้าหน้าที่
4. สร้าง anonymized labeled dataset จากเคสจริง
5. วัด precision, recall, latency และ data quality
6. เปิดการส่งต่อจริงเมื่อมี authorization และ governance ครบ

### Risk และแนวทางควบคุม

| Risk | Control |
|---|---|
| AI hallucination | Strict schema + grounded input + human review |
| AI/API ล่ม | Deterministic fallback |
| คะแนนอธิบายไม่ได้ | Rule-based factors และแสดง contribution |
| ส่งผิดหน่วยงาน | AI แนะนำ เจ้าหน้าที่ยืนยัน |
| ข้อมูลอ่อนไหว | Server-side secrets และ role-based access ใน production |

---

## Closing Message

**Eco-Alert ลดเวลาจาก “การรับรายงาน” ไปสู่ “การเข้าใจเหตุการณ์”** ด้วยการผสาน AI, deterministic logic และ human verification เพื่อให้เทคโนโลยีช่วยเจ้าหน้าที่ได้จริง โดยยังคงความโปร่งใสและความรับผิดชอบ

### ประโยคปิดสำหรับพูด

> เราไม่ได้สร้าง AI ที่บอกว่าเกิดมลพิษอะไร แต่เราสร้างระบบที่ช่วยให้เจ้าหน้าที่รู้ว่า เหตุไหนอาจเกี่ยวข้องกัน เหตุไหนควรตรวจสอบก่อน และข้อมูลอะไรพร้อมใช้ในการตัดสินใจ
