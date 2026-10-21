document.addEventListener('DOMContentLoaded',()=>{
const groups={ai:['چت هوشمند','ایده‌پردازی','تحقیق و تحلیل','ترجمه','تحلیل فایل و سند','مهندسی Prompt','دستیار تخصصی','اتوماسیون هوشمند','مرکز مدل‌های هوش مصنوعی','آکادمی آلیونیورسی'],image:['تولید تصویر','ویرایش تصویر','تغییر سبک','ارتقای کیفیت','حذف پس‌زمینه','افکت تصویری','طراحی لوگو','تراکت','بنر و پوستر','تصاویر تبلیغاتی و غیرتبلیغاتی','طراحی صحنه و استوری‌بورد تیزر','کاتالوگ و بروشور','جلد کتاب','کارت ویزیت','محتوای شبکه اجتماعی','اینفوگرافیک','تصویر سه‌بعدی'],video:['تولید ویدئو','تصویر به ویدئو','ویرایش ویدئو','ساخت انیمیشن','افکت سینمایی','تیزر تبلیغاتی','تیزر غیرتبلیغاتی','تیزر معرفی محصول','تیزر آموزشی و مستند','فیلم و سریال چندسکانسی','چسباندن کلیپ‌ها','تدوین ویدئو','موشن‌گرافیک','ریلز','Shorts','دوبله','زیرنویس','محتوای آموزشی از منابع','تدوین حرفه‌ای مشابه InShot'],content:['مقاله','کتاب و داستان','پادکست','سناریو','محتوای ویروسی','کمپین','SEO','شبکه‌های اجتماعی','محتوای ایمیلی','متن تبلیغاتی','تقویم محتوا','محتوای چندزبانه'],web:['ساخت وب‌سایت','Landing Page','فروشگاه اینترنتی','اپلیکیشن','UI/UX','تولید کد','ساخت API','Database','تست و Debug','Deploy و انتشار','اتوماسیون فنی','نگهداری و به‌روزرسانی'],execute:['تحلیل ایده','تبدیل ایده به پروژه','تحقیقات بازار','اعتبارسنجی ایده','برنامه‌ریزی','مدل کسب‌وکار','برندسازی','بازاریابی','کمپین','فروش و درآمد','آموزش','تحلیل عملکرد','رشد و توسعه','اتوماسیون کسب‌وکار','فریلنسری و کسب درآمد']};
const subIcons={"ai": ["💬", "💡", "🔎", "🌍", "📄", "🎯", "🤖", "⚙️", "🧠", "🎓"], "image": ["🖼️", "✏️", "🔄", "✨", "🧹", "🌟", "🏷️", "📄", "📢", "🖼️", "🎬", "📑", "📚", "💳", "📱", "📊", "🧊"], "video": ["🎥", "🖼️", "✂️", "🎞️", "✨", "📢", "🎭", "📦", "🎓", "🎬", "🔗", "🎛️", "🎨", "📱", "▶️", "🎙️", "💬", "📚", "✂️"], "content": ["📝", "📖", "🎙️", "🎬", "🔥", "📢", "🔍", "📱", "✉️", "📣", "📅", "🌍"], "web": ["🌐", "📄", "🛒", "📱", "🎨", "💻", "🔌", "🗄️", "🧪", "🚀", "⚙️", "🔧"], "execute": ["🔍", "💡", "🔎", "✅", "📋", "💼", "🏷️", "📣", "📢", "💰", "🎓", "📊", "📈", "⚙️", "💼"]};
groups.image.push('گالری تصاویر');groups.video.push('گالری ویدئوها');
const meta={ai:['🤖','هوش مصنوعی'],image:['🎨','تولید تصویر'],video:['🎬','ویدئو و انیمیشن'],content:['✍️','تولید محتوا'],web:['🌐','طراحی وب و نرم‌افزار'],execute:['🚀','از ایده تا اجرا']};
const el=id=>document.getElementById(id);let group='',sub='',busy=false,activeJob=null;
function show(id,value){el(id).style.display=value}
function openGroup(g){group=g;sub='';el('tool-icon').textContent=meta[g][0];el('tool-title').textContent=meta[g][1];el('tool-description').textContent='زیرمجموعه موردنظر را انتخاب کنید.';el('subtools').replaceChildren();groups[g].forEach((s,i)=>{const div=document.createElement('div');div.className='subtool';const icon=document.createElement('span');icon.className='subtool-icon';icon.textContent=subIcons[g][i]||'✦';const title=document.createElement('span');title.className='subtool-title';title.textContent=s;div.append(icon,title);div.addEventListener('click',()=>openSub(s));el('subtools').appendChild(div)});show('home-hero','none');show('features','none');show('about-section','none');show('tool-page','block');show('workspace','none');window.scrollTo(0,0)}
function openSub(s){if(s==='فیلم و سریال چندسکانسی'){openStudio();return;}if(s==='گالری تصاویر'||s==='گالری ویدئوها'){openGallery(s==='گالری تصاویر'?'image':'video');return;}el('user-input').style.display='';el('run-button').style.display='';sub=s;el('workspace-title').textContent=meta[group][0]+' '+s;el('user-input').value='';el('reference-file').value='';el('result').replaceChildren();show('result','none');show('workspace','block');setupWebTools();academyPanel();show('reference-box',group==='image'||group==='video'?'block':'none');show('video-settings',group==='video'&&!isUnsupported()?'block':'none');if(group==='video'&&!isUnsupported()){refreshVideoConfig();setupMotionProfile();}show('image-settings',group==='image'?'block':'none');if(group==='image'){setupImageStudio();setupImageRatioLabels();}el('workspace').scrollIntoView({behavior:'smooth'})}
// Studio 6.6.5: keep extracted PNGs in this browser without exposing gallery secrets.
function saveStudioFrameLocally(sceneNumber, predictionId, pngBlob){
 return new Promise((resolve,reject)=>{
  if(!window.indexedDB)return reject(Error('ذخیره محلی در این مرورگر پشتیبانی نمی‌شود'));
  const open=indexedDB.open('aluniverse_studio_frames_v1',1);
  open.onupgradeneeded=()=>{const db=open.result;if(!db.objectStoreNames.contains('frames'))db.createObjectStore('frames',{keyPath:'id'})};
  open.onerror=()=>reject(Error('دسترسی به حافظه مرورگر ممکن نشد'));
  open.onsuccess=()=>{const db=open.result;const tx=db.transaction('frames','readwrite');
   tx.objectStore('frames').put({id:predictionId,scene:sceneNumber,created:Date.now(),blob:pngBlob});
   tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(Error('ذخیره فریم در مرورگر ناموفق بود'))};
  };
 });
}
function setupImageStudio(){
 const root=el('image-settings');if(!root||root.querySelector('#al-image-advanced'))return;
 const box=document.createElement('div');box.id='al-image-advanced';box.style.cssText='margin:12px 0;padding:12px;border:1px solid #a89bc9;border-radius:12px';
 const opts=[['al-image-style','سبک تصویر',[['photo','واقعی'],['cinema','سینمایی'],['cartoon','کارتونی'],['3d','سه‌بعدی']]],['al-image-shot','کادربندی',[['auto','خودکار'],['face','پرتره'],['half','نیم‌تنه'],['full','تمام‌قد'],['wide','نمای باز']]],['al-image-quality','جزئیات',[['normal','استاندارد'],['detail','جزئیات بالا (پرامپت)']]]];
 for(const [id,label,items] of opts){const row=document.createElement('label');row.textContent=label+' ';row.style.cssText='display:block;margin:8px 0';const select=document.createElement('select');select.id=id;for(const [value,title] of items){const option=document.createElement('option');option.value=value;option.textContent=title;select.append(option)}row.append(select);box.append(row)}
 const note=document.createElement('small');note.textContent='نسبت تصویر از گزینه ابعاد موجود انتخاب می‌شود. سبک و کادر، راهنمای پرامپت هستند؛ کیفیت واقعی به مدل بستگی دارد.';box.append(note);root.append(box)
}
function setupImageRatioLabels(){
 const ratio=el('image-ratio');if(!ratio)return;
 for(const o of ratio.options){if(o.value==='9:16'&&!o.textContent.includes('تمام‌صفحه'))o.textContent+=' — عمودی / مناسب تمام‌صفحه گوشی';}
}
// Image gallery viewer: no new Replicate request, no alteration of original image.
function addImageViewer(img){
 if(!img||img.dataset.alImageViewer)return;img.dataset.alImageViewer='1';
 const host=img.parentNode;if(!host)return;
 const wrap=document.createElement('div');wrap.style.cssText='width:100%;margin:10px 0;padding:8px;border:1px solid #ddd;border-radius:12px;box-sizing:border-box;background:#f9f7ff';
 const stage=document.createElement('div');stage.style.cssText='position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#18151e;min-height:160px;max-height:70vh;touch-action:none;border-radius:9px';
 host.insertBefore(wrap,img);wrap.append(stage);stage.append(img);
 img.style.cssText+=';display:block;max-width:100%;max-height:70vh;object-fit:contain;transform-origin:center center;user-select:none;touch-action:none;';img.draggable=false;
 const bar=document.createElement('div');bar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px';wrap.append(bar);
 const btn=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='padding:8px 10px;border:1px solid #7b63b8;border-radius:8px;background:white;color:#24126a';b.onclick=fn;bar.append(b)};
 let zoom=1,x=0,y=0,lastTap=0;const pointers=new Map();let pinch=null;
 const dims=()=>{const r=stage.getBoundingClientRect(),nw=img.naturalWidth||r.width,nh=img.naturalHeight||r.height,k=Math.min(r.width/nw,r.height/nh);return {w:nw*k,h:nh*k,sw:r.width,sh:r.height}};
 const draw=()=>{const d=dims(),mx=Math.max(0,(d.w*zoom-d.sw)/2),my=Math.max(0,(d.h*zoom-d.sh)/2);x=Math.max(-mx,Math.min(mx,x));y=Math.max(-my,Math.min(my,y));img.style.transform=`translate3d(${x}px,${y}px,0) scale(${zoom})`};
 const reset=()=>{zoom=1;x=y=0;draw()};
 [1,2,3].forEach(n=>btn(n+'× بزرگ‌نمایی',()=>{zoom=n;x=y=0;draw()}));
 btn('⛶ تمام‌صفحه',async()=>{try{if(document.fullscreenElement===stage){await document.exitFullscreen();return}if(stage.requestFullscreen){await stage.requestFullscreen();return}throw Error('پشتیبانی نمی‌شود')}catch(e){alert('تمام‌صفحه فعال نشد: '+e.message)}});
 stage.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===stage){stage.style.maxHeight='none';stage.style.height='100vh';img.style.maxHeight='100vh'}else{stage.style.maxHeight='70vh';stage.style.height='';img.style.maxHeight='70vh'}draw()});
 stage.addEventListener('pointerdown',e=>{const now=Date.now();if(e.pointerType==='touch'&&now-lastTap<300&&pointers.size===0){reset();lastTap=0;e.preventDefault();return}lastTap=now;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{stage.setPointerCapture(e.pointerId)}catch{}if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y)||1,zoom}}e.preventDefault()});
 stage.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>=2&&pinch){const [a,b]=[...pointers.values()];zoom=Math.max(1,Math.min(3,pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance))}else if(pointers.size===1){x+=e.clientX-old.x;y+=e.clientY-old.y}draw();e.preventDefault()});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,e=>{pointers.delete(e.pointerId);pinch=null});
 img.addEventListener('load',draw);window.addEventListener('resize',draw);
 img.addEventListener('click',e=>e.preventDefault());

}
function imagePromptOptions(){const val=id=>document.getElementById(id)?.value||'';const style={photo:'photorealistic professional photography, natural lighting',cinema:'cinematic film still, realistic lighting',cartoon:'cartoon illustration', '3d':'3D render'}[val('al-image-style')]||'';const shot={auto:'',face:'face portrait',half:'waist-up portrait',full:'full body head-to-toe, no cropped feet or head',wide:'wide shot showing subject and surroundings'}[val('al-image-shot')]||'';return [style,shot,val('al-image-quality')==='detail'?'fine details, sharp textures':''].filter(Boolean).join('. ')}
function motionProfile(){const mode=document.getElementById('al-motion-profile')?.value||'auto';return ({auto:'',human:'Real-time natural human gait and biomechanics. No artificial slow motion.',horse:'Real-time horse gait. Accurate hoof contacts, weight transfer, head and neck movement, no sliding hooves or looped gait.',sport:'Real-time exercise biomechanics. Realistic dumbbell gravity and joint articulation, natural acceleration and deceleration.'})[mode]||''}
function setupMotionProfile(){const root=el('video-settings');if(!root||document.getElementById('al-motion-profile'))return;const row=document.createElement('label');row.textContent='نوع حرکت طبیعی: ';const sel=document.createElement('select');sel.id='al-motion-profile';[['auto','خودکار'],['human','انسان'],['horse','اسب و حیوانات'],['sport','ورزش و وزنه']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;sel.append(o)});row.append(sel);root.append(row)}
const naturalMotionInstruction='از حرکت آهسته ساختگی، مکث غیرطبیعی و چرخه تکراری گام جلوگیری شود. تماس پا با زمین، مرکز جرم و شتاب و کاهش سرعت واقعی باشد. حرکت در زمان واقعی با سرعت عادی 1x؛ بدون اسلوموشن، کش‌آمدن زمان، گام‌های تکراری یا حرکت مکانیکی. برای انسان: جابه‌جایی وزن، شتاب و کاهش سرعت طبیعی، حرکت مفاصل و تأثیر جاذبه واقع‌گرایانه. برای اسب و حیوانات: ترتیب واقعی گام‌ها و تماس سم با زمین، انتقال وزن بدن، حرکت طبیعی سر و گردن و یال و دم؛ بدون لغزش پا و تکرار چرخه مصنوعی. دوربین روان، بدون پرش و اعوجاج اندام. این دستور کیفیت را تضمین نمی‌کند.';
// Studio 6.6.5: explicit numbered scenes, 30-second projects, and manual cost approval.
function openStudio(){
 sub='فیلم و سریال چندسکانسی';show('workspace','block');show('reference-box','none');show('video-settings','none');show('image-settings','none');
 el('workspace-title').textContent='🎬 استودیوی فیلم و سریال — پیش‌تولید';el('user-input').style.display='none';el('run-button').style.display='none';
 const host=el('result');host.replaceChildren();show('result','block');
 const wrap=document.createElement('div');wrap.dir='rtl';wrap.style.cssText='display:grid;gap:12px;max-width:700px';
 const make=(tag,label)=>{const e=document.createElement(tag);if(label)e.textContent=label;wrap.append(e);return e};
 make('p','تهیه فیلمنامه از اعتبار Replicate استفاده نمی‌کند. تولید ویدئو جداگانه و فقط با تأیید هزینه انجام می‌شود.');
 const fresh=make('button','🆕 پروژه جدید / پاک‌کردن طرح قبلی');fresh.type='button';
 make('label','داستان یا ایده فیلم');const idea=make('textarea');idea.placeholder='داستان یا ایده فیلم را بنویسید';idea.rows=5;idea.style.width='100%';
 make('label','نوع فیلم');const mode=make('select');[['live','فیلم واقعی'],['animation','انیمیشن']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;mode.append(o)});
 make('label','مدت کل فیلم (دقیقه و ثانیه)');const timeRow=make('div');timeRow.style.cssText='display:flex;gap:8px;align-items:center';
 const minuteInput=document.createElement('input');minuteInput.type='number';minuteInput.min='0';minuteInput.max='30';minuteInput.value='0';minuteInput.style.cssText='width:80px;min-width:0';
 const secondInput=document.createElement('input');secondInput.type='number';secondInput.min='0';secondInput.max='59';secondInput.value='30';secondInput.style.cssText='width:80px;min-width:0';
 timeRow.append(minuteInput,document.createTextNode('دقیقه'),secondInput,document.createTextNode('ثانیه'));
 make('label','مدت هر سکانس');const duration=make('select');[5,10].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v+' ثانیه';duration.append(o)});duration.value='5';
 const configNote=make('p');configNote.style.fontSize='14px';
 let canTen=false;
 fetch('/api/media/config',{cache:'no-store'}).then(r=>r.json()).then(d=>{canTen=!!d.video?.tenSecondsConfigured;configNote.textContent=canTen?'مدل ۱۰ ثانیه‌ای در Render فعال است؛ عملکرد واقعی و هزینه آن هنوز باید آزمایش شود.':'مدل ۱۰ ثانیه‌ای در Render فعال نیست. تهیه نقشه ۱۰ ثانیه‌ای ممکن است، ولی تولید پولی آن غیرفعال است.';updateDuration()}).catch(()=>{configNote.textContent='وضعیت مدل ۱۰ ثانیه‌ای قابل بررسی نیست؛ تولید پولی ۱۰ ثانیه‌ای غیرفعال است.';updateDuration()});
 const countLabel=make('p');const button=make('button','تهیه فیلمنامه و نقشه سکانس‌ها');button.type='button';
 const result=make('pre');result.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;text-align:right;font-family:inherit';
 const save=make('button','دریافت طرح به صورت فایل متنی');save.hidden=true;
 make('hr');make('strong','انتخاب سکانس برای آزمایش تولید ویدئو (هزینه‌دار)');
 make('label','سکانس انتخابی');const sceneSelect=make('select');sceneSelect.disabled=true;
 const sceneNote=make('p');sceneNote.textContent='ابتدا فیلمنامه جدید را تولید کنید تا سکانس‌ها قابل انتخاب شوند.';
 make('label','پرامپت ارسالی (پیش از تأیید هزینه، بررسی و در صورت نیاز ویرایش کنید)');
 const shot=make('textarea');shot.rows=9;shot.style.width='100%';shot.placeholder='پس از تهیه فیلمنامه، متن سکانس انتخابی اینجا قرار می‌گیرد.';
 make('label','شناسنامه ثابت شخصیت‌ها و محیط (بدون شرح اتفاقات سکانس‌های بعدی)');const identity=make('textarea');identity.rows=4;identity.placeholder='مثلاً پسر هفت‌ساله با پیراهن آبی، شلوار مشکی، بادکنک قرمز، پارک سرسبز';
 make('label','نوع نمای دوربین برای سکانس انتخابی');
 const camera=make('select');[['full','نمای تمام‌قد (سر تا کف پا)'],['medium','نمای متوسط (کمر به بالا)'],['close','نمای نزدیک (چهره)'],['wide','نمای باز محیطی']].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;camera.append(o)});
 const cameraInstructions={full:'نمای تمام‌قد از سر تا کف پا؛ همه بدن شخصیت و بادکنک در کادر بمانند. دوربین با فاصله کافی، بدون برش سر، دست و پا.',medium:'نمای متوسط از کمر به بالا؛ ترکیب‌بندی ثابت و طبیعی.',close:'نمای نزدیک چهره با جزئیات طبیعی و بدون تغییر هویت.',wide:'نمای باز برای نمایش محیط و جایگاه شخصیت‌ها.'};
 const modelInfo=make('p','در حال بررسی موتور تولید ویدئو...');modelInfo.style.cssText='font-size:14px;color:#24126a';
 const modeLabel=make('label','حالت تولید ویدئو');const modeSelect=make('select');[['standard','استاندارد (فعال)'],['realistic','فوق‌واقع‌گرایانه (در انتظار تأیید موتور)']].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;if(value==='realistic')o.disabled=true;modeSelect.append(o)});
 const candidateLabel=make('label','نام مدل Replicate برای بررسی (owner/model)');const candidateInput=make('input');candidateInput.type='text';candidateInput.placeholder='مثلاً نام دقیق مدل از صفحه Replicate';candidateInput.autocomplete='off';
 make('p','آماده‌سازی تصاویر مرجع Kling (بدون تولید پولی). تصویر شروع الزامی است؛ تصویر پایان اختیاری. لینک مستقیم HTTPS تصاویر را از گالری کپی کنید.');
 make('label','نشانی تصویر شروع برای Kling');const startImage=make('input');startImage.type='url';startImage.placeholder='https://.../start.png';
 make('label','نشانی تصویر پایان (اختیاری)');const endImage=make('input');endImage.type='url';endImage.placeholder='https://.../end.png';

 make('p','برای بارگذاری یا انتخاب تصویر، رمز خصوصی گالری را در کادر پایین همین صفحه وارد کنید. لینک‌های انتخابی یک ساعت اعتبار دارند.');
 let startUploader=null,endUploader=null,endFileChosen=()=>false;
 const pickReference=(target,label)=>{
  make('label',label);const file=make('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';
  const upload=make('button','بارگذاری تصویر انتخاب‌شده');upload.type='button';
  const gallery=make('button','انتخاب از گالری آلیونیورسی');gallery.type='button';
  const select=make('select');select.hidden=true;const info=make('p','');
  const preview=make('img');preview.alt='پیش‌نمایش تصویر مرجع';preview.hidden=true;preview.style.cssText='display:none;width:100%;max-width:420px;max-height:360px;object-fit:contain;border:1px solid #e0d9f0;border-radius:12px;margin:12px auto;background:#faf9ff';
  const clear=make('button','حذف تصویر انتخاب‌شده');clear.type='button';clear.hidden=true;
  let localUrl='';const revoke=()=>{if(localUrl){URL.revokeObjectURL(localUrl);localUrl=''}};
  const show=url=>{preview.src=url;preview.hidden=false;preview.style.display='block';clear.hidden=false};
  clear.onclick=()=>{revoke();target.value='';file.value='';select.value='';preview.removeAttribute('src');preview.hidden=true;preview.style.display='none';clear.hidden=true;info.textContent='تصویر حذف شد.'};
  file.onchange=()=>{revoke();target.value='';if(file.files?.[0]){localUrl=URL.createObjectURL(file.files[0]);show(localUrl);info.textContent='پیش‌نمایش محلی؛ برای ثبت، بارگذاری را بزنید.'}};
  preview.onerror=()=>{info.textContent='❌ تصویر باز نشد یا لینک منقضی شده است.';preview.hidden=true;preview.style.display='none'};

  const doUpload=async()=>{const f=file.files?.[0];if(!f){info.textContent='ابتدا تصویر را انتخاب کنید.';return false}
   if(f.size>8*1024*1024){info.textContent='حداکثر حجم تصویر ۸ مگابایت است.';return false}
   if(!pass.value){info.textContent='رمز خصوصی گالری را پایین صفحه وارد کنید.';return false}
   upload.disabled=true;info.textContent='در حال بارگذاری...';
   try{const r=await fetch('/api/studio/reference-image',{method:'POST',headers:{'Content-Type':f.type,'x-aluniverse-upload-password':pass.value},body:f});const d=await r.json();if(!r.ok||!d.success)throw Error(d.error||'خطای بارگذاری');target.value=d.url;revoke();show(d.url);info.textContent='✅ تصویر بارگذاری شد؛ لینک یک ساعت اعتبار دارد.';return true}
   catch(e){info.textContent='❌ '+e.message;return false}finally{upload.disabled=false}
  };
  upload.onclick=doUpload;
  if(target===startImage)startUploader=doUpload;
  if(target===endImage){endUploader=doUpload;endFileChosen=()=>!!file.files?.[0]}
  gallery.onclick=async()=>{if(!pass.value){info.textContent='رمز خصوصی گالری را پایین صفحه وارد کنید.';return}
   gallery.disabled=true;info.textContent='در حال دریافت گالری...';
   try{const r=await fetch('/api/gallery/list?kind=image&page=0',{headers:{'x-aluniverse-upload-password':pass.value},cache:'no-store'});const d=await r.json();if(!r.ok||!d.success)throw Error(d.error||'خطای گالری');
    select.replaceChildren();const first=document.createElement('option');first.value='';first.textContent='تصویر را انتخاب کنید';select.append(first);
    for(const item of d.items||[]){const o=document.createElement('option');o.value=item.url;o.textContent=item.name;select.append(o)}
    select.hidden=false;info.textContent=(d.items||[]).length?'از فهرست تصویر را انتخاب کنید.':'تصویری در صفحه اول گالری پیدا نشد.'}
   catch(e){info.textContent='❌ '+e.message}finally{gallery.disabled=false}
  };
  select.onchange=()=>{if(select.value){target.value=select.value;revoke();show(select.value);info.textContent='✅ تصویر گالری انتخاب شد؛ لینک موقت است.'}};
 };
 pickReference(startImage,'تصویر شروع از گوشی یا گالری');pickReference(endImage,'تصویر پایان از گوشی یا گالری (اختیاری)');
 const checkImages=make('button','بررسی رایگان نشانی تصاویر');checkImages.type='button';const imageResult=make('p','لینک‌ها هنوز بررسی نشده‌اند.');
 checkImages.onclick=async()=>{
 const valid=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&!!u.hostname}catch{return false}};
 if(!startImage.value.trim()&&startUploader){imageResult.textContent='در حال ثبت خودکار تصویر شروع...';const ok=await startUploader();if(!ok){imageResult.textContent='❌ تصویر شروع هنوز بارگذاری نشده است؛ پیام زیر تصویر را بررسی کنید.';return}}
 if(!endImage.value.trim()&&endUploader&&endFileChosen()){imageResult.textContent='در حال ثبت خودکار تصویر پایان...';const ok=await endUploader();if(!ok){imageResult.textContent='❌ بارگذاری تصویر پایان انجام نشد؛ پیام زیر تصویر را بررسی کنید.';return}}
 const a=startImage.value.trim(),b=endImage.value.trim();
 if(!valid(a)||b&&!valid(b)){imageResult.textContent='❌ نشانی HTTPS معتبر تصویر لازم است.';return}
 imageResult.textContent='در حال بررسی بازشدن تصاویر...';checkImages.disabled=true;
 try{const check=url=>new Promise((resolve,reject)=>{const img=new Image();const t=setTimeout(()=>{img.src='';reject(Error('زمان بررسی تمام شد'))},12000);img.onload=()=>{clearTimeout(t);resolve(true)};img.onerror=()=>{clearTimeout(t);reject(Error('تصویر باز نشد؛ شاید لینک منقضی شده است'))};img.src=url});await check(a);if(b)await check(b);imageResult.textContent='✅ تصویرها در مرورگر باز می‌شوند؛ دسترسی Kling و هزینه هنوز تأیید نشده است.'}
 catch(e){imageResult.textContent='❌ '+e.message}finally{checkImages.disabled=false}
};
 const compareLabel=make('label','مقایسه رایگان مدل‌های نامزد (فقط بررسی مشخصات)');
 const compareSelect=make('select');
 [['','انتخاب نامزد'],['kwaivgi/kling-v2.1','Kling 2.1 (تصویر به ویدئو)'],['black-forest-labs/flux-kontext-pro','FLUX Kontext Pro (ویرایش تصویر)'],['black-forest-labs/flux-schnell','FLUX Schnell (موتور تصویر فعلی)']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;compareSelect.append(o)});
 compareSelect.onchange=()=>{if(compareSelect.value)candidateInput.value=compareSelect.value};
 const compareNote=make('p','این فهرست رتبه‌بندی کیفیت یا تأیید دسترسی نیست؛ فقط نامزدهای بررسی API هستند. مدل‌های Veo/Runway تا تأیید مسیر دسترسی به Replicate در فهرست نیستند.');compareNote.style.fontSize='12px';
 const engineGuide=make('p','راهنمای انتخاب موتور: FLUX Schnell برای تولید سریع تصویر؛ FLUX Kontext Pro برای ویرایش تصویر مرجع؛ Kling 2.1 برای تصویر به ویدئو. بررسی مشخصات رایگان است؛ هیچ‌یک با این فهرست به‌صورت خودکار به تولید پولی متصل نمی‌شوند.');engineGuide.style.cssText='font-size:13px;line-height:2;background:#f5f1ff;padding:10px;border-radius:10px';
 const checkModel=make('button','🔎 بررسی رایگان مشخصات موتور جایگزین');checkModel.type='button';
 const checkResult=make('p','این بررسی فقط مشخصات فنی را می‌خواند؛ ویدئو تولید نمی‌کند.');checkResult.style.cssText='font-size:13px;white-space:pre-wrap';
 checkModel.onclick=async()=>{checkModel.disabled=true;checkResult.textContent='در حال بررسی بدون هزینه تولید...';try{
 const r=await fetch('/api/media/model-check?model='+encodeURIComponent(candidateInput.value.trim()),{cache:'no-store'});const d=await r.json();if(!r.ok||!d.success)throw Error(d.error||'خطای بررسی');
 checkResult.textContent=d.configured?'مدل جایگزین: '+d.model+'\nورودی‌ها: '+(d.inputs||[]).join('، ')+'\nالزامی: '+(d.required||[]).join('، ')+'\nسازگاری با استودیوی فعلی: '+(d.compatibleWithCurrentTextOnlyStudio?'نیازمند بررسی بیشتر':'ناسازگار با ورودی فعلی متن‌به‌ویدئو')+'\nتصویر شروع الزامی: '+(d.needsStartImage?'بله':'خیر')+'\nتصویر پایان پشتیبانی می‌شود: '+(d.supportsEndImage?'بله':'خیر')+'\n'+d.warning:d.message+'\nبرای بررسی، نام دقیق مدل را در کادر بالا وارد کنید.';
 }catch(e){checkResult.textContent='بررسی انجام نشد: '+e.message}finally{checkModel.disabled=false}};
 const preflightButton=make('button','🛡️ بررسی نهایی رایگان اتصال Kling (بدون تولید)');preflightButton.type='button';
 const preflightResult=make('p','در این بررسی هیچ ویدئویی ساخته نمی‌شود و هزینه تولید ندارد.');preflightResult.style.cssText='font-size:13px;white-space:pre-wrap;line-height:2';
 preflightButton.onclick=async()=>{preflightButton.disabled=true;preflightResult.textContent='در حال بررسی مشخصات Kling...';try{
 const r=await fetch('/api/media/kling-preflight',{cache:'no-store'});const d=await r.json();if(!r.ok||!d.success)throw Error(d.error||'خطای ارتباط');
 preflightResult.textContent='مدل: '+d.model+'\nتصویر شروع: '+(d.hasStart?'پشتیبانی می‌شود':'پشتیبانی نمی‌شود')+'\nتصویر پایان: '+(d.hasEnd?'پشتیبانی می‌شود':'پشتیبانی نمی‌شود')+'\nپرامپت: '+(d.hasPrompt?'پشتیبانی می‌شود':'پشتیبانی نمی‌شود')+'\nسازگاری اولیه با تصویر مرجع: '+(d.compatibleWithReferenceStudio?'بله':'خیر')+'\nتعرفه: تأیید نشده\nدسترسی تولید حساب: تأیید نشده\nتولید پولی: غیرفعال\n'+d.message;
 }catch(e){preflightResult.textContent='❌ بررسی انجام نشد: '+e.message}finally{preflightButton.disabled=false}};
 let model5='minimax/video-01',model10='wan-video/wan-2.2-t2v-fast';
 fetch('/api/media/config',{cache:'no-store'}).then(r=>r.json()).then(d=>{model5=d.video?.model||model5;model10=d.video?.model10||model10;modelInfo.textContent='موتور انتخابی: '+(Number(duration.value)===10?model10:model5)+' | حالت استاندارد. حالت فوق‌واقع‌گرایانه تا بررسی ورودی و هزینه مدل جایگزین غیرفعال است.'}).catch(()=>{modelInfo.textContent='نام موتور در دسترس نیست؛ تولید پولی را فقط پس از بررسی تنظیمات انجام دهید.'});
 const paidTitle=make('p');const pass=make('input');pass.type='password';pass.placeholder='رمز خصوصی گالری/بارگذاری';pass.autocomplete='off';
 const confirm=make('label');const checkbox=document.createElement('input');checkbox.type='checkbox';confirm.append(checkbox,document.createTextNode(' هزینه تولید فقط یک سکانس را از اعتبار Replicate تأیید می‌کنم.'));
 const go=make('button','تولید آزمایشی فقط یک سکانس');go.type='button';const status=make('p');status.setAttribute('role','status');const videoArea=make('div');
 const readinessBtn=make('button','🧪 گزارش آمادگی Kling (بدون هزینه)');
 readinessBtn.type='button';
 const readinessInfo=make('p','تا تأیید تعرفه و دسترسی، تولید پولی Kling غیرفعال است.');
 readinessBtn.onclick=async()=>{
  readinessBtn.disabled=true;readinessInfo.textContent='در حال بررسی رایگان مشخصات...';
  try{
   const r=await fetch('/api/media/kling-readiness',{cache:'no-store'});
   const d=await r.json();
   if(!r.ok||!d.success)throw Error(d.error||'خطای بررسی');
   readinessInfo.textContent=d.schemaCompatible?
    '✅ ورودی‌های Kling سازگارند. تصویر شروع '+(d.startImageRequired?'الزامی':'اختیاری')+' است؛ تصویر پایان '+(d.endImageSupported?'پشتیبانی می‌شود':'پشتیبانی نمی‌شود')+'. ⚠️ تعرفه و دسترسی تولید تأیید نشده؛ تولید پولی Kling غیرفعال است.':
    '❌ ورودی‌های Kling برای تصویر به ویدئو سازگار نیستند.';
  }catch(e){readinessInfo.textContent='❌ '+e.message}
  finally{readinessBtn.disabled=false}
 };
 const dryBtn=make('button','🔎 بررسی ورودی Kling (رایگان) — نسخه 6.6.24');
 dryBtn.type='button';
 const dryInfo=make('p','فقط اعتبارسنجی ورودی‌ها؛ بدون تولید و هزینه.');
 dryBtn.onclick=async()=>{
  dryBtn.disabled=true;dryInfo.textContent='در حال بررسی ورودی‌ها...';
  try{
   const promptValue=shot.value.trim();
   const r=await fetch('/api/media/kling-dry-run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    start_image:startImage.value.trim(),end_image:endImage.value.trim(),
    prompt:promptValue||'A realistic five second cinematic video with natural movement.',duration:5
   })});
   const d=await r.json();
   if(!r.ok||!d.success)throw Error(d.error||'بررسی ناموفق');
   dryInfo.textContent=(d.readyForSubmission?'✅ ورودی‌های اصلی سازگارند.':'⚠️ ورودی الزامی تکمیل نشده: '+d.missingRequiredFields.join(', '))+
    ' | هیچ ویدئویی تولید نشد. هزینه و دسترسی حساب هنوز تأیید نشده است.';
  }catch(e){dryInfo.textContent='❌ '+e.message}
  finally{dryBtn.disabled=false}
 };
 // Keep the dry-run button next to the Kling readiness report.
 imageResult.insertAdjacentElement('afterend',dryBtn);
 dryBtn.insertAdjacentElement('afterend',dryInfo);
 dryBtn.style.cssText='display:block!important;width:100%;min-height:64px;margin:16px 0;background:#5733ce;color:#fff;border-radius:18px;font-size:18px;visibility:visible!important';
 dryInfo.setAttribute('role','status');
 // Consolidate legacy diagnostics into one collapsible area. Keep all tools and saved data.
 const advanced=document.createElement('details');advanced.style.cssText='border:1px solid #ddd;border-radius:12px;padding:12px;margin:12px 0';
 const advancedTitle=document.createElement('summary');advancedTitle.textContent='⚙️ بررسی‌های فنی پیشرفته (اختیاری)';advancedTitle.style.cssText='cursor:pointer;font-weight:bold';advanced.append(advancedTitle);
 [candidateLabel,candidateInput,compareLabel,compareSelect,compareNote,engineGuide,checkModel,checkResult,preflightButton,preflightResult,readinessBtn,readinessInfo].forEach(e=>advanced.append(e));
 // The single free input check stays visible next to reference-image validation.
 imageResult.insertAdjacentElement('afterend',advanced);
 const key='aluniverse_studio_draft_v1';let output='',scenes=[],pending=false,pilotId=null,expectedScenes=0,planValid=false;
 const faDigits=t=>String(t).replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
 const getSeconds=()=>{const m=Number(minuteInput.value),s=Number(secondInput.value);return Number.isInteger(m)&&Number.isInteger(s)&&m>=0&&m<=30&&s>=0&&s<=59?m*60+s:NaN};
 const updateDuration=()=>{const total=getSeconds(),size=Number(duration.value);const count=Math.ceil(total/size);countLabel.textContent=Number.isFinite(total)&&total>=5?`مدت کل: ${total} ثانیه | ${count} سکانس ${size} ثانیه‌ای${total%size?' (سکانس پایانی کوتاه‌تر)':''}`:'مدت کل باید دست‌کم ۵ ثانیه باشد.';paidTitle.textContent=`آزمایش تولید یک سکانس ${size} ثانیه‌ای (هزینه‌دار)`;modelInfo.textContent='موتور انتخابی: '+(size===10?model10:model5)+' | حالت استاندارد؛ هزینه بر اساس تعرفه Replicate محاسبه می‌شود.';go.disabled=pending||(size===10&&!canTen);if(size===10&&!canTen)sceneNote.textContent='طرح ۱۰ ثانیه‌ای قابل تهیه است، اما تولید آن تا فعال‌شدن مدل در Render غیرفعال است.';else if(scenes.length)sceneNote.textContent=`سکانس ${sceneSelect.selectedIndex+1} از ${scenes.length} — متن زیر قبل از پرداخت قابل ویرایش است.`;};
 [minuteInput,secondInput,duration].forEach(x=>x.addEventListener('change',()=>{checkbox.checked=false;updateDuration()}));updateDuration();
 const resetScenes=()=>{expectedScenes=0;planValid=false;scenes=[];sceneSelect.replaceChildren();sceneSelect.disabled=true;shot.value='';checkbox.checked=false;pilotId=null;videoArea.replaceChildren();status.textContent='';sceneNote.textContent='برای انتخاب سکانس، ابتدا فیلمنامه را تولید کنید.';updateDuration()};
 const parseScenes=text=>{
  // Parse one numbered block at a time; never let a block absorb another scene.
  const start=/<{2,3}\s*SCENE[_\s-]*(\d+)\s*[_\s-]*START\s*>{2,3}/gi;
  const markers=[...text.matchAll(start)];const found=[];
  for(let i=0;i<markers.length;i++){
   const m=markers[i],num=Number(m[1]),begin=m.index+m[0].length,end=i+1<markers.length?markers[i+1].index:text.length;
   let body=text.slice(begin,end);
   const close=new RegExp('<{2,3}\\s*SCENE[_\\s-]*'+num+'\\s*[_\\s-]*END\\s*>{2,3}','i');
   const match=close.exec(body);if(match)body=body.slice(0,match.index);
   body=body.replace(/<{2,3}\s*SCENE[_\s-]*\d+\s*[_\s-]*END\s*>{2,3}/gi,'').trim();
   if(body.length>=20&&!found.some(x=>x.number===num))found.push({number:num,text:body});
  }
  return found.sort((a,b)=>a.number-b.number);
 };
 const setScene=()=>{const selected=scenes[sceneSelect.selectedIndex];if(!selected)return;const total=getSeconds(),size=Number(duration.value);const from=(selected.number-1)*size,to=Math.min(total,selected.number*size);const type=mode.value==='animation'?'انیمیشن':'فیلم واقعی';
  shot.value=`فقط یک سکانس. رویدادهای سکانس‌های دیگر را نشان نده. سبک: ${type}، واقع‌گرایی و حرکت طبیعی.
هویت ثابت شخصیت‌ها و محیط (فقط ویژگی‌های ظاهری، نه رویدادهای داستان): ${identity.value.trim()}
سکانس ${selected.number} از ${Math.ceil(total/size)}، زمان ${from} تا ${to} ثانیه:
${selected.text}
کادربندی دوربین: ${cameraInstructions[camera.value]}
حرکت و فیزیک: ${naturalMotionInstruction}
پیوستگی: چهره، اندام، لباس، اشیا و مکان مطابق شناسنامه ثابت حفظ شوند. از نشان‌دادن رویدادهای سکانس بعدی خودداری کن. از اولین فریم فقط صحنه واقعی، بدون نوشته و تیتراژ.`;checkbox.checked=false;pilotId=null;sceneNote.textContent=`سکانس ${selected.number} از ${Math.ceil(total/size)} | ${from} تا ${to} ثانیه. متن قابل ویرایش است.`;updateDuration()};
 camera.addEventListener('change',()=>{if(planValid)setScene()});
 identity.addEventListener('input',()=>{if(scenes.length&&planValid)setScene()});
 shot.addEventListener('input',()=>{if(!pending){pilotId=null;checkbox.checked=false;}});
 sceneSelect.onchange=setScene;
 const prior=localStorage.getItem(key);if(prior){output=prior;result.textContent=prior;save.hidden=false;sceneNote.textContent='فیلمنامه قبلی نمایش داده شده است. برای انتخاب خودکار سکانس‌ها، یک فیلمنامه جدید بسازید.';}
 fresh.onclick=()=>{if(!window.confirm('داستان و فیلمنامه فعلی پاک شود؟ فایل‌های گالری حذف نمی‌شوند.'))return;localStorage.removeItem(key);idea.value='';identity.value='';output='';result.textContent='';save.hidden=true;minuteInput.value='0';secondInput.value='30';duration.value='5';resetScenes();};
 save.onclick=()=>{if(!output)return;const url=URL.createObjectURL(new Blob([output],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='aluniverse_studio_plan.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 button.onclick=async()=>{const topic=idea.value.trim(),total=getSeconds(),size=Number(duration.value),count=Math.ceil(total/size);if(!topic){result.textContent='ابتدا داستان را وارد کنید.';return;}if(!Number.isFinite(total)||total<5||total>1800){result.textContent='مدت باید بین ۵ ثانیه تا ۳۰ دقیقه باشد.';return;}if(count>100){result.textContent='برای این مدت، تعداد سکانس‌ها بیش از ۱۰۰ است؛ مدت را کوتاه‌تر یا سکانس‌ها را ۱۰ ثانیه‌ای کنید.';return;}
  resetScenes();button.disabled=true;result.textContent='در حال تهیه فیلمنامه با Groq (بدون هزینه Replicate)...';
  try{const planned=Math.min(count,10);expectedScenes=planned;const message=`شما فیلمنامه‌نویس و مدیر پیش‌تولید هستید. پاسخ فقط فارسی باشد. نوع اثر: ${mode.value==='animation'?'انیمیشن':'فیلم واقعی'}. مدت کل ${total} ثانیه، طول هر سکانس ${size} ثانیه، تعداد کل ${count}، اکنون ${planned} سکانس نخست را بنویس. داستان: ${topic}. ابتدا عنوان و شناسنامه ثابت شخصیت‌ها و محیط را بیاور. سپس دقیقاً ${planned} سکانس را با این قالب ماشینی، در خط جداگانه، بنویس: <<<SCENE_1_START>>> شرح صحنه اول شامل چهره، لباس، مکان، عمل شخصیت، دوربین و آغاز و پایان <<<SCENE_1_END>>>؛ برای بعدی شماره 2 و به همین ترتیب. هیچ قالب یا شماره‌ای را حذف نکن. هر سکانس حداقل ۳۰ کلمه داشته باشد. از داستان منحرف نشو، شخصیت یا لباس بی‌ربط اختراع نکن. اگر سکانس‌ها بیش از ۱۰ هستند، صریحاً بنویس ادامه هنوز تولید نشده است. ادعای ساخت ویدئو نکن.`;
   const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});const data=await response.json();if(!response.ok||!data.success)throw Error(data.error||'خطای تهیه فیلمنامه');output=String(data.answer||'');result.textContent=output;localStorage.setItem(key,output);save.hidden=!output;
   // The identity summary must never include the complete plot or future scenes.
   identity.value=topic.length>0?'':'';
   scenes=parseScenes(output);planValid=scenes.length===planned&&scenes.every((x,i)=>x.number===i+1);scenes.forEach(x=>{const opt=document.createElement('option');opt.value=x.number;const from=(x.number-1)*size,to=Math.min(total,x.number*size);opt.textContent=`سکانس ${x.number} از ${count} | ${from} تا ${to} ثانیه`;sceneSelect.append(opt)});sceneSelect.disabled=!planValid;
   if(planValid){setScene();}else{shot.value='';sceneNote.textContent=`⚠️ نقشه ناقص است: ${scenes.length} سکانس معتبر از ${planned} مورد انتظار. تولید پولی مسدود شد؛ فیلمنامه را دوباره تهیه کنید.`;}
  }catch(e){result.textContent='❌ '+e.message}finally{button.disabled=false}};
 go.onclick=async()=>{if(pending)return;const size=Number(duration.value);if(modeSelect.value!=='standard'){status.textContent='موتور فوق‌واقع‌گرایانه هنوز تأیید نشده است؛ هزینه‌ای ثبت نشد.';return}if(size===10&&!canTen){status.textContent='مدل ۱۰ ثانیه‌ای فعال نیست؛ هزینه‌ای ثبت نشد.';return}if(!planValid||sceneSelect.disabled){status.textContent='ابتدا فیلمنامه و سکانس معتبر تولید کنید.';return}if(shot.value.trim().length<80){status.textContent='پرامپت سکانس ناقص است؛ هزینه‌ای ثبت نشد.';return}if(!pass.value){status.textContent='رمز خصوصی را وارد کنید.';return}if(!checkbox.checked){status.textContent='ابتدا هزینه فقط یک سکانس را تأیید کنید.';return}
  const generatedSceneNumber=Number(sceneSelect.value)||1;
  if(!pilotId)pilotId='studio_'+Date.now()+'_'+Math.random().toString(36).slice(2,14);pending=true;go.disabled=true;status.textContent='در حال ثبت فقط یک درخواست در Replicate...';videoArea.replaceChildren();
  try{const response=await fetch('/api/studio/pilot',{method:'POST',headers:{'Content-Type':'application/json','x-aluniverse-upload-password':pass.value},body:JSON.stringify({prompt:shot.value.trim(),duration:size,request_id:pilotId,confirm_cost:true})});const data=await response.json();if(!response.ok||!data.success)throw Error(data.error||'شروع ناموفق بود');if(!data.prediction_id){status.textContent='درخواست در حال آماده‌سازی است؛ دوباره تولید را نزنید.';return}
   status.textContent=`در حال ساخت سکانس ${size} ثانیه‌ای...`;for(let i=0;i<45;i++){await new Promise(resolve=>setTimeout(resolve,5000));const r=await fetch('/api/media/status/'+encodeURIComponent(data.prediction_id)+'?kind=video');const d=await r.json();if(!r.ok)throw Error(d.error||'خطای دریافت وضعیت');if(d.status==='failed'||d.status==='canceled')throw Error(String(d.error||'تولید ناموفق بود'));if(d.status==='succeeded'){if(!d.url)throw Error('ویدئو تولید شد اما آدرس خروجی دریافت نشد.');const v=document.createElement('video');v.controls=true;v.playsInline=true;v.style.cssText='width:100%;max-width:650px';v.src=d.url;videoArea.append(v);addVideoTime(v);
     const frameButton=document.createElement('button');frameButton.type='button';frameButton.textContent='🖼 استخراج دوباره فریم پایانی';videoArea.append(frameButton);
     const frameNote=document.createElement('p');videoArea.append(frameNote);const framePreview=document.createElement('div');videoArea.append(framePreview);
     frameButton.onclick=async()=>{frameButton.disabled=true;frameNote.textContent='در حال دریافت فریم پایانی...';
      try{const r=await fetch(d.url);if(!r.ok)throw Error('دریافت ویدئو ناموفق بود');const blob=await r.blob();if(blob.size>85*1024*1024)throw Error('فایل بزرگ است');
       const objectUrl=URL.createObjectURL(blob);const temp=document.createElement('video');temp.muted=true;temp.preload='auto';temp.playsInline=true;temp.src=objectUrl;
       try{await new Promise((resolve,reject)=>{temp.onloadedmetadata=resolve;temp.onerror=()=>reject(Error('خواندن ویدئو ممکن نشد'));setTimeout(()=>reject(Error('مهلت بارگذاری پایان یافت')),20000)});
        temp.currentTime=Math.max(0,temp.duration-0.08);await new Promise((resolve,reject)=>{temp.onseeked=resolve;temp.onerror=()=>reject(Error('خواندن فریم ناموفق بود'));setTimeout(()=>reject(Error('مهلت استخراج فریم پایان یافت')),20000)});
        const canvas=document.createElement('canvas');canvas.width=temp.videoWidth;canvas.height=temp.videoHeight;if(!canvas.width||!canvas.height)throw Error('ابعاد ویدئو نامعتبر است');canvas.getContext('2d').drawImage(temp,0,0);
        const frame=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!frame)throw Error('ساخت تصویر ناموفق بود');const url=URL.createObjectURL(frame);framePreview.replaceChildren();
        const img=document.createElement('img');img.src=url;img.alt='تصویر فریم پایانی';img.style.cssText='max-width:100%;max-height:300px;display:block;margin:10px 0;border-radius:8px';
        const a=document.createElement('a');a.href=url;a.download=`aluniverse_scene_${generatedSceneNumber}_last_frame.png`;a.textContent='⬇️ ذخیره فریم پایانی در گوشی (PNG)';a.style.cssText='display:inline-block;padding:12px;border:1px solid #6b4bd1;border-radius:10px;margin:8px 0';
        framePreview.append(img,a);
        try{await saveStudioFrameLocally(generatedSceneNumber,data.prediction_id,frame);
          frameNote.textContent='✅ فریم پایانی به‌صورت خودکار استخراج و در حافظه همین مرورگر ذخیره شد. برای دریافت در پوشه دانلود گوشی، روی «ذخیره فریم پایانی در گوشی» بزنید. مدل ۱۰ ثانیه‌ای فعلی تصویر مرجع نمی‌پذیرد.';
        }catch(storageError){frameNote.textContent='فریم استخراج شد، اما ذخیره در حافظه مرورگر ناموفق بود: '+storageError.message+'؛ برای دریافت در گوشی روی لینک دانلود بزنید.';}

       }finally{URL.revokeObjectURL(objectUrl)}
      }catch(e){frameNote.textContent='❌ '+e.message+'؛ ویدئو همچنان در گالری محفوظ است.'}finally{frameButton.disabled=false}
     };
     // Automatic frame extraction starts once the completed video is available; manual retry stays available.
     frameNote.textContent='⏳ استخراج و ذخیره خودکار فریم پایانی...';
     frameButton.click();
     const link=document.createElement('a');link.href=d.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='دریافت فایل ویدئو';videoArea.append(link);status.textContent=d.gallery_saved?'سکانس ساخته و در گالری ذخیره شد.':'سکانس ساخته شد؛ وضعیت ذخیره در گالری را بررسی کنید.';return;}}
   status.textContent='پردازش طول کشیده است؛ شناسه: '+data.prediction_id;
  }catch(e){status.textContent='❌ '+e.message}finally{pending=false;go.disabled=(Number(duration.value)===10&&!canTen);checkbox.checked=false}
 };
 host.append(wrap);el('workspace').scrollIntoView({behavior:'smooth'});
}
const galleryKey='aluniverse_gallery_history_v1';
function galleryItems(){try{return JSON.parse(localStorage.getItem(galleryKey)||'[]')}catch{return []}}
function addVideoTime(video){
 // 6.6.5: local playback controls only; never requests a new Replicate generation.
 video.preload='metadata';
 const parent=video.parentNode;if(!parent)return;
 const viewer=document.createElement('div');viewer.dir='ltr';viewer.style.cssText='width:100%;max-width:100%;margin:10px 0;border:1px solid #ddd;border-radius:12px;padding:8px;box-sizing:border-box;background:#f9f7ff';viewer.classList.add('aluniverse-video-viewer');
 const stage=document.createElement('div');stage.style.cssText='position:relative;overflow:hidden;width:100%;background:#111;touch-action:none;border-radius:9px;min-height:160px;display:flex;align-items:center;justify-content:center';
 parent.insertBefore(viewer,video);viewer.append(stage);stage.append(video);
 video.style.cssText+=';display:block;max-width:100%;width:100%;max-height:65vh;object-fit:contain;transform-origin:center center;';
 video.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===video){video.style.maxHeight='100vh'}else{video.style.maxHeight='65vh'}});;
 const bar=document.createElement('div');bar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;margin-top:8px';viewer.append(bar);
 const makeButton=(label,handler)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.style.cssText='padding:7px 10px;min-height:36px;border-radius:8px;border:1px solid #7b63b8;background:#fff;color:#24126a;font-size:14px';btn.onclick=handler;bar.append(btn);return btn};
 let zoom=1,dx=0,dy=0;const draw=()=>{video.style.transform=`translate(${dx}px,${dy}px) scale(${zoom})`};
 [1,2,3].forEach(n=>makeButton(n+'× بزرگ‌نمایی',()=>{zoom=n;dx=0;dy=0;draw()}));
 makeButton('⛶ تمام‌صفحه',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();return;} // Fullscreen the VIDEO, not the entire tall viewer wrapper.
  if(video.requestFullscreen){await video.requestFullscreen();try{await screen.orientation.lock('landscape')}catch{}return;}
  if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();return;}
  throw Error('این مرورگر پشتیبانی نمی‌کند');}catch(e){alert('تمام‌صفحه در این مرورگر فعال نشد: '+e.message)}});
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){try{screen.orientation.unlock()}catch{}}});
 const speed=document.createElement('select');speed.setAttribute('aria-label','سرعت پخش');speed.style.cssText='padding:7px;border-radius:8px;min-height:36px';[[0.5,'سرعت ۰٫۵×'],[1,'سرعت ۱× (طبیعی)'],[1.5,'سرعت ۱٫۵×'],[2,'سرعت ۲×']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;speed.append(o)});speed.value='1';speed.onchange=()=>{video.playbackRate=Number(speed.value)};bar.append(speed);
 const timer=document.createElement('div');timer.dir='ltr';timer.setAttribute('aria-label','زمان پخش ویدئو');timer.style.cssText='font:600 15px sans-serif;text-align:center;direction:ltr;padding:7px 0;color:#24126a';viewer.append(timer);
 const format=seconds=>{if(!Number.isFinite(seconds)||seconds<0)return '--:--';const n=Math.floor(seconds);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
 const update=()=>{timer.textContent=format(video.currentTime)+' / '+format(video.duration)};
 ['loadedmetadata','durationchange','timeupdate','seeked','emptied'].forEach(event=>video.addEventListener(event,update));
 video.addEventListener('error',()=>{timer.textContent='زمان ویدئو در دسترس نیست'});update();
 let pointer=null;
 stage.addEventListener('pointerdown',e=>{if(zoom<=1||e.target!==video)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};try{stage.setPointerCapture(e.pointerId)}catch{}});
 stage.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;dx+=e.clientX-pointer.x;dy+=e.clientY-pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;draw()});
 ['pointerup','pointercancel'].forEach(name=>stage.addEventListener(name,()=>{pointer=null}));
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
    box.append(media);if(kind==='video')addVideoTime(media);else addImageViewer(media);
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
   const media=document.createElement(kind==='image'?'img':'video');media.src=data.url;media.style.cssText='max-width:100%;max-height:350px;border-radius:10px';if(kind==='video'){media.controls=true;media.playsInline=true}box.append(media);if(kind==='video')addVideoTime(media);else addImageViewer(media);
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
    const body={kind,prompt:kind==='video'||kind==='animation'?request+'\n'+naturalMotionInstruction+'\n'+motionProfile():kind==='image'?request+'\n'+imagePromptOptions():request,request_id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,''),aspect_ratio:el('image-ratio').value,...(kind==='video'?{duration:Number(el('video-duration').value)}:{})};
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
