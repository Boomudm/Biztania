import type { IncidentContext, NormalizedReport } from '../types/contracts.js'
import { config } from '../services/config.js'
import { log } from '../services/logger.js'
import { mockFactories, mockFloodZones, mockHistoricalIncidents, mockSafetyKnowledge } from '../data/mockCatalog.js'

export type NearbyQuery={latitude:number;longitude:number;radiusMeters:number;startTime:string;endTime:string}
export interface IncidentDataProvider{findNearbyReports(query:NearbyQuery):Promise<NormalizedReport[]>;getReport(id:string):Promise<NormalizedReport|undefined>}

const seeded:NormalizedReport[]=[
  ['R-101',13.9291,101.5735,'2026-10-02T09:42:00+07:00','น้ำมีกลิ่นแรงมาก',['strong_odor']],
  ['R-102',13.9302,101.5731,'2026-10-02T10:05:00+07:00','เห็นคราบสีรุ้งบนผิวน้ำ',['rainbow_surface_film']],
  ['R-103',13.9287,101.5747,'2026-10-02T10:18:00+07:00','ปลาตายหลายตัวตรงคลอง มีกลิ่นฉุน',['dead_fish','strong_odor']],
  ['R-104',13.9307,101.5750,'2026-10-02T10:41:00+07:00','หลังน้ำลดมีกลิ่นแปลก ๆ',['strong_odor','wastewater']],
  ['R-105',13.9284,101.5738,'2026-10-02T10:58:00+07:00','น้ำตรงนี้สีเปลี่ยนไป และมีปลาลอย',['water_discoloration','dead_fish']],
  ['R-106',13.9295,101.5754,'2026-10-02T11:09:00+07:00','กลิ่นฉุนกับคราบบนผิวน้ำ',['strong_odor','rainbow_surface_film']],
  ['R-107',13.9309,101.5739,'2026-10-02T11:24:00+07:00','น้ำเสีย กลิ่นแรง พบปลาตาย',['wastewater','strong_odor','dead_fish']],
  ['R-108',13.9298,101.5741,'2026-10-02T11:36:00+07:00','น้ำมีกลิ่นฉุน มีคราบสีรุ้ง และพบปลาตาย',['rainbow_surface_film','strong_odor','dead_fish']],
  ['R-201',13.9701,101.6110,'2026-10-02T10:50:00+07:00','ควันผิดปกติใกล้ถนน',['unknown']],
  ['R-202',13.8910,101.5260,'2026-10-01T16:10:00+07:00','น้ำขุ่นหลังฝนตก',['water_discoloration']],
  ['R-203',13.9450,101.6350,'2026-09-30T09:12:00+07:00','กลิ่นควันช่วงเช้า',['unknown']],
  ['R-204',13.9320,101.5762,'2026-10-01T06:20:00+07:00','เมื่อวานเห็นน้ำขุ่นหลังฝนตก',['water_discoloration']],
  ['R-205',13.9784,101.6022,'2026-10-02T11:12:00+07:00','มีควันดำจากการเผาขยะข้างทาง',['unknown']],
  ['R-206',13.8842,101.5908,'2026-10-02T10:47:00+07:00','พบท่อน้ำทิ้งไหลลงร่องระบายน้ำ',['wastewater']],
  ['R-207',13.9516,101.5401,'2026-10-02T08:30:00+07:00','กลิ่นเหม็นบริเวณกองขยะชุมชน',['strong_odor']],
  ['R-208',13.9181,101.6254,'2026-10-02T09:55:00+07:00','น้ำในบ่อสาธารณะเปลี่ยนเป็นสีเขียว',['water_discoloration']],
  ['R-209',13.9708,101.6118,'2026-10-02T11:03:00+07:00','เห็นควันดำและได้กลิ่นไหม้ใกล้ถนน',['unknown','strong_odor']],
  ['R-210',13.9694,101.6102,'2026-10-02T11:17:00+07:00','มีควันหนาทึบจากจุดเดิมริมถนน',['unknown']],
  ['R-301',13.8891,101.5267,'2026-10-02T13:05:00+07:00','คลองฝั่งตลาดมีกลิ่นเหม็นและมีฟอง',['strong_odor','foam']],
  ['R-302',13.8898,101.5274,'2026-10-02T13:18:00+07:00','เห็นฟองขาวลอยตามน้ำใกล้ตลาด',['foam']],
  ['R-303',13.8885,101.5280,'2026-10-02T13:31:00+07:00','น้ำเสียไหลออกจากท่อและมีกลิ่น',['wastewater','strong_odor']],
  ['R-401',14.0212,101.4810,'2026-09-28T15:20:00+07:00','พบปลาตายในบ่อเลี้ยงส่วนบุคคล',['dead_fish']],
  ['R-402',13.9050,101.6902,'2026-10-02T07:05:00+07:00','มีคราบสีรุ้งเล็กน้อยบนแอ่งน้ำริมถนน',['rainbow_surface_film']],
  ['R-403',13.9990,101.5532,'2026-10-01T19:40:00+07:00','ได้กลิ่นสารเคมีเป็นช่วง ๆ ใกล้โกดัง',['strong_odor']],
  ['R-404',13.8604,101.6115,'2026-10-02T12:15:00+07:00','พบขยะก่อสร้างถูกทิ้งริมคลอง',['illegal_dumping']],
].map(([id,latitude,longitude,timestamp,description,observations])=>({id,latitude,longitude,timestamp,description,observations,source:id==='R-108'?'prototype':'mock-traffy',imageUrl:id==='R-108'?'/assets/canal-evidence.png':undefined,status:'received'} as NormalizedReport))

export class MockTraffyProvider implements IncidentDataProvider{
  async findNearbyReports(_query:NearbyQuery){return seeded}
  async getReport(id:string){return seeded.find(r=>r.id===id)}
}

export class TraffyProvider implements IncidentDataProvider{
  async findNearbyReports(_query:NearbyQuery):Promise<NormalizedReport[]>{throw new Error('ยังไม่ได้กำหนด documented Traffy endpoint/response mapper')}
  async getReport(_id:string):Promise<NormalizedReport|undefined>{throw new Error('ยังไม่ได้กำหนด documented Traffy endpoint/response mapper')}
}

export async function getNearbyReports(query:NearbyQuery){
  if(config.traffyLive&&config.traffyBaseUrl&&config.traffyApiKey){
    try{return {reports:await new TraffyProvider().findNearbyReports(query),source:'traffy',sourceLabelTh:'ข้อมูล Traffy Fondue',mock:false}}
    catch(error){log('traffy_fallback',{reason:error instanceof Error?error.message:'unknown'})}
  }
  return {reports:await new MockTraffyProvider().findNearbyReports(query),source:'mock-traffy',sourceLabelTh:'ข้อมูลจำลองสำหรับ Prototype',mock:true}
}

export interface IndustrialContextProvider{get(latitude:number,longitude:number):Promise<IncidentContext['industrial']>}
export interface FloodContextProvider{get(latitude:number,longitude:number):Promise<IncidentContext['flood']>}
export interface HistoricalIncidentProvider{get(latitude:number,longitude:number):Promise<IncidentContext['history']>}
export class MockIndustrialProvider implements IndustrialContextProvider{async get(_latitude:number,_longitude:number){const nearest=mockFactories[0];return {value:{distanceMeters:420,name:nearest.name},source:nearest.source,sourceLabelTh:'ข้อมูลทะเบียนโรงงาน (Mock)',mock:true}}}
export class MockFloodProvider implements FloodContextProvider{async get(_latitude:number,_longitude:number){return {value:{affected:mockFloodZones[0].affected},source:'prototype_flood_dataset',sourceLabelTh:'ข้อมูลพื้นที่น้ำท่วม (Mock)',mock:true}}}
export class MockHistoryProvider implements HistoricalIncidentProvider{async get(_latitude:number,_longitude:number){return {value:{nearbyCount:mockHistoricalIncidents.filter(i=>i.distanceMeters<=500).length},source:'prototype_incident_history',sourceLabelTh:'ประวัติเหตุการณ์จำลอง',mock:true}}}
export async function getContext(lat:number,lng:number):Promise<IncidentContext>{const [industrial,flood,history]=await Promise.all([new MockIndustrialProvider().get(lat,lng),new MockFloodProvider().get(lat,lng),new MockHistoryProvider().get(lat,lng)]);return {industrial,flood,history,safety:{value:{guidanceTh:mockSafetyKnowledge[0].guidanceTh},source:mockSafetyKnowledge[0].source,sourceLabelTh:'ฐานความรู้หน่วยงาน (Mock/RAG)',mock:true}}}
