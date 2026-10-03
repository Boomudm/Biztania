import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { apiRouter } from './routes/api.js'
import { config } from './services/config.js'
import { log } from './services/logger.js'

const app=express()
const appRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const distDir=path.join(appRoot,'dist')
app.disable('x-powered-by')
app.use(express.json({limit:'7mb',type:'application/json'}))
app.use('/api',apiRouter)
app.use(express.static(distDir))
app.use((req,res,next)=>{
  if(req.method!=='GET'||req.path.startsWith('/api'))return next()
  res.sendFile(path.join(distDir,'index.html'),error=>error?next(error):undefined)
})
app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{log('api_error',{reason:error instanceof Error?error.message:'unknown'});res.status(500).json({error:'service_unavailable',messageTh:'ระบบกำลังใช้ข้อมูลสาธิตเพื่อให้การนำเสนอดำเนินต่อได้'})})
app.listen(config.port,'0.0.0.0',()=>log('server_started',{port:config.port,demoMode:config.demoMode,openaiConfigured:Boolean(config.openaiApiKey),traffyLive:config.traffyLive}))
