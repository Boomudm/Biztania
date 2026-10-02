import { reports } from '../data/reports'
export const reportService = { async list(){ return reports }, async get(id:string){ return reports.find(r=>r.id===id) } }
