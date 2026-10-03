# Demo Script

## ก่อนเริ่ม

- ใช้ desktop viewport
- เปิดที่ Citizen Portal
- ตรวจว่า Demo Mode พร้อมสลับบทบาท
- ไม่พึ่ง external network สำหรับเส้นทางหลัก

## Step 1 — Citizen submits evidence

พูด:

> ประชาชนไม่ต้องรู้ว่าปัญหานี้เรียกว่าอะไรหรือควรส่งให้ใคร เพียงส่งสิ่งที่พบ

ทำ:

1. แสดงภาพตัวอย่าง
2. ชี้ GPS และเวลาอัตโนมัติ
3. แสดงคำอธิบายที่ไม่บังคับ
4. กด `ส่งรายงาน`

ผลที่ต้องเห็น: `รับรายงานแล้ว` และหมายเลข `R-10824`

## Step 2 — Switch to Officer

พูด:

> ระหว่างสองหน้าจอนี้ AI Concierge ทำงานข้อมูลที่ซับซ้อนอยู่เบื้องหลัง

ทำ: สลับ Demo Mode เป็น `เจ้าหน้าที่`

ผลที่ต้องเห็น: PB-024 อยู่ลำดับแรก คะแนน 87/100

## Step 3 — Investigate incident

ทำ:

1. กด `ตรวจสอบเหตุการณ์`
2. แสดง 8 reports → 1 potential incident
3. คลิกหมุดหนึ่งรายการ
4. ชี้ raw description และ structured observations
5. แสดง Workbench: input → orchestration → output

พูด:

> AI ไม่ได้บอกว่านี่คือสารอะไร แต่เชื่อมหลักฐาน ตำแหน่ง เวลา และบริบทเพื่อเตรียมสิ่งที่เจ้าหน้าที่ต้องตรวจ

## Step 4 — Review and route

ทำ:

1. กด `ตรวจรายงานที่ AI เตรียมไว้`
2. ชี้ location, time, evidence, context และ reasons
3. แสดง routing recommendation
4. ย้ำว่าเป็น mock และเจ้าหน้าที่ยืนยันปลายทาง
5. กด `ยืนยันปลายทางและส่งต่อ`

## Closing

> Eco-Alert ไม่แทนที่เจ้าหน้าที่ แต่ช่วยเปลี่ยนรายงานเล็ก ๆ ที่กระจัดกระจาย ให้เป็นข้อมูลที่พร้อมตรวจสอบและตัดสินใจ

## Recovery หาก Demo สะดุด

- AI provider ล้มเหลว: ใช้ deterministic fallback
- API ภายนอกไม่พร้อม: mock providers ยังคงเส้นทาง Demo
- ต้องข้าม Citizen flow: สลับไป Officer Dashboard และเปิด PB-024
