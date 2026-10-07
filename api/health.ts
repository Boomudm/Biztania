import { config } from '../server/services/config.js'
import { methodNotAllowed, type FunctionRequest, type FunctionResponse } from './_types.js'

export default function handler(req:FunctionRequest,res:FunctionResponse){
  if(req.method!=='GET')return methodNotAllowed(res,'GET')
  return res.status(200).json({
    ok:true,
    demoMode:config.demoMode,
    openaiConfigured:Boolean(config.openaiApiKey),
    traffyMode:config.traffyLive?'live':'mock',
  })
}
