const express=require('express');
const cors=require('cors');
const path=require('path');
const app=express();
app.use(cors());app.use(express.json({limit:'22mb'}));app.use(express.static(__dirname));
app.get('/',(_,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/api/status',(_,res)=>res.json({success:true,service:'Aluniverse Backend',version:'6.2.0',groq:!!process.env.GROQ_API_KEY,replicate:!!process.env.REPLICATE_API_TOKEN}));
app.get('/api/health',(_,res)=>res.json({success:true,status:'healthy'}));
const clean=x=>String(x||'').trim().replace(/^["']|["']$/g,'');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function request(url,opts={},ms=45000){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),ms);try{const r=await fetch(url,{...opts,signal:controller.signal});const raw=await r.text();let data;try{data=JSON.parse(raw)}catch{data={detail:raw.slice(0,300)}}if(!r.ok)throw new Error(String(data?.detail?.message||data?.detail||data?.error?.message||data?.error||`HTTP ${r.status}`).slice(0,400));return data}finally{clearTimeout(timer)}}
app.post('/api/ai',async(req,res)=>{try{const message=String(req.body?.message||'').trim();if(!message)return res.status(400).json({success:false,error:'درخواست خالی است.'});const token=clean(process.env.GROQ_API_KEY);if(!token)throw Error('کلید Groq تنظیم نشده است.');const data=await request('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.GROQ_MODEL||'openai/gpt-oss-20b',messages:[{role:'system',content:'You are Aluniverse AI. Respond in the user language.'},{role:'user',content:message}],max_tokens:1500})});res.json({success:true,answer:data?.choices?.[0]?.message?.content||'پاسخی دریافت نشد.'})}catch(e){console.error('AI:',e.message);res.status(502).json({success:false,error:e.message})}});
const base='https://api.replicate.com/v1';
const models={image:process.env.REPLICATE_IMAGE_MODEL||'black-forest-labs/flux-schnell',image_edit:process.env.REPLICATE_EDIT_MODEL||'',video:process.env.REPLICATE_VIDEO_MODEL||'minimax/video-01',animation:process.env.REPLICATE_ANIMATION_MODEL||'minimax/video-01'};
function urlOf(out){if(typeof out==='string')return out;if(Array.isArray(out))return out.map(urlOf).find(Boolean)||null;if(out&&typeof out==='object'){if(typeof out.url==='string')return out.url;if(typeof out.url==='function')return String(out.url());}return null}
function validUrl(url){return typeof url==='string'&&/^https:\/\//i.test(url)}

// A short-lived deduplication registry; requests survive page refresh while the server stays up.
const jobs=new Map();
const TERMINAL=new Set(['succeeded','failed','canceled']);
const supportedRatios=new Set(['1:1','16:9','9:16','4:3','3:4']);
async function translatePrompt(prompt){
  const key=clean(process.env.GROQ_API_KEY);
  if(!key)throw Error('برای ترجمه خودکار، کلید GROQ_API_KEY در Render لازم است.');
  const data=await request('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify({model:process.env.GROQ_MODEL||'openai/gpt-oss-20b',temperature:0,
      messages:[{role:'system',content:'Translate the user visual generation prompt faithfully into clear English for an image/video generator. Preserve subjects, actions, exact details and intent. Do not invent details. Return ONLY the English prompt, without quotes or commentary.'},{role:'user',content:prompt}],max_tokens:700})
  },35000);
  const result=String(data?.choices?.[0]?.message?.content||'').trim();
  if(!result)throw Error('ترجمه پرامپت ناموفق بود؛ درخواست تولید ارسال نشد.');
  return result;
}
function replicateHeaders(){const token=clean(process.env.REPLICATE_API_TOKEN);if(!token)throw Error('توکن Replicate تنظیم نشده است.');return {Authorization:`Bearer ${token}`,'Content-Type':'application/json'};}
function getModel(kind,reference){const model=reference&&kind==='image'?models.image_edit:models[kind];if(!model)throw Error('برای ویرایش تصویر، REPLICATE_EDIT_MODEL در Render تنظیم نشده است.');return model;}
function predictionInput(kind,prompt,reference,ratio){
  const input={prompt};
  if(kind==='image'&&!reference){input.aspect_ratio=ratio||'1:1';input.num_outputs=1;input.output_format='png';}
  if(reference){
    if(!/^data:image\/(png|jpeg|webp);base64,/.test(reference)&&!validUrl(reference))throw Error('فرمت تصویر مرجع معتبر نیست.');
    if(kind==='image')input.input_image=reference;else input.first_frame_image=reference;
  }
  // minimax/video-01 currently produces a fixed short clip; unsupported controls are not sent.
  return input;
}
function normalize(p,kind){const url=urlOf(p.output);return {success:p.status==='succeeded',type:kind,status:p.status,prediction_id:p.id,url:validUrl(url)?url:null,image:kind==='image'?url:undefined,video:kind!=='image'?url:undefined,error:p.error||null};}
app.get('/api/media/config',(_,res)=>res.json({success:true,video:{model:models.video,durations:[5],resolution:['720p'],fps:[25],ratios:['16:9'],note:'مدل فعلی minimax/video-01 ویدئوی کوتاه با تنظیمات ثابت تولید می‌کند. انتخاب مدت و وضوح بیشتر نیازمند مدل دیگری است.'},image:{ratios:[...supportedRatios],editConfigured:!!models.image_edit}}));
app.post('/api/media/start',async(req,res)=>{
  try{
    const kind=String(req.body?.kind||'');if(!['image','video','animation'].includes(kind))return res.status(400).json({success:false,error:'نوع ابزار نامعتبر است.'});
    const prompt=String(req.body?.prompt||'').trim();if(!prompt||prompt.length>12000)return res.status(400).json({success:false,error:'متن درخواست خالی یا بیش از حد طولانی است.'});
    const key=String(req.body?.request_id||'');if(!/^[a-zA-Z0-9_-]{12,90}$/.test(key))return res.status(400).json({success:false,error:'شناسه درخواست معتبر نیست.'});
    if(jobs.has(key))return res.json({success:true,...jobs.get(key)});
    const reference=req.body?.reference||null;
    if(reference&&typeof reference!=='string')return res.status(400).json({success:false,error:'تصویر مرجع نامعتبر است.'});
    if(reference&&reference.length>9_000_000)return res.status(413).json({success:false,error:'تصویر مرجع بیش از حد بزرگ است.'});
    const ratio=req.body?.aspect_ratio||'1:1';if(kind==='image'&&!supportedRatios.has(ratio))return res.status(400).json({success:false,error:'نسبت تصویر نامعتبر است.'});
    const model=getModel(kind,reference);
    // The registry is reserved before any paid request; concurrent duplicate submissions are rejected.
    jobs.set(key,{status:'preparing',kind,created:Date.now()});
    try{
      const english=await translatePrompt(prompt);
      const prediction=await request(`${base}/models/${model}/predictions`,{method:'POST',headers:replicateHeaders(),body:JSON.stringify({input:predictionInput(kind,english,reference,ratio)})},45000);
      if(!prediction.id)throw Error('شناسه پردازش Replicate دریافت نشد.');
      const job={status:prediction.status,kind,prediction_id:prediction.id,created:Date.now(),english_prompt:english};jobs.set(key,job);
      console.log('MEDIA START',kind,prediction.id,prediction.status);
      return res.json({success:true,...job});
    }catch(e){jobs.delete(key);throw e;}
  }catch(e){console.error('MEDIA START ERROR',e.message);res.status(502).json({success:false,error:e.message});}
});
app.get('/api/media/status/:id',async(req,res)=>{
  try{
    const id=String(req.params.id||'');if(!/^[a-zA-Z0-9_-]{10,100}$/.test(id))return res.status(400).json({success:false,error:'شناسه نامعتبر است.'});
    const p=await request(`${base}/predictions/${id}`,{headers:replicateHeaders()},20000);
    const kind=String(req.query.kind||'video');res.json(normalize(p,kind));
  }catch(e){console.error('MEDIA STATUS ERROR',e.message);res.status(502).json({success:false,error:e.message});}
});
// Existing endpoints are retained for compatibility; new UI uses start/status.
for(const kind of ['image','video','animation'])app.post(`/api/${kind}`,(_,res)=>res.status(409).json({success:false,error:'لطفاً صفحه را تازه‌سازی کنید تا نسخه جدید بارگذاری شود.'}));
setInterval(()=>{for(const [k,v] of jobs)if(Date.now()-v.created>24*60*60*1000)jobs.delete(k)},3600000).unref();
app.listen(process.env.PORT||10000,()=>console.log('Aluniverse 6.2.0 ready'));
