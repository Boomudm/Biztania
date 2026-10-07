import { submitIncident } from '../server/providers/submissionProviders.js'
import { methodNotAllowed, serviceUnavailable, type FunctionRequest, type FunctionResponse } from './_types.js'

export default async function handler(req:FunctionRequest,res:FunctionResponse){
  if(req.method!=='POST')return methodNotAllowed(res,'POST')
  try{
    if(!req.body||typeof req.body!=='object'||!('incidentId' in req.body)){
      return res.status(400).json({error:'invalid_request'})
    }
    return res.status(200).json(await submitIncident(req.body as Parameters<typeof submitIncident>[0]))
  }catch(error){
    return serviceUnavailable(res,error)
  }
}
