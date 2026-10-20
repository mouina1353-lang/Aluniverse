document.addEventListener('DOMContentLoaded',()=>{
const groups={ai:['چت هوشمند','ایده‌پردازی','تحقیق و تحلیل','ترجمه','تحلیل فایل و سند','مهندسی Prompt','دستیار تخصصی','اتوماسیون هوشمند','مرکز مدل‌های هوش مصنوعی','آکادمی آلیونیورسی'],image:['تولید تصویر','ویرایش تصویر','تغییر سبک','ارتقای کیفیت','حذف پس‌زمینه','افکت تصویری','طراحی لوگو','تراکت','بنر و پوستر','تصاویر تبلیغاتی و غیرتبلیغاتی','طراحی صحنه و استوری‌بورد تیزر','کاتالوگ و بروشور','جلد کتاب','کارت ویزیت','محتوای شبکه اجتماعی','اینفوگرافیک','تصویر سه‌بعدی'],video:['تولید ویدئو','تصویر به ویدئو','ویرایش ویدئو','ساخت انیمیشن','افکت سینمایی','تیزر تبلیغاتی','تیزر غیرتبلیغاتی','تیزر معرفی محصول','تیزر آموزشی و مستند','فیلم و سریال چندسکانسی','چسباندن کلیپ‌ها','تدوین ویدئو','موشن‌گرافیک','ریلز','Shorts','دوبله','زیرنویس','محتوای آموزشی از منابع','تدوین حرفه‌ای مشابه InShot'],content:['مقاله','کتاب و داستان','پادکست','سناریو','محتوای ویروسی','کمپین','SEO','شبکه‌های اجتماعی','محتوای ایمیلی','متن تبلیغاتی','تقویم محتوا','محتوای چندزبانه'],web:['ساخت وب‌سایت','Landing Page','فروشگاه اینترنتی','اپلیکیشن','UI/UX','تولید کد','ساخت API','Database','تست و Debug','Deploy و انتشار','اتوماسیون فنی','نگهداری و به‌روزرسانی'],execute:['تحلیل ایده','تبدیل ایده به پروژه','تحقیقات بازار','اعتبارسنجی ایده','برنامه‌ریزی','مدل کسب‌وکار','برندسازی','بازاریابی','کمپین','فروش و درآمد','آموزش','تحلیل عملکرد','رشد و توسعه','اتوماسیون کسب‌وکار','فریلنسری و کسب درآمد']};
const subIcons={"ai": ["💬", "💡", "🔎", "🌍", "📄", "🎯", "🤖", "⚙️", "🧠", "🎓"], "image": ["🖼️", "✏️", "🔄", "✨", "🧹", "🌟", "🏷️", "📄", "📢", "🖼️", "🎬", "📑", "📚", "💳", "📱", "📊", "🧊"], "video": ["🎥", "🖼️", "✂️", "🎞️", "✨", "📢", "🎭", "📦", "🎓", "🎬", "🔗", "🎛️", "🎨", "📱", "▶️", "🎙️", "💬", "📚", "✂️"], "content": ["📝", "📖", "🎙️", "🎬", "🔥", "📢", "🔍", "📱", "✉️", "📣", "📅", "🌍"], "web": ["🌐", "📄", "🛒", "📱", "🎨", "💻", "🔌", "🗄️", "🧪", "🚀", "⚙️", "🔧"], "execute": ["🔍", "💡", "🔎", "✅", "📋", "💼", "🏷️", "📣", "📢", "💰", "🎓", "📊", "📈", "⚙️", "💼"]};
groups.image.push('گالری تصاویر');groups.video.push('گالری ویدئوها');
const meta={ai:['🤖','هوش مصنوعی'],image:['🎨','تولید تصویر'],video:['🎬','ویدئو و انیمیشن'],content:['✍️','تولید محتوا'],web:['🌐','طراحی وب و نرم‌افزار'],execute:['🚀','از ایده تا اجرا']};
const el=id=>document.getElementById(id);let group='',sub='',busy=false,activeJob=null;
function show(id,value){el(id).style.display=value}
function openGroup(g){group=g;sub='';el('tool-icon').textContent=meta[g][0];el('tool-title').textContent=meta[g][1];el('tool-description').textContent='زیرمجموعه موردنظر را انتخاب کنید.';el('subtools').replaceChildren();groups[g].forEach((s,i)=>{const div=document.createElement('div');div.className='subtool';const icon=document.createElement('span');icon.className='subtool-icon';icon.textContent=subIcons[g][i]||'✦';const title=document.createElement('span');title.className='subtool-title';title.textContent=s;div.append(icon,title);div.addEventListener('click',()=>openSub(s));el('subtools').appendChild(div)});show('home-hero','none');show('features','none');show('about-section','none');show('tool-page','block');show('workspace','none');window.scrollTo(0,0)}
function openSub(s){if(s==='گالری تصاویر'||s==='گالری ویدئوها'){openGallery(s==='گالری تصاویر'?'image':'video');return;}el('user-input').style.display='';el('run-button').style.display='';sub=s;el('workspace-title').textContent=meta[group][0]+' '+s;el('user-input').value='';el('reference-file').value='';el('result').replaceChildren();show('result','none');show('workspace','block');setupWebTools();academyPanel();show('reference-box',group==='image'||group==='video'?'block':'none');show('video-settings',group==='video'&&!isUnsupported()?'block':'none');if(group==='video'&&!isUnsupported())refreshVideoConfig();show('image-settings',group==='image'?'block':'none');el('workspace').scrollIntoView({behavior:'smooth'})}
const galleryKey='aluniverse_gallery_history_v1';
function galleryItems(){try{return JSON.parse(localStorage.getItem(galleryKey)||'[]')}catch{return []}}
function addVideoTime(video){
 video.preload='metadata';
 const timer=document.createElement('div');timer.dir='ltr';timer.setAttribute('aria-label','زمان پخش ویدئو');
 timer.style.cssText='font:600 15px sans-serif;text-align:center;direction:ltr;padding:7px 0;color:#24126a';
 const format=seconds=>{if(!Number.isFinite(seconds)||seconds<0)return '--:--';const n=Math.floor(seconds);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
 const update=()=>{timer.textContent=format(video.currentTime)+' / '+format(video.duration)};
 ['loadedmetadata','durationchange','timeupdate','seeked','emptied'].forEach(event=>video.addEventListener(event,update));
 video.addEventListener('error',()=>{timer.textContent='زمان ویدئو در دسترس نیست'});
 update();video.insertAdjacentElement('afterend',timer);
}
function rememberGallery(id,kind){if(!/^[a-zA-Z0-9_-]{10,100}$/.test(id))return;const entries=galleryItems().filter(x=>x.id!==id);entries.unshift({id,kind});localStorage.setItem(galleryKey,JSON.stringify(entries.slice(0,100)))}
if(!localStorage.getItem('aluniverse_rose_imported')){rememberGallery('20rgz3gwm1rzr0d1b0jvgfqv2g','image');localStorage.setItem('aluniverse_rose_imported','1')}
async function openGallery(kind){
 sub=kind==='image'?'گالری تصاویر':'گالری ویدئوها';el('workspace-title').textContent=sub;
 show('workspace','block');show('reference-box','none');show('video-settings','none');show('image-settings','none');
 el('user-input').style.display='none';el('run-button').style.display='none';el('result').replaceChildren();show('result','block');
 const controls=document.createElement('div');controls.style.cssText='margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:12px';
 const password=document.createElement('input');password.type='password';password.placeholder='رمز خصوصی گالری';password.autocomplete='off';password.style.cssText='width:100%;padding:12px;margin-bottom:8px';
 const refresh=document.createElement('button');refresh.type='button';refresh.textContent='نمایش فایل‌های Supabase';refresh.style.cssText='padding:12px;margin:8px';
 const feedback=document.createElement('p');const remote=document.createElement('div');
 const more=document.createElement('button');more.type='button';more.textContent='نمایش فایل‌های بیشتر';more.style.cssText='padding:12px;margin:8px';more.hidden=true;
 controls.append(password,refresh,feedback,remote,more);el('result').append(controls);
 let page=0,loading=false;
 const load=async(reset=true)=>{
  if(loading)return;
  if(!password.value){feedback.textContent='ابتدا رمز خصوصی را وارد کنید.';return}
  loading=true;refresh.disabled=true;more.disabled=true;feedback.textContent='در حال دریافت فهرست...';
  try{
   const target=reset?0:page;
   const r=await fetch('/api/gallery/list?kind='+kind+'&page='+target,{headers:{'x-aluniverse-upload-password':password.value},cache:'no-store'});
   const data=await r.json();if(!r.ok||!data.success)throw Error(data.error||'خطا');
   if(reset)remote.replaceChildren();
   for(const item of data.items){
    const box=document.createElement('div');box.style.cssText='margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:10px;overflow:hidden';
    const name=document.createElement('p');name.textContent=item.name;name.style.overflowWrap='anywhere';box.append(name);
    const media=document.createElement(kind==='image'?'img':'video');media.src=item.url;media.style.cssText='max-width:100%;max-height:320px;border-radius:8px';
    if(kind==='video'){media.controls=true;media.playsInline=true;media.preload='metadata';}else{media.loading='lazy';media.alt='تصویر گالری';}
    box.append(media);if(kind==='video')addVideoTime(media);
    const actions=document.createElement('div');actions.style.cssText='display:flex;gap:12px;flex-wrap:wrap;margin:10px 0';
    const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='مشاهده / دریافت فایل';
    const remove=document.createElement('button');remove.type='button';remove.textContent='حذف فایل';remove.style.cssText='padding:8px';
    remove.onclick=async()=>{
     if(!confirm('این فایل از Supabase به‌طور دائمی حذف شود؟\n'+item.name))return;
     remove.disabled=true;
     try{const r=await fetch('/api/gallery/file',{method:'DELETE',headers:{'Content-Type':'application/json','x-aluniverse-upload-password':password.value},body:JSON.stringify({kind,name:item.name})});const d=await r.json();if(!r.ok||!d.success)throw Error(d.error||'خطا');box.remove();feedback.textContent='فایل حذف شد.';}catch(e){feedback.textContent='❌ '+e.message;remove.disabled=false}
    };
    actions.append(link,remove);box.append(actions);remote.append(box);
   }
   page=target+1;more.hidden=!data.has_more;
   feedback.textContent=data.items.length?`نمایش ${remote.children.length} فایل`:'فایل دیگری پیدا نشد.';
  }catch(e){feedback.textContent='❌ '+e.message}
  finally{loading=false;refresh.disabled=false;more.disabled=false}
 };
 refresh.onclick=()=>load(true);more.onclick=()=>load(false);
 password.addEventListener('change',()=>load(true));
 password.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();load(true)}});
 if(kind==='video'){
  const file=document.createElement('input');file.type='file';file.accept='video/mp4,video/webm';file.style.cssText='width:100%;margin:8px 0';
  const send=document.createElement('button');send.type='button';send.textContent='بارگذاری ویدئو از گوشی';send.style.cssText='padding:12px;margin:8px 0';
  controls.insertBefore(file,refresh);controls.insertBefore(send,refresh);
  send.onclick=async()=>{const f=file.files[0];if(!f){feedback.textContent='ابتدا فایل ویدئو را انتخاب کنید.';return}if(!password.value){feedback.textContent='رمز خصوصی را وارد کنید.';return}
   if(f.size>15*1024*1024){feedback.textContent='حداکثر حجم مجاز ۱۵ مگابایت است.';return}
   send.disabled=true;feedback.textContent='در حال بارگذاری...';try{const r=await fetch('/api/gallery/upload',{method:'POST',headers:{'Content-Type':f.type||'video/mp4','x-aluniverse-upload-password':password.value},body:f});const data=await r.json();if(!r.ok||!data.success)throw Error(data.error||'خطا');feedback.textContent='بارگذاری موفق؛ در حال دریافت فهرست...';file.value='';await load(true)}catch(e){feedback.textContent='❌ '+e.message}finally{send.disabled=false}};
 }
 const entries=galleryItems().filter(x=>x.kind===kind);
 if(entries.length){const title=document.createElement('p');title.textContent='خروجی‌های ثبت‌شده در همین گوشی:';el('result').append(title)}
 for(const item of entries){
  const box=document.createElement('div');box.style.cssText='padding:12px;margin:12px 0;border:1px solid #ddd;border-radius:12px';
  const label=document.createElement('p');label.textContent='شناسه: '+item.id;box.append(label);el('result').append(box);
  try{const r=await fetch('/api/media/status/'+encodeURIComponent(item.id)+'?kind='+kind,{cache:'no-store'});const data=await r.json();
   if(!r.ok||data.status!=='succeeded'||!/^https:\/\//.test(data.url||''))throw Error(data.error||'خروجی فعلاً در دسترس نیست');
   const media=document.createElement(kind==='image'?'img':'video');media.src=data.url;media.style.cssText='max-width:100%;max-height:350px;border-radius:10px';if(kind==='video'){media.controls=true;media.playsInline=true}box.append(media);if(kind==='video')addVideoTime(media);
   const link=document.createElement('a');link.href=data.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='مشاهده / دریافت فایل';box.append(document.createElement('br'),link);
   if(data.gallery_saved===false){const warning=document.createElement('p');warning.textContent='⚠️ ذخیره دائمی تأیید نشده است.';box.append(warning)}
  }catch(e){const p=document.createElement('p');p.textContent='خطا: '+e.message;box.append(p)}
 }
 el('workspace').scrollIntoView({behavior:'smooth'});
}
const webSubs=['ساخت وب‌سایت','Landing Page','فروشگاه اینترنتی','تولید کد'];
const webStoreKey='aluniverse_web_project_v1';
let webSource='',webComplete=false;
function extractHtml(text){
  const fenced=text.match(/```(?:html)?\s*([\s\S]*?)(?:```|$)/i);
  const candidate=fenced?fenced[1]:text;
  const start=candidate.search(/<!doctype\s+html|<html[\s>]/i);
  if(start<0)return null;
  const fragment=candidate.slice(start);
  const close=fragment.toLowerCase().lastIndexOf('</html>');
  return {html:close>=0?fragment.slice(0,close+7):fragment,complete:close>=0};
}
function outputText(t){el('result').textContent=t;show('result','block')}
const academyTopics=['آموزش ChatGPT و پرامپت‌نویسی','آموزش Gemini و Google Flow','آموزش سایر مدل‌های هوش مصنوعی','آموزش فتوشاپ و روتوش','آموزش Illustrator و CorelDRAW','طراحی گرافیک، لوگو و پوستر','خوشنویسی نستعلیق و خط تحریری','خوشنویسی دیجیتال و تایپوگرافی','آموزش InShot، Premiere و After Effects','موشن‌گرافیک و انیمیشن','طراحی سایت و برنامه‌نویسی','آموزش فریلنسری و کسب درآمد'];
function academyPanel(){const old=el('academy-panel');if(old)old.remove();if(!(group==='ai'&&sub==='آکادمی آلیونیورسی'))return;const box=document.createElement('div');box.id='academy-panel';box.className='academy-topics';const caption=document.createElement('p');caption.textContent='یک رشته آموزشی انتخاب کنید، سپس سطح یا موضوع درس را بنویسید و «اجرای ابزار» را بزنید.';box.append(caption);academyTopics.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=()=>{el('user-input').value='درس اول '+t+' از مقدماتی با تمرین عملی و مثال فارسی';el('user-input').focus()};box.append(b)});el('user-input').before(box)}
let video10Enabled=false;
async function refreshVideoConfig(){const selector=el('video-duration');const note=el('video-duration-note');if(!selector)return;selector.value='5';video10Enabled=false;selector.querySelector('option[value="10"]').disabled=true;note.textContent='در حال بررسی مدل‌های فعال...';try{const r=await fetch('/api/media/config',{cache:'no-store'});if(!r.ok)throw Error('config');const d=await r.json();video10Enabled=!!d.video?.tenSecondsConfigured;selector.querySelector('option[value="10"]').disabled=!video10Enabled;note.textContent=video10Enabled?'مدل ۱۰ ثانیه‌ای تنظیم شده؛ نتیجه واقعی باید آزمایش شود.':'۱۰ ثانیه هنوز موتور تأییدشده ندارد؛ فقط ۵ ثانیه قابل اجراست.';}catch(e){note.textContent='بررسی تنظیمات ویدئو ناموفق بود؛ ۱۰ ثانیه غیرفعال است.'}}

function setupWebTools(){
  const old=el('web-output-panel');if(old)old.remove();
  webSource='';webComplete=false;
  if(group!=='web'||!webSubs.includes(sub))return;
  const panel=document.createElement('div');panel.id='web-output-panel';panel.className='web-output-panel';
  const bar=document.createElement('div');bar.className='web-output-actions';
  const preview=document.createElement('button');preview.type='button';preview.textContent='👁 پیش‌نمایش سایت';preview.disabled=true;
  const code=document.createElement('button');code.type='button';code.textContent='💻 نمایش کد';code.disabled=true;
  const download=document.createElement('button');download.type='button';download.textContent='⬇️ دانلود HTML';download.disabled=true;
  const note=document.createElement('p');note.className='note';note.textContent='بعد از تولید سایت، دکمه‌ها فعال می‌شوند.';
  const frame=document.createElement('iframe');frame.className='web-preview';frame.title='پیش‌نمایش وب‌سایت';frame.setAttribute('sandbox','allow-scripts');frame.referrerPolicy='no-referrer';frame.hidden=true;
  const raw=document.createElement('pre');raw.className='web-code';raw.hidden=true;
  const editor=document.createElement('textarea');editor.className='web-editor';editor.placeholder='کد HTML را اینجا ویرایش کنید...';editor.hidden=true;editor.dir='ltr';editor.spellcheck=false;
  const extra=document.createElement('div');extra.className='web-output-actions';
  const edit=document.createElement('button');edit.type='button';edit.textContent='✏️ ویرایش سایت';edit.disabled=true;
  const apply=document.createElement('button');apply.type='button';apply.textContent='✅ اعمال تغییرات';apply.disabled=true;
  const save=document.createElement('button');save.type='button';save.textContent='💾 ذخیره در گوشی';save.disabled=true;
  const restore=document.createElement('button');restore.type='button';restore.textContent='📂 بازیابی پروژه';
  const upload=document.createElement('input');upload.type='file';upload.accept='.html,text/html';upload.hidden=true;
  const importBtn=document.createElement('button');importBtn.type='button';importBtn.textContent='📄 بازکردن HTML';
  function loadHtml(codeText){const found=extractHtml(codeText);if(!found||!found.complete){note.textContent='⚠️ فایل HTML کامل نیست؛ تغییری اعمال نشد.';return false;}webSource=found.html;webComplete=true;raw.textContent=webSource;editor.value=webSource;preview.disabled=false;code.disabled=false;download.disabled=false;edit.disabled=false;save.disabled=false;apply.disabled=false;frame.srcdoc=webSource;frame.hidden=false;raw.hidden=true;editor.hidden=true;note.textContent='سایت آماده پیش‌نمایش، ویرایش و دانلود است.';return true;}
  edit.onclick=()=>{editor.value=webSource;editor.hidden=false;frame.hidden=true;raw.hidden=true;editor.focus()};
  apply.onclick=()=>{if(!loadHtml(editor.value))editor.hidden=false};
  save.onclick=()=>{try{localStorage.setItem(webStoreKey,JSON.stringify({html:webSource,savedAt:new Date().toISOString()}));note.textContent='پروژه در همین مرورگر ذخیره شد؛ برای پشتیبان مطمئن فایل HTML را هم دانلود کنید.';}catch(e){note.textContent='ذخیره محلی ممکن نشد؛ از دانلود HTML استفاده کنید.'}};
  restore.onclick=()=>{try{const v=JSON.parse(localStorage.getItem(webStoreKey)||'null');if(!v?.html){note.textContent='پروژه ذخیره‌شده‌ای در این مرورگر وجود ندارد.';return;}loadHtml(v.html)}catch(e){note.textContent='بازیابی پروژه ناموفق بود.'}};
  importBtn.onclick=()=>upload.click();
  upload.onchange=async()=>{const f=upload.files?.[0];if(!f)return;if(f.size>1024*1024){note.textContent='فایل HTML باید کمتر از یک مگابایت باشد.';return;}try{loadHtml(await f.text())}catch(e){note.textContent='خواندن فایل ممکن نشد.'}upload.value=''};
  extra.append(edit,apply,save,restore,importBtn);
  preview.onclick=()=>{frame.hidden=false;raw.hidden=true};
  code.onclick=()=>{raw.hidden=false;frame.hidden=true};
  download.onclick=()=>{if(!webComplete)return;const blob=new Blob([webSource],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='aluniverse-website.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)};
  bar.append(preview,code,download);panel.append(bar,extra,note,frame,raw,editor,upload);
  el('result').before(panel);
  panel._controls={preview,code,download,note,frame,raw,edit,apply,save,editor};
}
function outputWeb(t){
  outputText(t);
  const panel=el('web-output-panel');if(!panel)return;
  const c=panel._controls;const found=extractHtml(t);
  c.raw.textContent=t;c.code.disabled=false;
  if(!found){c.preview.disabled=true;c.download.disabled=true;c.note.textContent='پاسخ کد HTML ندارد؛ «نمایش کد» برای مشاهده پاسخ فعال است.';return;}
  webSource=found.html;webComplete=found.complete;
  // Only preview a full document; never silently treat a truncated script as finished.
  c.preview.disabled=!webComplete;c.download.disabled=!webComplete;c.edit.disabled=!webComplete;c.apply.disabled=!webComplete;c.save.disabled=!webComplete;
  if(webComplete){c.editor.value=webSource;c.frame.srcdoc=webSource;c.note.textContent='کد HTML کامل شناسایی شد. پیش‌نمایش یا دانلود را انتخاب کنید.';}
  else{c.frame.removeAttribute('srcdoc');c.frame.hidden=true;c.note.textContent='⚠️ خروجی HTML ناقص است (برچسب پایانی </html> وجود ندارد). نمایش کد فعال است؛ برای پیش‌نمایش و دانلود باید خروجی تکمیل شود.';}
}
function fileData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('خواندن تصویر ناموفق بود.'));reader.readAsDataURL(file)})}
function endpoint(){if(group==='image')return 'image';if(group==='video'){if(sub.includes('انیمیشن'))return 'animation';return 'video'}return 'ai'}

const wait=ms=>new Promise(r=>setTimeout(r,ms));
const mediaType=()=>group==='image'?'image':(sub.includes('انیمیشن')?'animation':'video');
function isUnsupported(){return group==='video'&&['چسباندن کلیپ‌ها','تدوین ویدئو','ویرایش ویدئو','فیلم و سریال چندسکانسی','محتوای آموزشی از منابع','دوبله','زیرنویس','تدوین حرفه‌ای مشابه InShot'].includes(sub);}
function displayMedia(data,kind){
  const url=data.url||data.image||data.video;if(!/^https:\/\//.test(url||''))throw Error('آدرس خروجی معتبر نیست.');
  el('result').replaceChildren();const media=document.createElement(kind==='image'?'img':'video');media.src=url;
  if(kind!=='image'){media.controls=true;media.playsInline=true;media.preload='metadata';}media.alt='خروجی Aluniverse';
  el('result').appendChild(media);if(kind!=='image')addVideoTime(media);const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='مشاهده / دریافت خروجی';el('result').appendChild(a);show('result','block');
}
function finish(){busy=false;el('run-button').disabled=false;el('run-button').textContent='اجرای ابزار';}
async function follow(id,kind){
  activeJob={id,kind};localStorage.setItem('aluniverse_media_job',JSON.stringify(activeJob));
  const started=Date.now();
  while(Date.now()-started<30*60*1000){
    await wait(5000);
    let response;
    try{response=await fetch(`/api/media/status/${encodeURIComponent(id)}?kind=${kind}`,{cache:'no-store'});}catch(e){outputText('اتصال موقتاً قطع شد؛ در حال تلاش مجدد...');continue;}
    const data=await response.json();if(!response.ok) {outputText('در حال بررسی وضعیت... '+(data.error||''));continue;}
    if(data.status==='succeeded'){rememberGallery(id,kind);displayMedia(data,kind);localStorage.removeItem('aluniverse_media_job');activeJob=null;return;}
    if(['failed','canceled'].includes(data.status)){localStorage.removeItem('aluniverse_media_job');activeJob=null;throw Error(data.error||'پردازش ناموفق یا لغو شد.');}
    outputText('⏳ وضعیت تولید: '+data.status+'\nشناسه: '+id+'\nمی‌توانید صفحه را باز نگه دارید.');
  }
  outputText('پردازش طولانی شده است. شناسه ذخیره شده و پس از بازگشت به این بخش قابل پیگیری است: '+id);
}
async function run(){
  if(busy)return;
  const request=el('user-input').value.trim();if(!request)return outputText('لطفاً درخواست خود را وارد کنید.');
  if(isUnsupported())return outputText('این ابزار هنوز موتور تدوین اختصاصی ندارد و درخواست پولی ثبت نشد.');
  const kind=group==='ai'||!['image','video'].includes(group)?'ai':mediaType();if(kind==='video'&&el('video-duration').value==='10'&&!video10Enabled)return outputText('مدل ۱۰ ثانیه‌ای فعال نیست؛ هیچ درخواست پولی ثبت نشد.');
  busy=true;el('run-button').disabled=true;el('run-button').textContent='در حال پردازش...';outputText('در حال آماده‌سازی درخواست...');
  try{
    if(kind==='ai'){
      const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:`ابزار: ${meta[group][1]}؛ زیرابزار: ${sub}؛ زبان: ${el('language').value}\n${group==='web'?'اگر درخواست ساخت صفحه وب است، یک فایل HTML کامل و مستقل با CSS و JavaScript داخلی تولید کن؛ پاسخ را با <!DOCTYPE html> شروع و با </html> تمام کن. کد را مختصر و کاربردی بنویس تا در محدودیت پاسخ جا شود؛ حداکثر ۳ محصول نمونه و CSS فشرده، بدون توضیحات بیرون از HTML. تمام تگ‌ها، به‌ویژه script و body و html، را ببند.':''}\n${sub==='آکادمی آلیونیورسی'?'نقش مدرس متخصص را داشته باش؛ درس گام‌به‌گام و کاربردی با هدف، پیش‌نیاز، مثال، تمرین و آزمون کوتاه ارائه بده. از ادعای اعطای مدرک رسمی خودداری کن.':''}\n${sub==='مرکز مدل‌های هوش مصنوعی'?'مدل‌ها و کاربردهایشان را معرفی و مقایسه کن؛ ادعای اتصال واقعی به مدل‌های دیگر نکن. اتصال اجرایی فعلی فقط از طریق سرویس‌های پیکربندی‌شده است.':''}\n${sub==='فریلنسری و کسب درآمد'?'به‌عنوان مشاور فریلنسری درباره مهارت، نمونه‌کار، قرارداد، قیمت‌گذاری، جذب مشتری و ریسک پرداخت راهنمای عملی بده؛ تضمین درآمد نده.':''}\n${sub==='تحلیل ایده'?'ایده را با معیارهای نیاز بازار، مشتری هدف، نقاط قوت و ضعف، امکان‌سنجی فنی، هزینه تقریبی، ریسک‌ها، رقبا، مدل درآمد و پیشنهاد اجرای MVP تحلیل کن. هزینه‌ها و اعداد را تخمینی و همراه با فرضیات بیان کن.':''}\n${sub==='اتوماسیون هوشمند'?'فقط بر اتوماسیون مبتنی بر مدل هوش مصنوعی، دستیارها، پردازش سند و گردش‌کار هوشمند تمرکز کن؛ در صورت درخواست، طرح اجرایی بده و ادعای اجرای واقعی نکن.':''}\n${sub==='اتوماسیون فنی'?'فقط بر اتوماسیون فنی نرم‌افزار، API، پایگاه داده، زمان‌بندی و تست تمرکز کن؛ در صورت درخواست کد نمونه بده و ادعای استقرار واقعی نکن.':''}\n${sub==='اتوماسیون کسب‌وکار'?'فقط بر گردش‌کار فروش، CRM، بازاریابی، پشتیبانی و گزارش‌های مدیریتی تمرکز کن؛ در صورت درخواست مراحل اجرا بده و ادعای اتصال واقعی به سامانه‌ها نکن.':''}\nدرخواست: ${request}`})});
      const data=await response.json();if(!response.ok||!data.success)throw Error(data.error||'خطای هوش مصنوعی');return group==='web'?outputWeb(data.answer||'پاسخی دریافت نشد.'):outputText(data.answer||'پاسخی دریافت نشد.');
    }
    const body={kind,prompt:request,request_id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,''),aspect_ratio:el('image-ratio').value,...(kind==='video'?{duration:Number(el('video-duration').value)}:{})};
    const file=el('reference-file').files[0];
    if(file){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('فقط JPG، PNG یا WebP مجاز است.');if(file.size>6*1024*1024)throw Error('تصویر مرجع باید کمتر از ۶ مگابایت باشد.');body.reference=await fileData(file);}
    const response=await fetch('/api/media/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const data=await response.json();if(!response.ok||!data.success)throw Error(data.error||'ثبت درخواست ناموفق بود.');
    if(!data.prediction_id)throw Error('شناسه پردازش دریافت نشد؛ درخواست جدید ثبت نکنید و لاگ Render را بررسی کنید.');
    outputText('درخواست ثبت شد؛ در انتظار نتیجه Replicate...');await follow(data.prediction_id,kind);
  }catch(e){outputText('❌ '+e.message)}finally{finish()}
}
const saved=localStorage.getItem('aluniverse_media_job');
if(saved){try{const j=JSON.parse(saved);if(j.id&&j.kind){const box=document.createElement('button');box.textContent='پیگیری آخرین درخواست ویدئو/تصویر';box.onclick=async()=>{if(busy)return;busy=true;el('run-button').disabled=true;show('tool-page','block');show('home-hero','none');show('features','none');show('about-section','none');show('workspace','block');try{await follow(j.id,j.kind)}catch(e){outputText('❌ '+e.message)}finally{finish()}};el('workspace').appendChild(box)}}catch(e){localStorage.removeItem('aluniverse_media_job')}}
document.querySelectorAll('.card[data-tool]').forEach(c=>c.addEventListener('click',()=>openGroup(c.dataset.tool)));el('run-button').addEventListener('click',run);el('back-home').addEventListener('click',()=>{show('tool-page','none');show('home-hero','block');show('features','grid');show('about-section','block');window.scrollTo(0,0)});document.querySelector('.start-button').addEventListener('click',e=>{e.preventDefault();el('features').scrollIntoView({behavior:'smooth'})});
});
