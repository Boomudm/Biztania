export const mockFactories=[
 {id:'FAC-PB-01',name:'พื้นที่อุตสาหกรรมปราจีนบุรี',latitude:13.9331,longitude:101.5768,categories:['ผลิตภัณฑ์โลหะ','คลังสินค้า'],source:'prototype_factory_dataset'},
 {id:'FAC-PB-02',name:'โรงงานแปรรูปอาหารสาธิต',latitude:13.8870,longitude:101.5310,categories:['แปรรูปอาหาร'],source:'prototype_factory_dataset'},
 {id:'FAC-PB-03',name:'เขตคลังสินค้าและโลจิสติกส์',latitude:13.9780,longitude:101.6060,categories:['คลังสินค้า'],source:'prototype_factory_dataset'},
 {id:'FAC-PB-04',name:'โรงงานวัสดุก่อสร้างสาธิต',latitude:13.8610,longitude:101.6150,categories:['วัสดุก่อสร้าง'],source:'prototype_factory_dataset'},
]
export const mockFloodZones=[
 {id:'FL-2026-11',name:'เขตน้ำท่วมริมคลองปราจีนบุรี',affected:true,updatedAt:'2026-10-02T08:00:00+07:00'},
 {id:'FL-2026-12',name:'ชุมชนตลาดฝั่งตะวันตก',affected:true,updatedAt:'2026-10-02T08:00:00+07:00'},
 {id:'FL-2026-13',name:'พื้นที่เฝ้าระวังตอนเหนือ',affected:false,updatedAt:'2026-10-02T08:00:00+07:00'},
]
export const mockHistoricalIncidents=[
 {id:'H-PB-019',date:'2026-07-18',distanceMeters:310,category:'คุณภาพน้ำผิดปกติ',status:'ตรวจสอบแล้ว'},
 {id:'H-PB-011',date:'2026-03-04',distanceMeters:470,category:'กลิ่นผิดปกติ',status:'ปิดเหตุ'},
 {id:'H-PB-006',date:'2025-11-21',distanceMeters:1800,category:'น้ำเสีย',status:'ปิดเหตุ'},
 {id:'H-PB-003',date:'2025-08-09',distanceMeters:3200,category:'ขยะผิดกฎหมาย',status:'ปิดเหตุ'},
]
export const mockAgencyDirectory=[
 {id:'AG-ENV-01',nameTh:'สำนักงานสิ่งแวดล้อมและควบคุมมลพิษในพื้นที่',capabilities:['ตรวจคุณภาพน้ำ','เก็บตัวอย่าง','ประสานห้องปฏิบัติการ']},
 {id:'AG-LOCAL-01',nameTh:'องค์กรปกครองส่วนท้องถิ่น',capabilities:['กั้นพื้นที่','แจ้งเตือนประชาชน','ประสานภาคสนาม']},
 {id:'AG-DI-01',nameTh:'หน่วยงานกำกับโรงงานในพื้นที่',capabilities:['ตรวจโรงงาน','ตรวจเอกสารการระบายของเสีย']},
]
export const mockSafetyKnowledge=[
 {id:'SAFE-WATER-01',topic:'เหตุคุณภาพน้ำผิดปกติ',guidanceTh:['หลีกเลี่ยงการสัมผัสน้ำโดยตรง','ไม่จับหรือบริโภคสัตว์น้ำจากบริเวณเกิดเหตุ','อย่าเก็บตัวอย่างด้วยตนเอง','รอเจ้าหน้าที่ตรวจสอบพื้นที่'],source:'prototype_safety_rag'},
 {id:'SAFE-SMOKE-01',topic:'ควันหรือกลิ่นผิดปกติ',guidanceTh:['ออกจากบริเวณเหนือลม','ปิดประตูและหน้าต่าง','โทรแจ้งเหตุฉุกเฉินหากหายใจลำบาก'],source:'prototype_safety_rag'},
]
