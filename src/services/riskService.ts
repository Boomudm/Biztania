import type { Report, RiskResult } from '../types'
export function assessRisk(cluster:Report[]):RiskResult { const odor=cluster.filter(r=>r.observations.includes('strong-odor')).length; const fish=cluster.filter(r=>r.observations.includes('dead-fish')).length; const factors=[
  {label:'Multiple independent reports',detail:`${cluster.length} reports in the same pattern`,points:25,source:'Citizen report index',icon:'users'},
  {label:'Strong spatial cluster',detail:'Reports fall within 500 m',points:20,source:'GPS coordinates',icon:'map'},
  {label:'Flood context',detail:'Location is inside an affected zone',points:15,source:'Mock flood layer · DDPM',icon:'waves'},
  {label:'Industrial proximity',detail:'Registered industrial area 420 m away',points:12,source:'Mock factory registry',icon:'factory'},
  {label:'Biological signal',detail:`${fish} reports mention dead fish`,points:10,source:'Structured observations',icon:'fish'},
  {label:'Historical context',detail:'2 previous incidents recorded nearby',points:5,source:'Mock incident history',icon:'history'}
]; const score=factors.reduce((s,f)=>s+f.points,0); return {score,level:score>=90?'Critical':score>=70?'High':score>=40?'Medium':'Low',factors} }
