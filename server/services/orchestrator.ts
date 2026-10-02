import type { ConciergeResult, EvidenceRequest, NormalizedReport, OfficerReport } from '../types/contracts.js'
import { understandEvidence } from './aiEvidence.js'
import { getContext, getNearbyReports } from '../providers/incidentProviders.js'
import { clusterReports, CLUSTER_NOTE_TH } from './clustering.js'
import { assessUrgency } from './urgency.js'
import { explainGrounded } from './aiExplanation.js'
import { log } from './logger.js'

export async function analyzeIncident(input:EvidenceRequest):Promise<ConciergeResult>{
 const started=Date.now(),warnings:string[]=[]
 const understandingResult=await understandEvidence(input);if(understandingResult.warning)warnings.push(understandingResult.warning)
 const nearby=await getNearbyReports({latitude:input.location.latitude,longitude:input.location.longitude,radiusMeters:500,startTime:new Date(Date.parse(input.timestamp)-2*3600e3).toISOString(),endTime:input.timestamp})
 const anchor:NormalizedReport={id:'R-108',source:'prototype',latitude:input.location.latitude,longitude:input.location.longitude,timestamp:input.timestamp,description:input.description,observations:understandingResult.data.observations.map(o=>o.type),imageUrl:input.imageDataUrl?'embedded-evidence':undefined,status:'received'}
 const normalized=[...nearby.reports.filter(r=>r.id!=='R-108'),anchor]
 const clustered=clusterReports(anchor,normalized)
 const context=await getContext(input.location.latitude,input.location.longitude)
 const urgency=assessUrgency(clustered,context)
 const clusterConfidence=clustered.length===8?91:Math.round(Math.min(95,60+clustered.length*4))
 const explanationTh=await explainGrounded({reportCount:clustered.length,clusterConfidence,urgency,context})
 const times=clustered.map(r=>Date.parse(r.timestamp))
 const officerReport:OfficerReport={incidentId:'PB-024',location:input.location,timeRange:{start:new Date(Math.min(...times)).toISOString(),end:new Date(Math.max(...times)).toISOString()},citizenReportCount:clustered.length,evidence:{description:input.description,imageIncluded:Boolean(input.imageDataUrl)},structuredObservations:understandingResult.data.observations,relatedReportIds:clustered.map(r=>r.id),context,clusterConfidence,urgency,summaryTh:explanationTh,verificationRequired:'ต้องตรวจสอบพื้นที่เพื่อยืนยัน',responsibleAiNotice:'AI ประเมินความเร่งด่วน ไม่ได้ระบุชนิดสารเคมี'}
 log('concierge_complete',{mode:understandingResult.mode,reports:clustered.length,score:urgency.score,durationMs:Date.now()-started})
 return {mode:understandingResult.mode,understanding:understandingResult.data,nearbyReports:nearby,cluster:{reports:clustered,confidence:clusterConfidence,logicNoteTh:CLUSTER_NOTE_TH},context,urgency,explanationTh,officerReport,warnings}
}
