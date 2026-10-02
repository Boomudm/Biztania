export type Submission = { trackingId:string; integration:'mock'; submittedAt:string }
export interface ReportingAdapter { getNearbyIssues(lat:number,lng:number):Promise<string[]>; createIssue(payload:unknown):Promise<Submission> }
class MockTraffyAdapter implements ReportingAdapter { async getNearbyIssues(){ return ['PB-024'] } async createIssue(_payload:unknown):Promise<Submission>{ await new Promise(r=>setTimeout(r,900)); return {trackingId:'PB-024',integration:'mock',submittedAt:new Date().toISOString()} } }
export const reportingIntegration:ReportingAdapter = new MockTraffyAdapter()
