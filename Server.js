const express=require('express');
const cors=require('cors');
const path=require('path');
const app=express();
app.use(cors());app.use(express.json({limit:'22mb'}));app.use(express.static(__dirname));
app.get('/',(_,res)=>res.sendFile(path.join(__dirname,'index.html')));
const clean=x=>String(x||'').trim().replace(/^["']|["']$/g,'');
const supaUrl=()=>clean(process.env.SUPABASE_URL||process.env.SUPABASE_PROJECT_URL).replace(/\/$/,'');
const supaKey=()=>clean(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_KEY);
const galleryConfigured=()=>!!(supaUrl()&&supaKey());
app.get('/api/status',(_,res)=>res.json({success:true,service:'Aluniverse Backend',version:'6.6.6',groq:!!process.env.GROQ_API_KEY,replicate:!!process.env.REPLICATE_API_TOKEN,galleryConfigured:galleryConfigured()}));
app.get('/api/health',(_,res)=>res.json({success:true,status:'healthy'}));
async function request(url,opts={},ms=45000){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),ms);try{const r=await fetch(url,{...opts,signal:controller.signal});const raw=await r.text();let data;try{data=JSON.parse(raw)}catch{data={detail:raw.slice(0,300)}}if(!r.ok)throw new Error(String(data?.detail?.message||data?.detail||data?.error?.message||data?.error||`HTTP ${r.status}`).slice(0,400));return data}finally{clearTimeout(timer)}}
app.post('/api/ai',async(req,res)=>{try{const message=String(req.body?.message||'').trim();if(!message)return res.status(400).json({success:false,error:'درخواست خالی است.'});const token=clean(process.env.GROQ_API_KEY);if(!token)throw Error('کلید Groq تنظیم نشده است.');const data=await request('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.GROQ_MODEL||'openai/gpt-oss-20b',messages:[{role:'system',content:'You are Aluniverse AI. Respond in the user language.'},{role:'user',content:message}],max_tokens:1500})});res.json({success:true,answer:data?.choices?.[0]?.message?.content||'پاسخی دریافت نشد.'})}catch(e){console.error('AI:',e.message);res.status(502).json({success:false,error:e.message})}});
const base='https://api.replicate.com/v1';
const models={image:process.env.REPLICATE_IMAGE_MODEL||'black-forest-labs/flux-schnell',image_edit:process.env.REPLICATE_EDIT_MODEL||'',video:process.env.REPLICATE_VIDEO_MODEL||'minimax/video-01',animation:process.env.REPLICATE_ANIMATION_MODEL||'minimax/video-01',video10:process.env.REPLICATE_VIDEO_10_MODEL||'wan-video/wan-2.2-t2v-fast'};
function urlOf(out){if(typeof out==='string')return out;if(Array.isArray(out))return out.map(urlOf).find(Boolean)||null;if(out&&typeof out==='object'){if(typeof out.url==='string')return out.url;if(typeof out.url==='function')return String(out.url());}return null}
function validUrl(url){return typeof url==='string'&&/^https:\/\//i.test(url)}
const jobs=new Map();
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
const tenConfigured=()=>process.env.REPLICATE_VIDEO_10_ENABLED==='true';
function tenInput(){return {num_frames:121,frames_per_second:12,go_fast:true,resolution:'480p',aspect_ratio:'16:9',interpolate_output:true};}
function getModel(kind,reference,duration){if(kind==='video'&&duration===10){if(!tenConfigured())throw Error('مدل ۱۰ ثانیه‌ای پیکربندی نشده است؛ هزینه‌ای ثبت نشد.');return models.video10;}const model=reference&&kind==='image'?models.image_edit:models[kind];if(!model)throw Error('برای ویرایش تصویر، REPLICATE_EDIT_MODEL در Render تنظیم نشده است.');return model;}
function predictionInput(kind,prompt,reference,ratio,duration){
  const visualPrompt=kind==='video'||kind==='animation'
    ? `${prompt}\n\nVIDEO CONSTRAINTS: From the very first frame, show the actual requested scene and subject in full view. Continuous live-action visual scene, no intro, no title card, no white screen, no document or page, no written text, no letters, no typography, no subtitles, no captions, no credits, no logos, no watermark, no UI elements, no transitions from a text screen. Natural continuous motion from frame one.`
    : prompt;
  const input={prompt:visualPrompt};
  if(kind==='image'&&!reference){input.aspect_ratio=ratio||'1:1';input.num_outputs=1;input.output_format='png';}
  if(reference){
    if(!/^data:image\/(png|jpeg|webp);base64,/.test(reference)&&!validUrl(reference))throw Error('فرمت تصویر مرجع معتبر نیست.');
    if(kind==='image')input.input_image=reference;else input.first_frame_image=reference;
  }
  if(kind==='video'&&duration===10){if(reference)throw Error('مدل ۱۰ ثانیه‌ای انتخاب‌شده فقط متن به ویدئو است؛ تصویر مرجع را حذف کنید.');const extra=tenInput();for(const [k,v] of Object.entries(extra)){if(['prompt','first_frame_image'].includes(k))throw Error('ورودی مدل ۱۰ ثانیه‌ای نباید prompt یا first_frame_image را بازنویسی کند.');input[k]=v;}}
  return input;
}
// Gallery: backend-only Supabase Storage upload. Never send the secret key to the browser.
// Only URLs returned by Replicate are downloaded; never accept arbitrary user-supplied URLs here.
const savedOutputs=new Map();
const savingOutputs=new Map();
const MAX_MEDIA_BYTES=80*1024*1024;
// Only explicitly trusted media hosts are accepted. Unknown hosts are logged for diagnosis.
const MEDIA_HOST_SUFFIXES=['replicate.delivery','replicate.com','replicateusercontent.com','replicatecdn.com'];
// Exact Cloudflare R2 host observed in this project's Replicate prediction output.
const MEDIA_EXACT_HOSTS=new Set(['ai-gateway-outputs.0d37909e38d3e99c29fa2cd343ac421a.r2.cloudflarestorage.com']);
function mediaHost(url){try{const u=new URL(url);return u.protocol==='https:'?u.hostname.toLowerCase():null}catch{return null}}
function replicateMediaUrl(url){const host=mediaHost(url);return !!host&&(MEDIA_EXACT_HOSTS.has(host)||MEDIA_HOST_SUFFIXES.some(domain=>host===domain||host.endsWith('.'+domain)))}
function assertReplicateMediaUrl(url,stage){if(!replicateMediaUrl(url)){const host=mediaHost(url)||'(invalid URL)';console.error('GALLERY BLOCKED MEDIA HOST',stage,host);throw Error('دامنه فایل خروجی Replicate معتبر نیست: '+host)}}
function mediaSpec(kind,contentType,url){const image=kind==='image';const bucket=image?'aluniverse-images':'aluniverse-videos';const ct=String(contentType||'').split(';')[0].trim().toLowerCase();if(image){if(ct==='image/jpeg')return {bucket,mime:ct,ext:'jpg'};if(ct==='image/webp')return {bucket,mime:ct,ext:'webp'};if(ct==='image/png')return {bucket,mime:ct,ext:'png'};throw Error('فرمت تصویر خروجی برای گالری پشتیبانی نمی‌شود.')}if(ct==='video/mp4')return {bucket,mime:ct,ext:'mp4'};if(ct==='video/webm')return {bucket,mime:ct,ext:'webm'};throw Error('فرمت ویدئو خروجی برای گالری پشتیبانی نمی‌شود.')}
function signedLink(raw){
 const value=String(raw||'');
 const baseUrl=supaUrl();
 const path=/^https:\/\//i.test(value)?value:(value.startsWith('/storage/v1/')?value:'/storage/v1/'+value.replace(/^\/+/,''));
 const parsed=new URL(path,baseUrl);
 if(parsed.origin!==new URL(baseUrl).origin)throw Error('دامنه لینک Supabase نامعتبر است.');
 return parsed.toString();
}
async function freshGalleryLink(item){
 if(process.env.SUPABASE_BUCKETS_PUBLIC==='true')return item;
 const storagePath=`${item.bucket}/${item.path}`;
 const signed=await request(`${supaUrl()}/storage/v1/object/sign/${storagePath}`,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})},20000);
 if(!signed.signedURL)throw Error('تمدید لینک گالری ناموفق بود.');
 return {...item,access_url:signedLink(signed.signedURL)};
}
async function saveToGallery(predictionId,kind,originalUrl){
  if(!galleryConfigured())return null;
  if(savedOutputs.has(predictionId))return freshGalleryLink(savedOutputs.get(predictionId));
  if(savingOutputs.has(predictionId))return savingOutputs.get(predictionId);
  const task=(async()=>{
    assertReplicateMediaUrl(originalUrl,'original');
    const download=await fetch(originalUrl,{signal:AbortSignal.timeout(90000)});
    if(!download.ok)throw Error(`دریافت خروجی Replicate: HTTP ${download.status}`);
    const finalUrl=download.url;
    assertReplicateMediaUrl(finalUrl,'redirect');
    const reportedSize=Number(download.headers.get('content-length')||0);
    if(reportedSize>MAX_MEDIA_BYTES){await download.body?.cancel();throw Error('حجم خروجی از سقف ۸۰ مگابایت بیشتر است.');}
    const spec=mediaSpec(kind,download.headers.get('content-type'),finalUrl);
    const chunks=[];let bytes=0;
    for await(const chunk of download.body){bytes+=chunk.length;if(bytes>MAX_MEDIA_BYTES){await download.body.cancel().catch(()=>{});throw Error('حجم خروجی از سقف ۸۰ مگابایت بیشتر است.');}chunks.push(chunk)}
    const filename=`${predictionId}.${spec.ext}`;
    const storagePath=`${spec.bucket}/${filename}`;
    const uploadUrl=`${supaUrl()}/storage/v1/object/${storagePath}`;
    const uploaded=await fetch(uploadUrl,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':spec.mime,'x-upsert':'true'},body:Buffer.concat(chunks),signal:AbortSignal.timeout(90000)});
    if(!uploaded.ok){const details=(await uploaded.text()).slice(0,240);throw Error(`Supabase HTTP ${uploaded.status}: ${details}`)}
    // Public URLs work only when the bucket is public. Private buckets use signed URLs.
    const publicUrl=`${supaUrl()}/storage/v1/object/public/${storagePath}`;
    let accessUrl=publicUrl;
    if(process.env.SUPABASE_BUCKETS_PUBLIC!=='true'){
      const signed=await request(`${supaUrl()}/storage/v1/object/sign/${storagePath}`,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})},20000);
      if(!signed.signedURL)throw Error('فایل ذخیره شد ولی لینک مشاهده موقت ایجاد نشد.');
      accessUrl=signedLink(signed.signedURL);
    }
    const result={bucket:spec.bucket,path:filename,access_url:accessUrl};
    savedOutputs.set(predictionId,result);
    console.log('GALLERY SAVED',predictionId,spec.bucket,bytes);
    return result;
  })();
  savingOutputs.set(predictionId,task);
  try{return await task}finally{savingOutputs.delete(predictionId)}
}
function normalize(p,kind){const url=urlOf(p.output);return {success:p.status==='succeeded',type:kind,status:p.status,prediction_id:p.id,url:validUrl(url)?url:null,image:kind==='image'?url:undefined,video:kind!=='image'?url:undefined,error:p.error||null};}
// Manual uploads are password-protected and never expose Supabase service credentials.
const uploadLimit=15*1024*1024;
function uploadAuthorized(req){
 const expected=process.env.ALUNIVERSE_UPLOAD_PASSWORD||'';
 const given=req.get('x-aluniverse-upload-password')||'';
 if(expected.length<12||!given||Buffer.byteLength(given)!==Buffer.byteLength(expected))return false;
 return require('crypto').timingSafeEqual(Buffer.from(given),Buffer.from(expected));
}
app.post('/api/gallery/upload',express.raw({type:['video/mp4','video/webm'],limit:'15mb'}),async(req,res)=>{
 try{
  if(!uploadAuthorized(req))return res.status(401).json({success:false,error:'رمز بارگذاری تنظیم نشده یا نادرست است.'});
  if(!galleryConfigured())return res.status(503).json({success:false,error:'گالری تنظیم نشده است.'});
  const mime=String(req.get('content-type')||'').split(';')[0].toLowerCase();
  if(!['video/mp4','video/webm'].includes(mime)||!Buffer.isBuffer(req.body)||req.body.length<12||req.body.length>uploadLimit)return res.status(400).json({success:false,error:'فقط ویدئوی MP4 یا WebM تا ۱۵ مگابایت مجاز است.'});
  const b=req.body;
  const mp4=b.subarray(4,8).toString()==='ftyp';
  const webm=b.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]));
  if(!(mime==='video/mp4'&&mp4||mime==='video/webm'&&webm))return res.status(400).json({success:false,error:'محتوای فایل با فرمت ویدئو مطابقت ندارد.'});
  const id='manual-'+require('crypto').randomUUID();const path=id+(mp4?'.mp4':'.webm');
  const endpoint=`${supaUrl()}/storage/v1/object/aluniverse-videos/${path}`;
  const response=await fetch(endpoint,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':mime,'x-upsert':'false'},body:b,signal:AbortSignal.timeout(90000)});
  if(!response.ok){console.error('MANUAL UPLOAD ERROR',response.status,(await response.text()).slice(0,300));return res.status(502).json({success:false,error:`ذخیره در Supabase ناموفق بود (HTTP ${response.status}).`})}
  res.json({success:true,path,bucket:'aluniverse-videos'});
 }catch(e){console.error('MANUAL UPLOAD ERROR',e.message);res.status(502).json({success:false,error:'ارتباط بارگذاری ناموفق بود.'})}
});
// Password-gated gallery listing, with bounded pagination and signed read links.
app.get('/api/gallery/list',async(req,res)=>{
 try{
  if(!uploadAuthorized(req))return res.status(401).json({success:false,error:'رمز گالری نادرست است.'});
  if(!galleryConfigured())return res.status(503).json({success:false,error:'گالری تنظیم نشده است.'});
  const kind=req.query.kind==='image'?'image':'video';const bucket=kind==='image'?'aluniverse-images':'aluniverse-videos';
  const page=Math.min(100,Math.max(0,Number.parseInt(req.query.page,10)||0));const limit=30;
  const result=await request(`${supaUrl()}/storage/v1/object/list/${bucket}`,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':'application/json'},body:JSON.stringify({prefix:'',limit,offset:page*limit,sortBy:{column:'created_at',order:'desc'}})},20000);
  if(!Array.isArray(result))throw Error('پاسخ فهرست گالری نامعتبر است.');
  const pattern=kind==='image'?/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i:/^[a-zA-Z0-9_-]+\.(mp4|webm)$/i;
  const entries=[];
  for(const item of result.filter(x=>x.name&&pattern.test(x.name))){
   const storagePath=`${bucket}/${encodeURIComponent(item.name)}`;
   try{const signed=await request(`${supaUrl()}/storage/v1/object/sign/${storagePath}`,{method:'POST',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})},20000);
    if(signed.signedURL)entries.push({name:item.name,url:signedLink(signed.signedURL),created_at:item.created_at||null});
   }catch(e){console.error('GALLERY LIST SIGN ERROR',item.name,e.message)}
  }
  res.json({success:true,items:entries,has_more:result.length===limit,page});
 }catch(e){console.error('GALLERY LIST ERROR',e.message);res.status(502).json({success:false,error:'دریافت فهرست گالری ناموفق بود.'})}
});
// Deletion is explicit, password-protected and constrained to the two known buckets.
app.delete('/api/gallery/file',async(req,res)=>{
 try{
  if(!uploadAuthorized(req))return res.status(401).json({success:false,error:'رمز گالری نادرست است.'});
  if(!galleryConfigured())return res.status(503).json({success:false,error:'گالری تنظیم نشده است.'});
  const kind=req.body?.kind==='image'?'image':'video';const bucket=kind==='image'?'aluniverse-images':'aluniverse-videos';
  const name=String(req.body?.name||'');const pattern=kind==='image'?/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i:/^[a-zA-Z0-9_-]+\.(mp4|webm)$/i;
  if(!pattern.test(name))return res.status(400).json({success:false,error:'نام فایل نامعتبر است.'});
  await request(`${supaUrl()}/storage/v1/object/${bucket}/${encodeURIComponent(name)}`,{method:'DELETE',headers:{apikey:supaKey(),Authorization:`Bearer ${supaKey()}`}},20000);
  res.json({success:true});
 }catch(e){console.error('GALLERY DELETE ERROR',e.message);res.status(502).json({success:false,error:'حذف فایل انجام نشد.'})}
});
// Studio pilot: a single explicitly approved, password-gated 5-second prediction.
// No automatic batch execution; one request ID creates at most one prediction per process.
const studioStarts=new Map();
app.post('/api/studio/pilot',async(req,res)=>{
 try{
  if(!uploadAuthorized(req))return res.status(401).json({success:false,error:'رمز خصوصی نادرست است.'});
  if(req.body?.confirm_cost!==true)return res.status(400).json({success:false,error:'تأیید هزینه تولید لازم است.'});
  const prompt=String(req.body?.prompt||'').trim();
  if(prompt.length<80||prompt.length>8000)return res.status(400).json({success:false,error:'پرامپت سکانس باید بین ۸۰ تا ۸۰۰۰ کاراکتر باشد.'});
  const duration=Number(req.body?.duration||5);
  if(![5,10].includes(duration))return res.status(400).json({success:false,error:'مدت سکانس باید ۵ یا ۱۰ ثانیه باشد.'});
  if(duration===10&&!tenConfigured())return res.status(409).json({success:false,error:'مدل ۱۰ ثانیه‌ای در Render فعال نیست؛ هزینه‌ای ثبت نشد.'});
  const id=String(req.body?.request_id||'');
  if(!/^[a-zA-Z0-9_-]{16,90}$/.test(id))return res.status(400).json({success:false,error:'شناسه درخواست نامعتبر است.'});
  if(studioStarts.has(id))return res.json({success:true,...studioStarts.get(id)});
  // Reserve ID before the first await so parallel clicks cannot create two predictions.
  studioStarts.set(id,{status:'preparing',created:Date.now()});
  try{
   const english=await translatePrompt(prompt);
   const model=getModel('video',null,duration);
   const prediction=await request(`${base}/models/${model}/predictions`,{method:'POST',headers:replicateHeaders(),body:JSON.stringify({input:predictionInput('video',english,null,'16:9',duration)})},45000);
   if(!prediction.id)throw Error('شناسه Replicate دریافت نشد.');
   const item={status:prediction.status,prediction_id:prediction.id,duration,created:Date.now()};
   studioStarts.set(id,item);
   return res.json({success:true,...item});
  }catch(e){studioStarts.delete(id);throw e}
 }catch(e){console.error('STUDIO PILOT',e.message);res.status(502).json({success:false,error:e.message})}
});
app.get('/api/media/config',(_,res)=>res.json({success:true,video:{model:models.video,model10:models.video10,realisticEnabled:false,durations:tenConfigured()?[5,10]:[5],tenSecondsConfigured:tenConfigured(),resolution:['720p'],fps:[25],ratios:['16:9'],note:tenConfigured()?'مدل ۱۰ ثانیه‌ای پیکربندی شده؛ موفقیت تولید باید جداگانه آزمایش شود.':'مدل ۱۰ ثانیه‌ای غیرفعال است.'},image:{ratios:[...supportedRatios],editConfigured:!!models.image_edit},gallery:{configured:galleryConfigured()}}));
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
    const duration=kind==='video'?Number(req.body?.duration||5):5;
    if(kind==='video'&&![5,10].includes(duration))return res.status(400).json({success:false,error:'مدت ویدئو معتبر نیست.'});
    if(kind==='video'&&duration===10&&!tenConfigured())return res.status(409).json({success:false,error:'مدل ۱۰ ثانیه‌ای هنوز تنظیم نشده؛ هزینه‌ای ثبت نشد.'});
    const model=getModel(kind,reference,duration);
    jobs.set(key,{status:'preparing',kind,created:Date.now()});
    try{
      const english=await translatePrompt(prompt);
      const prediction=await request(`${base}/models/${model}/predictions`,{method:'POST',headers:replicateHeaders(),body:JSON.stringify({input:predictionInput(kind,english,reference,ratio,duration)})},45000);
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
    const kind=String(req.query.kind||'video');if(!['image','video','animation'].includes(kind))return res.status(400).json({success:false,error:'نوع خروجی نامعتبر است.'});
    const result=normalize(p,kind);
    if(p.status==='succeeded'&&result.url&&galleryConfigured()){
      try{
        const saved=await saveToGallery(id,kind,result.url);
        if(saved){result.gallery_saved=true;result.gallery_bucket=saved.bucket;result.gallery_path=saved.path;
          // Private buckets use a temporary signed URL; stored files remain persistent.
          result.url=saved.access_url;if(kind==='image')result.image=saved.access_url;else result.video=saved.access_url;
        }
      }catch(e){console.error('GALLERY ERROR',id,e.message);result.gallery_saved=false;result.gallery_error='ذخیره در گالری انجام نشد؛ خروجی اصلی همچنان قابل دریافت است.';}
    }
    res.json(result);
  }catch(e){console.error('MEDIA STATUS ERROR',e.message);res.status(502).json({success:false,error:e.message});}
});
for(const kind of ['image','video','animation'])app.post(`/api/${kind}`,(_,res)=>res.status(409).json({success:false,error:'لطفاً صفحه را تازه‌سازی کنید تا نسخه جدید بارگذاری شود.'}));
setInterval(()=>{for(const [k,v] of jobs)if(Date.now()-v.created>24*60*60*1000)jobs.delete(k);if(savedOutputs.size>2000)savedOutputs.clear();for(const [k,v] of studioStarts)if(Date.now()-v.created>24*60*60*1000)studioStarts.delete(k)},3600000).unref();
app.listen(process.env.PORT||10000,()=>console.log('Aluniverse 6.6.5 ready'));
