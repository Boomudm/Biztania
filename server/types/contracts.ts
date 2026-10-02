import { z } from 'zod'

export const observationTypes = ['water_discoloration','rainbow_surface_film','strong_odor','dead_fish','foam','wastewater','illegal_dumping','unknown'] as const
export const evidenceRequestSchema = z.object({
  description: z.string().trim().min(1).max(3000),
  selectedObservations: z.array(z.string().max(80)).max(20).default([]),
  timestamp: z.string().datetime({ offset: true }),
  location: z.object({ latitude:z.number().min(-90).max(90), longitude:z.number().min(-180).max(180), label:z.string().max(200).optional() }),
  imageDataUrl: z.string().max(7_000_000).optional().refine(v=>!v||/^data:image\/(jpeg|png|webp);base64,/.test(v),'รองรับเฉพาะ JPEG, PNG หรือ WebP'),
})
export type EvidenceRequest=z.infer<typeof evidenceRequestSchema>

export const aiUnderstandingSchema=z.object({
  summary_th:z.string().min(1).max(600),
  observations:z.array(z.object({type:z.enum(observationTypes),label_th:z.string().min(1).max(100),evidence:z.string().min(1).max(500)})).max(20),
  environmental_signals:z.array(z.string().max(200)).max(20),
  possible_categories:z.array(z.string().max(100)).max(10),
  needs_field_verification:z.literal(true),
  chemical_identity:z.literal('unknown'),
  confidence_note_th:z.string().min(1).max(500),
})
export type AIUnderstanding=z.infer<typeof aiUnderstandingSchema>

export type NormalizedReport={id:string;source:'prototype'|'mock-traffy'|'traffy';latitude:number;longitude:number;timestamp:string;description:string;observations:string[];category?:string;imageUrl?:string;status?:string}
export type SourceValue<T>={value:T;source:string;sourceLabelTh:string;mock:boolean}
export type IncidentContext={industrial:SourceValue<{distanceMeters:number;name:string}>;flood:SourceValue<{affected:boolean}>;history:SourceValue<{nearbyCount:number}>;safety:SourceValue<{guidanceTh:string[]}>}
export type UrgencyFactor={label_th:string;contribution:number;source:string}
export type UrgencyResult={score:number;level:'low'|'medium'|'high'|'critical';factors:UrgencyFactor[];assumptionNoteTh:string}
export type OfficerReport={incidentId:string;location:EvidenceRequest['location'];timeRange:{start:string;end:string};citizenReportCount:number;evidence:{description:string;imageIncluded:boolean};structuredObservations:AIUnderstanding['observations'];relatedReportIds:string[];context:IncidentContext;clusterConfidence:number;urgency:UrgencyResult;summaryTh:string;verificationRequired:string;responsibleAiNotice:string}
export type ConciergeResult={mode:'live'|'demo-fallback';understanding:AIUnderstanding;nearbyReports:{reports:NormalizedReport[];source:string;sourceLabelTh:string;mock:boolean};cluster:{reports:NormalizedReport[];confidence:number;logicNoteTh:string};context:IncidentContext;urgency:UrgencyResult;explanationTh:string;officerReport:OfficerReport;warnings:string[]}
