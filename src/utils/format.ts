export const formatTime=(iso:string)=>new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Bangkok'}).format(new Date(iso))
