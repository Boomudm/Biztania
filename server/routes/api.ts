import { Router } from 'express'
import { ZodError } from 'zod'
import { evidenceRequestSchema } from '../types/contracts.js'
import { analyzeIncident } from '../services/orchestrator.js'
import { submitIncident } from '../providers/submissionProviders.js'
import { config } from '../services/config.js'

export const apiRouter=Router()
apiRouter.get('/health',(_req,res)=>res.json({ok:true,demoMode:config.demoMode,openaiConfigured:Boolean(config.openaiApiKey),traffyMode:config.traffyLive?'live':'mock'}))
apiRouter.post('/analyze',async(req,res,next)=>{try{const input=evidenceRequestSchema.parse(req.body);res.json(await analyzeIncident(input))}catch(error){if(error instanceof ZodError)return res.status(400).json({error:'invalid_request',details:error.issues.map(i=>({path:i.path.join('.'),message:i.message}))});next(error)}})
apiRouter.post('/submit',async(req,res,next)=>{try{if(!req.body?.incidentId)return res.status(400).json({error:'invalid_request'});res.json(await submitIncident(req.body))}catch(error){next(error)}})
