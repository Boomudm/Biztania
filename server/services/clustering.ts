import type { NormalizedReport } from '../types/contracts.js'
const rad=(n:number)=>n*Math.PI/180
export function distanceMeters(a:NormalizedReport,b:NormalizedReport){const R=6371e3,dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude);const x=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
const aliases:Record<string,string[]>= {strong_odor:['กลิ่น','เหม็น','ฉุน'],dead_fish:['ปลาตาย','ปลาลอย'],rainbow_surface_film:['คราบ','สีรุ้ง','ผิวน้ำ'],water_discoloration:['น้ำขุ่น','สีเปลี่ยน'],wastewater:['น้ำเสีย','น้ำทิ้ง']}
export function normalizedSignals(report:NormalizedReport){const found=new Set(report.observations);for(const [signal,words] of Object.entries(aliases))if(words.some(w=>report.description.includes(w)))found.add(signal);return found}
export function semanticSimilarity(a:NormalizedReport,b:NormalizedReport){const left=normalizedSignals(a),right=normalizedSignals(b),intersection=[...left].filter(x=>right.has(x)).length,union=new Set([...left,...right]).size;return union?intersection/union:0}
export function compareReports(a:NormalizedReport,b:NormalizedReport){const distance=distanceMeters(a,b),minutes=Math.abs(Date.parse(a.timestamp)-Date.parse(b.timestamp))/60000;const spatial=Math.max(0,1-distance/600),temporal=Math.max(0,1-minutes/180),semantic=semanticSimilarity(a,b);return {spatial,temporal,semantic,total:.4*spatial+.3*temporal+.3*semantic,distanceMeters:distance,timeMinutes:minutes}}
export function clusterReports(anchor:NormalizedReport,reports:NormalizedReport[]){return reports.filter(r=>distanceMeters(anchor,r)<=500&&Math.abs(Date.parse(anchor.timestamp)-Date.parse(r.timestamp))<=2*60*60*1000)}
export const CLUSTER_WEIGHTS={spatial:.4,temporal:.3,semantic:.3} as const
export const CLUSTER_NOTE_TH='ตรรกะความคล้ายคลึงสำหรับ Prototype ยังไม่ผ่านการรับรองทางวิทยาศาสตร์'
