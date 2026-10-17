document.addEventListener('DOMContentLoaded',()=>{
const groups={ai:['چت هوشمند','ایده‌پردازی','تحقیق و تحلیل','ترجمه','تحلیل فایل و سند','مهندسی Prompt','دستیار تخصصی','اتوماسیون'],image:['تولید تصویر','ویرایش تصویر','تغییر سبک','ارتقای کیفیت','حذف پس‌زمینه','افکت تصویری','طراحی لوگو','تراکت','بنر و پوستر','تصاویر تبلیغاتی و غیرتبلیغاتی','طراحی صحنه و استوری‌بورد تیزر','کاتالوگ و بروشور','جلد کتاب','کارت ویزیت','محتوای شبکه اجتماعی','اینفوگرافیک','تصویر سه‌بعدی'],video:['تولید ویدئو','تصویر به ویدئو','ویرایش ویدئو','ساخت انیمیشن','افکت سینمایی','تیزر تبلیغاتی','تیزر غیرتبلیغاتی','تیزر معرفی محصول','تیزر آموزشی و مستند','فیلم و سریال چندسکانسی','چسباندن کلیپ‌ها','تدوین ویدئو','موشن‌گرافیک','ریلز','Shorts','دوبله','زیرنویس','محتوای آموزشی از منابع'],content:['مقاله','کتاب و داستان','پادکست','سناریو','محتوای ویروسی','کمپین','SEO','شبکه‌های اجتماعی','محتوای ایمیلی','متن تبلیغاتی','تقویم محتوا','محتوای چندزبانه'],web:['ساخت وب‌سایت','Landing Page','فروشگاه اینترنتی','اپلیکیشن','UI/UX','تولید کد','ساخت API','Database','تست و Debug','Deploy و انتشار','اتوماسیون','نگهداری و به‌روزرسانی'],execute:['تبدیل ایده به پروژه','تحقیقات بازار','اعتبارسنجی ایده','برنامه‌ریزی','مدل کسب‌وکار','برندسازی','بازاریابی','کمپین','فروش و درآمد','آموزش','تحلیل عملکرد','رشد و توسعه','اتوماسیون کسب‌وکار']};
const subIcons={"ai": ["💬", "💡", "🔎", "🌍", "📄", "🎯", "🤖", "⚙️"], "image": ["🖼️", "✏️", "🔄", "✨", "🧹", "🌟", "🏷️", "📄", "📢", "🖼️", "🎬", "📑", "📚", "💳", "📱", "📊", "🧊"], "video": ["🎥", "🖼️", "✂️", "🎞️", "✨", "📢", "🎭", "📦", "🎓", "🎬", "🔗", "🎛️", "🎨", "📱", "▶️", "🎙️", "💬", "📚"], "content": ["📝", "📖", "🎙️", "🎬", "🔥", "📢", "🔍", "📱", "✉️", "📣", "📅", "🌍"], "web": ["🌐", "📄", "🛒", "📱", "🎨", "💻", "🔌", "🗄️", "🧪", "🚀", "⚙️", "🔧"], "execute": ["💡", "🔎", "✅", "📋", "💼", "🏷️", "📣", "📢", "💰", "🎓", "📊", "📈", "⚙️"]};
const meta={ai:['🤖','هوش مصنوعی'],image:['🎨','تولید تصویر'],video:['🎬','ویدئو و انیمیشن'],content:['✍️','تولید محتوا'],web:['🌐','طراحی وب و نرم‌افزار'],execute:['🚀','از ایده تا اجرا']};
const el=id=>document.getElementById(id);let group='',sub='',busy=false,activeJob=null;
function show(id,value){el(id).style.display=value}
function openGroup(g){group=g;sub='';el('tool-icon').textContent=meta[g][0];el('tool-title').textContent=meta[g][1];el('tool-description').textContent='زیرمجموعه موردنظر را انتخاب کنید.';el('subtools').replaceChildren();groups[g].forEach((s,i)=>{const div=document.createElement('div');div.className='subtool';const icon=document.createElement('span');icon.className='subtool-icon';icon.textContent=subIcons[g][i]||'✦';const title=document.createElement('span');title.className='subtool-title';title.textContent=s;div.append(icon,title);div.addEventListener('click',()=>openSub(s));el('subtools').appendChild(div)});show('home-hero','none');show('features','none');show('about-section','none');show('tool-page','block');show('workspace','none');window.scrollTo(0,0)}
function openSub(s){sub=s;el('workspace-title').textContent=meta[group][0]+' '+s;el('user-input').value='';el('reference-file').value='';el('result').replaceChildren();show('result','none');show('workspace','block');show('reference-box',group==='image'||group==='video'?'block':'none');show('video-settings',group==='video'?'block':'none');show('image-settings',group==='image'?'block':'none');el('workspace').scrollIntoView({behavior:'smooth'})}
function outputText(t){el('result').textContent=t;show('result','block')}
function fileData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('خواندن تصویر ناموفق بود.'));reader.readAsDataURL(file)})}
function endpoint(){if(group==='image')return 'image';if(group==='video'){if(sub.includes('انیمیشن'))return 'animation';return 'video'}return 'ai'}

const wait=ms=>new Promise(r=>setTimeout(r,ms));
const mediaType=()=>group==='image'?'image':(sub.includes('انیمیشن')?'animation':'video');
function isUnsupported(){return group==='video'&&['چسباندن کلیپ‌ها','تدوین ویدئو','ویرایش ویدئو','فیلم و سریال چندسکانسی','محتوای آموزشی از منابع','دوبله','زیرنویس'].includes(sub);}
function displayMedia(data,kind){
  const url=data.url||data.image||data.video;if(!/^https:\/\//.test(url||''))throw Error('آدرس خروجی معتبر نیست.');
  el('result').replaceChildren();const media=document.createElement(kind==='image'?'img':'video');media.src=url;
  if(kind!=='image'){media.controls=true;media.playsInline=true;media.preload='metadata';}media.alt='خروجی Aluniverse';
  el('result').appendChild(media);const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='مشاهده / دریافت خروجی';el('result').appendChild(a);show('result','block');
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
    if(data.status==='succeeded'){displayMedia(data,kind);localStorage.removeItem('aluniverse_media_job');activeJob=null;return;}
    if(['failed','canceled'].includes(data.status)){localStorage.removeItem('aluniverse_media_job');activeJob=null;throw Error(data.error||'پردازش ناموفق یا لغو شد.');}
    outputText('⏳ وضعیت تولید: '+data.status+'\nشناسه: '+id+'\nمی‌توانید صفحه را باز نگه دارید.');
  }
  outputText('پردازش طولانی شده است. شناسه ذخیره شده و پس از بازگشت به این بخش قابل پیگیری است: '+id);
}
async function run(){
  if(busy)return;
  const request=el('user-input').value.trim();if(!request)return outputText('لطفاً درخواست خود را وارد کنید.');
  if(isUnsupported())return outputText('این ابزار هنوز موتور تدوین اختصاصی ندارد و درخواست پولی ثبت نشد.');
  const kind=group==='ai'||!['image','video'].includes(group)?'ai':mediaType();
  busy=true;el('run-button').disabled=true;el('run-button').textContent='در حال پردازش...';outputText('در حال آماده‌سازی درخواست...');
  try{
    if(kind==='ai'){
      const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:`ابزار: ${meta[group][1]}؛ زیرابزار: ${sub}؛ زبان: ${el('language').value}\nدرخواست: ${request}`})});
      const data=await response.json();if(!response.ok||!data.success)throw Error(data.error||'خطای هوش مصنوعی');return outputText(data.answer||'پاسخی دریافت نشد.');
    }
    const body={kind,prompt:request,request_id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,''),aspect_ratio:el('image-ratio').value};
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
