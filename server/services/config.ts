export const config={
  openaiApiKey:process.env.OPENAI_API_KEY?.trim()||'',
  openaiModel:process.env.OPENAI_MODEL?.trim()||'gpt-4.1-mini',
  traffyBaseUrl:process.env.TRAFFY_API_BASE_URL?.trim()||'',
  traffyApiKey:process.env.TRAFFY_API_KEY?.trim()||'',
  traffyLive:process.env.TRAFFY_LIVE==='true',
  demoMode:process.env.DEMO_MODE!=='false',
  port:Number(process.env.PORT||8787),
}
