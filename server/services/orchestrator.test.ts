import { describe, expect, it } from 'vitest'
import { deterministicUnderstanding } from './aiEvidence.js'
import { analyzeIncident } from './orchestrator.js'
import { compareReports, semanticSimilarity } from './clustering.js'
import type { EvidenceRequest, NormalizedReport } from '../types/contracts.js'

const input:EvidenceRequest={description:'น้ำมีกลิ่นฉุน มีคราบสีรุ้ง และพบปลาตาย',selectedObservations:['rainbow_surface_film','strong_odor','dead_fish'],timestamp:'2026-10-02T11:36:00+07:00',location:{latitude:13.9298,longitude:101.5741,label:'ปราจีนบุรี'}}

describe('server-side AI Concierge orchestration',()=>{
 it('keeps chemical identity unknown in deterministic fallback',()=>{const result=deterministicUnderstanding(input);expect(result.chemical_identity).toBe('unknown');expect(result.needs_field_verification).toBe(true);expect(result.observations.map(o=>o.type)).toEqual(expect.arrayContaining(['rainbow_surface_film','strong_odor','dead_fish']))})
 it('relates semantically similar Thai descriptions without embeddings',()=>{const a={id:'a',source:'prototype',latitude:13,longitude:101,timestamp:input.timestamp,description:'น้ำมีกลิ่นฉุน มีปลาตาย',observations:[]} as NormalizedReport;const b={...a,id:'b',description:'คลองเหม็นผิดปกติและพบปลาลอย'};expect(semanticSimilarity(a,b)).toBeGreaterThan(0);expect(compareReports(a,b).semantic).toBeGreaterThan(0)})
 it('guarantees the deterministic eight-report, 91%, 87/100 demo result',async()=>{const result=await analyzeIncident(input);expect(result.cluster.reports).toHaveLength(8);expect(result.cluster.confidence).toBe(91);expect(result.urgency.score).toBe(87);expect(result.officerReport.responsibleAiNotice).toContain('ไม่ได้ระบุชนิดสารเคมี');expect(result.nearbyReports.mock).toBe(true)})
})
