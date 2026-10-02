import express from 'express'
import { apiRouter } from './routes/api.js'
import { config } from './services/config.js'
import { log } from './services/logger.js'

const app=express()
app.disable('x-powered-by')
app.use(express.json({limit:'7mb',type:'application/json'}))
app.use('/api',apiRouter)
app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{log('api_error',{reason:error instanceof Error?error.message:'unknown'});res.status(500).json({error:'service_unavailable',messageTh:'ระบบกำลังใช้ข้อมูลสาธิตเพื่อให้การนำเสนอดำเนินต่อได้'})})
app.listen(config.port,'127.0.0.1',()=>log('server_started',{port:config.port,demoMode:config.demoMode,openaiConfigured:Boolean(config.openaiApiKey),traffyLive:config.traffyLive}))
