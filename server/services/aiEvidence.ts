import OpenAI from 'openai'
import { aiUnderstandingSchema, type AIUnderstanding, type EvidenceRequest } from '../types/contracts.js'
import { config } from './config.js'
import { log } from './logger.js'

const systemInstruction=`คุณคือองค์ประกอบทำความเข้าใจหลักฐานของ Eco-Alert AI Concierge
หน้าที่ของคุณคือแปลงรายงานเหตุสิ่งแวดล้อมจากประชาชนเป็นข้อสังเกตแบบมีโครงสร้าง
คุณอธิบายได้เฉพาะสิ่งที่ประชาชนรายงานหรือสิ่งที่มองเห็นได้
ห้ามระบุชนิดสารเคมีจากภาพ ห้ามยืนยันว่ามีการปนเปื้อนทางวิทยาศาสตร์ และห้ามสร้างหลักฐานใหม่
แยกข้อมูลที่ประชาชนรายงาน สิ่งที่มองเห็น บริบท และข้ออนุมานให้ชัดเจน
chemical_identity ต้องเป็น unknown และ needs_field_verification ต้องเป็น true เสมอ
การระบุชนิดสารต้องใช้การตรวจภาคสนามหรือห้องปฏิบัติการ`

const outputSchema={type:'object',additionalProperties:false,required:['summary_th','observations','environmental_signals','possible_categories','needs_field_verification','chemical_identity','confidence_note_th'],properties:{summary_th:{type:'string'},observations:{type:'array',items:{type:'object',additionalProperties:false,required:['type','label_th','evidence'],properties:{type:{type:'string',enum:['water_discoloration','rainbow_surface_film','strong_odor','dead_fish','foam','wastewater','illegal_dumping','unknown']},label_th:{type:'string'},evidence:{type:'string'}}}},environmental_signals:{type:'array',items:{type:'string'}},possible_categories:{type:'array',items:{type:'string'}},needs_field_verification:{type:'boolean',const:true},chemical_identity:{type:'string',const:'unknown'},confidence_note_th:{type:'string'}}} as const

export function deterministicUnderstanding(input:EvidenceRequest):AIUnderstanding{const checks=[['rainbow_surface_film','คราบสีรุ้ง',/คราบ|สีรุ้ง/],['strong_odor','กลิ่นฉุน',/กลิ่น|เหม็น|ฉุน/],['dead_fish','ปลาตาย',/ปลาตาย|ปลาลอย/],['water_discoloration','น้ำเปลี่ยนสี',/สีเปลี่ยน|น้ำขุ่น/],['wastewater','น้ำเสีย',/น้ำเสีย|น้ำทิ้ง/]] as const;const observations=checks.filter(([,label,re])=>re.test(input.description)||input.selectedObservations.some(x=>x.includes(label))).map(([type,label_th])=>({type,label_th,evidence:`ประชาชนรายงานว่า “${label_th}”`}));return {summary_th:'พบสัญญาณผิดปกติของแหล่งน้ำจากคำบรรยายและหลักฐานที่ประชาชนส่งมา',observations:observations.length?observations:[{type:'unknown',label_th:'เหตุผิดปกติที่ยังจัดประเภทไม่ได้',evidence:input.description}],environmental_signals:['เหตุผิดปกติในแหล่งน้ำ','ต้องตรวจสอบพื้นที่'],possible_categories:['คุณภาพน้ำผิดปกติ'],needs_field_verification:true,chemical_identity:'unknown',confidence_note_th:'เป็นการจัดโครงสร้างหลักฐานเบื้องต้น ไม่ใช่ผลตรวจยืนยัน'}}

export async function understandEvidence(input:EvidenceRequest):Promise<{data:AIUnderstanding;mode:'live'|'demo-fallback';warning?:string}>{
 if(!config.openaiApiKey){return {data:deterministicUnderstanding(input),mode:'demo-fallback',warning:'ไม่ได้ตั้งค่า OPENAI_API_KEY จึงใช้ตัววิเคราะห์แบบกำหนดผลลัพธ์'}}
 try{const client=new OpenAI({apiKey:config.openaiApiKey,timeout:15_000,maxRetries:1});const content:any[]=[{type:'input_text',text:JSON.stringify({description:input.description,selected_observations:input.selectedObservations,timestamp:input.timestamp,approximate_location:input.location})}];if(input.imageDataUrl)content.push({type:'input_image',image_url:input.imageDataUrl,detail:'low'});const response=await client.responses.create({model:config.openaiModel,instructions:systemInstruction,input:[{role:'user',content}],text:{format:{type:'json_schema',name:'eco_alert_evidence_understanding',strict:true,schema:outputSchema}}});const parsed=aiUnderstandingSchema.parse(JSON.parse(response.output_text));return {data:parsed,mode:'live'}
 }catch(error){log('openai_fallback',{reason:error instanceof Error?error.message:'unknown'});if(!config.demoMode)throw error;return {data:deterministicUnderstanding(input),mode:'demo-fallback',warning:'OpenAI ไม่พร้อมใช้งาน จึงใช้ผลวิเคราะห์สาธิตแบบกำหนดไว้'}}
}
