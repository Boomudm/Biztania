import { config } from '../services/config.js'
export type SubmissionResult={trackingId:string;provider:'mock'|'traffy';mock:boolean;statusLabelTh:string;submittedAt:string}
export interface SubmissionProvider{submitIncident(payload:unknown):Promise<SubmissionResult>}
export class MockSubmissionProvider implements SubmissionProvider{async submitIncident(_payload:unknown){return {trackingId:'ECO-PB-024',provider:'mock' as const,mock:true,statusLabelTh:'สถานะจำลองสำหรับ Prototype',submittedAt:new Date().toISOString()}}}
export class TraffySubmissionProvider implements SubmissionProvider{async submitIncident(_payload:unknown):Promise<SubmissionResult>{throw new Error('Live submission requires a documented API and explicit authorization')}}
export async function submitIncident(payload:unknown){if(config.traffyLive&&config.traffyBaseUrl&&config.traffyApiKey)return new TraffySubmissionProvider().submitIncident(payload);return new MockSubmissionProvider().submitIncident(payload)}
