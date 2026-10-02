export type Observation = 'discolored-water' | 'rainbow-film' | 'strong-odor' | 'dead-fish' | 'wastewater' | 'smoke'
export type Report = { id:string; latitude:number; longitude:number; timestamp:string; description:string; observations:Observation[]; image?:string }
export type Similarity = { spatial:number; temporal:number; semantic:number; total:number; distanceM:number; timeMinutes:number }
export type RiskFactor = { label:string; detail:string; points:number; source:string; icon:string }
export type RiskResult = { score:number; level:'Low'|'Medium'|'High'|'Critical'; factors:RiskFactor[] }
