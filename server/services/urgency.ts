import type { IncidentContext, NormalizedReport, UrgencyResult } from '../types/contracts.js'
export const URGENCY_WEIGHTS={multipleReports:25,spatialCluster:20,floodContext:15,industrialProximity:12,biologicalSignal:10,historicalRecurrence:5} as const
export function assessUrgency(cluster:NormalizedReport[],context:IncidentContext):UrgencyResult{const fish=cluster.filter(r=>r.observations.includes('dead_fish')).length;const factors=[
 {label_th:'มีรายงานหลายรายการในพื้นที่เดียวกัน',contribution:cluster.length>=5?URGENCY_WEIGHTS.multipleReports:0,source:'citizen_reports'},
 {label_th:'รายงานรวมตัวหนาแน่นภายในประมาณ 500 เมตร',contribution:cluster.length>=5?URGENCY_WEIGHTS.spatialCluster:0,source:'gps_coordinates'},
 {label_th:'อยู่ในพื้นที่ได้รับผลกระทบจากน้ำท่วม',contribution:context.flood.value.affected?URGENCY_WEIGHTS.floodContext:0,source:context.flood.source},
 {label_th:'อยู่ใกล้พื้นที่อุตสาหกรรม',contribution:context.industrial.value.distanceMeters<=500?URGENCY_WEIGHTS.industrialProximity:0,source:context.industrial.source},
 {label_th:`มีสัญญาณปลาตายใน ${fish} รายงาน`,contribution:fish>=3?URGENCY_WEIGHTS.biologicalSignal:0,source:'structured_observations'},
 {label_th:'เคยมีเหตุการณ์ใกล้เคียงในอดีต',contribution:context.history.value.nearbyCount>0?URGENCY_WEIGHTS.historicalRecurrence:0,source:context.history.source},
];const score=factors.reduce((sum,f)=>sum+f.contribution,0);return {score,level:score>=90?'critical':score>=70?'high':score>=40?'medium':'low',factors,assumptionNoteTh:'น้ำหนักสำหรับการจัดลำดับความสำคัญของ Prototype ไม่ใช่เกณฑ์การปนเปื้อนทางวิทยาศาสตร์'}}
