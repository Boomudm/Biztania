import type { Observation, Report } from '../types'

export const anchor: Report = { id:'R-108', latitude:13.9298, longitude:101.5741, timestamp:'2026-10-02T11:36:00+07:00', description:'น้ำมีกลิ่นฉุน มีคราบสีรุ้ง และพบปลาตาย', observations:['rainbow-film','strong-odor','dead-fish'], image:'/assets/canal-evidence.png' }

export const reports: Report[] = [
  { id:'R-101', latitude:13.9291, longitude:101.5735, timestamp:'2026-10-02T09:42:00+07:00', description:'น้ำมีกลิ่นแรงมาก', observations:['strong-odor'] },
  { id:'R-102', latitude:13.9302, longitude:101.5731, timestamp:'2026-10-02T10:05:00+07:00', description:'เห็นคราบสีรุ้งบนผิวน้ำ', observations:['rainbow-film'] },
  { id:'R-103', latitude:13.9287, longitude:101.5747, timestamp:'2026-10-02T10:18:00+07:00', description:'ปลาตายหลายตัวตรงคลอง มีกลิ่นฉุน', observations:['dead-fish','strong-odor'] },
  { id:'R-104', latitude:13.9307, longitude:101.5750, timestamp:'2026-10-02T10:41:00+07:00', description:'หลังน้ำลดมีกลิ่นแปลก ๆ', observations:['strong-odor','wastewater'] },
  { id:'R-105', latitude:13.9284, longitude:101.5738, timestamp:'2026-10-02T10:58:00+07:00', description:'น้ำตรงนี้สีเปลี่ยนไป และมีปลาลอย', observations:['discolored-water','dead-fish'] },
  { id:'R-106', latitude:13.9295, longitude:101.5754, timestamp:'2026-10-02T11:09:00+07:00', description:'กลิ่นฉุนกับคราบบนผิวน้ำ', observations:['strong-odor','rainbow-film'] },
  { id:'R-107', latitude:13.9309, longitude:101.5739, timestamp:'2026-10-02T11:24:00+07:00', description:'น้ำเสีย กลิ่นแรง พบปลาตาย', observations:['wastewater','strong-odor','dead-fish'] },
  anchor,
  { id:'R-201', latitude:13.9701, longitude:101.6110, timestamp:'2026-10-02T10:50:00+07:00', description:'ควันผิดปกติใกล้ถนน', observations:['smoke'] },
  { id:'R-202', latitude:13.8910, longitude:101.5260, timestamp:'2026-10-01T16:10:00+07:00', description:'น้ำขุ่นหลังฝนตก', observations:['discolored-water'] },
  { id:'R-203', latitude:13.9450, longitude:101.6350, timestamp:'2026-09-30T09:12:00+07:00', description:'กลิ่นควันช่วงเช้า', observations:['smoke'] }
]
export const observationLabels: Record<Observation,string> = {'discolored-water':'น้ำเปลี่ยนสี','rainbow-film':'คราบน้ำมัน/สีรุ้ง','strong-odor':'กลิ่นฉุน','dead-fish':'ปลาตาย','wastewater':'น้ำเสีย','smoke':'ควันผิดปกติ'}
