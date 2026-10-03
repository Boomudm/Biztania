# 5. Prototype & Demonstration — 15%

## สิ่งที่ Prototype ทำได้

- แยก Citizen Portal และ Officer Console
- รับหลักฐานตัวอย่างพร้อม GPS และเวลา
- สร้างหมายเลขรายงานและสถานะสำหรับประชาชน
- วิเคราะห์หลักฐานผ่าน AI/fallback
- ค้นและจัดกลุ่มรายงานที่เกี่ยวข้อง
- แสดง cluster หลายเคสบนแผนที่
- แสดง raw evidence และ structured observations
- ดึง context จำลอง
- คำนวณ urgency score
- เตรียม Officer brief
- แนะนำหน่วยงานปลายทาง
- จำลองการส่งต่อโดยให้เจ้าหน้าที่ยืนยัน

## Deterministic scenario

| ค่า | ผลลัพธ์ |
|---|---|
| Incident | PB-024 |
| Location | ปราจีนบุรี |
| Related reports | 8 |
| Cluster confidence | 91% |
| Urgency | 87/100 |
| Priority | High |
| Signals | คราบสีรุ้ง, กลิ่นฉุน, ปลาตาย |

## เส้นทาง Demo ที่แนะนำ

1. เปิด Citizen Portal และส่งหลักฐาน
2. แสดงหมายเลข `R-10824` และสถานะที่ประชาชนเข้าใจง่าย
3. สลับ Demo Mode เป็น Officer
4. เปิด PB-024 จาก priority queue
5. คลิกหมุดเพื่อแสดง raw evidence → AI observations
6. แสดง AI Concierge Workbench
7. ตรวจ Officer brief และ routing recommendation
8. กดส่งต่อแบบจำลอง

## Definition of done สำหรับ Demo

- ไม่มี loading ที่พึ่ง network ภายนอก
- ทุกปุ่มในเส้นทางหลักมีผลลัพธ์ชัดเจน
- Citizen ไม่เห็นข้อมูลเฉพาะเจ้าหน้าที่
- Officer ไม่มี citizen upload CTA
- ไม่มีข้อความที่กล่าวอ้างการวินิจฉัยสารเคมี
- UI อ่านได้บน laptop และ projector
- `npm test` และ `npm run build` ผ่าน
