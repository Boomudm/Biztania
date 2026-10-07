import { ZodError } from 'zod'
import { evidenceRequestSchema } from '../server/types/contracts.js'
import { analyzeIncident } from '../server/services/orchestrator.js'
import { methodNotAllowed, serviceUnavailable, type FunctionRequest, type FunctionResponse } from './_types.js'

export default async function handler(req:FunctionRequest,res:FunctionResponse){
  if(req.method!=='POST')return methodNotAllowed(res,'POST')
  try{
    const input=evidenceRequestSchema.parse(req.body)
    return res.status(200).json(await analyzeIncident(input))
  }catch(error){
    if(error instanceof ZodError){
      return res.status(400).json({
        error:'invalid_request',
        details:error.issues.map(issue=>({path:issue.path.join('.'),message:issue.message})),
      })
    }
    return serviceUnavailable(res,error)
  }
}
