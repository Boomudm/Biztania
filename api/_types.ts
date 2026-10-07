export type FunctionRequest={
  method?:string
  body?:unknown
}

export type FunctionResponse={
  status:(code:number)=>FunctionResponse
  json:(body:unknown)=>void
  setHeader:(name:string,value:string)=>void
}

export function methodNotAllowed(res:FunctionResponse,allowed:string){
  res.setHeader('Allow',allowed)
  return res.status(405).json({error:'method_not_allowed'})
}

export function serviceUnavailable(res:FunctionResponse,error:unknown){
  console.error('vercel_function_error',error instanceof Error?error.message:'unknown')
  return res.status(500).json({
    error:'service_unavailable',
    messageTh:'ระบบกำลังใช้ข้อมูลสาธิตเพื่อให้การนำเสนอดำเนินต่อได้',
  })
}
