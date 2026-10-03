# Clustering Logic

## เป้าหมาย

ระบุว่ารายงานประชาชนหลายรายการ **อาจเกี่ยวข้องกับเหตุการณ์เดียวกัน** โดยไม่ใช้บริบทโรงงานหรือน้ำท่วมเป็นหลักฐานยืนยัน cluster membership

## Features

### 1. Spatial similarity — 40%

คำนวณระยะทางด้วย Haversine distance

```text
spatial = max(0, 1 - distanceMeters / 600)
```

Prototype candidate threshold: ไม่เกิน 500 เมตรจาก anchor report

### 2. Temporal similarity — 30%

```text
temporal = max(0, 1 - timeDifferenceMinutes / 180)
```

Prototype candidate threshold: ไม่เกิน 2 ชั่วโมงจาก anchor report

### 3. Semantic similarity — 30%

Normalize observation aliases จาก structured observations และคำสำคัญภาษาไทย เช่น:

- กลิ่น, เหม็น, ฉุน → `strong_odor`
- ปลาตาย, ปลาลอย → `dead_fish`
- คราบ, สีรุ้ง, ผิวน้ำ → `rainbow_surface_film`
- น้ำเสีย, น้ำทิ้ง → `wastewater`

คำนวณ Jaccard overlap:

```text
semantic = intersection(signals A, signals B) / union(signals A, signals B)
```

### Combined similarity

```text
total = 0.40 × spatial + 0.30 × temporal + 0.30 × semantic
```

## Membership ใน deterministic demo

`clusterReports()` เลือกรายงานที่ผ่าน spatial และ temporal thresholds เพื่อให้ Demo ทำซ้ำได้ ส่วน semantic similarity ใช้แสดงเหตุผลและเปรียบเทียบความคล้ายคลึง

PB-024 ประกอบด้วย `R-101` ถึง `R-108` รวม 8 รายงาน

## สิ่งที่ไม่ใช้ตัดสิน membership

- ระยะจากโรงงาน
- สถานะพื้นที่น้ำท่วม
- ประวัติเหตุ

ข้อมูลเหล่านี้ใช้ใน urgency/context หลังจากจัดกลุ่มแล้ว เพื่อลดความเสี่ยงจากการสรุปสาเหตุเกินหลักฐาน

## Evaluation

`evaluateDemoCluster()` เปรียบเทียบผลลัพธ์กับ label ของรายงานจำลอง 25 รายการ และคำนวณ precision, recall และ F1

ข้อจำกัด: เป็น synthetic regression benchmark ต้องมีข้อมูลจริงที่ผู้เชี่ยวชาญติด label ก่อนประเมินประสิทธิภาพภาคสนาม
