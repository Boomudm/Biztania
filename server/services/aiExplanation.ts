import OpenAI from 'openai'
import { z } from 'zod'
import type { IncidentContext, UrgencyResult } from '../types/contracts.js'
import { config } from './config.js'
import { log } from './logger.js'
const schema=z.object({explanation_th:z.string().min(1).max(700)})
const jsonSchema={type:'object',additionalProperties:false,required:['explanation_th'],properties:{explanation_th:{type:'string'}}} as const
export async function explainGrounded(input:{reportCount:number;clusterConfidence:number;urgency:UrgencyResult;context:IncidentContext}){
 const fallback=`พบรายงาน ${input.reportCount} รายการที่สัมพันธ์กันด้านตำแหน่ง เวลา และสิ่งที่พบ เมื่อรวมกับบริบทพื้นที่จึงได้ระดับความเร่งด่วน ${input.urgency.score}/100 และควรตรวจสอบภาคสนามโดยเร็ว`
 if(!config.openaiApiKey)return fallback
 try{const client=new OpenAI({apiKey:config.openaiApiKey,timeout:12_000,maxRetries:1});const response=await client.responses.create({model:config.openaiModel,instructions:'สรุปเหตุผลการจัดลำดับความเร่งด่วนเป็นภาษาไทยไม่เกิน 2 ประโยค ใช้เฉพาะข้อมูล JSON ที่ให้มา ห้ามเพิ่มหลักฐาน ห้ามระบุชนิดสารเคมี และต้องระบุว่าต้องตรวจสอบภาคสนาม',input:JSON.stringify(input),text:{format:{type:'json_schema',name:'eco_alert_grounded_explanation',strict:true,schema:jsonSchema}}});return schema.parse(JSON.parse(response.output_text)).explanation_th}catch(error){log('openai_explanation_fallback',{reason:error instanceof Error?error.message:'unknown'});return fallback}
}
