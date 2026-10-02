export function log(event:string,data:Record<string,unknown>={}){console.info(JSON.stringify({time:new Date().toISOString(),event,...data}))}
