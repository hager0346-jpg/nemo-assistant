const micBtn=document.getElementById('micBtn');
const statusEl=document.getElementById('status');
const hint=document.getElementById('hint');
const headline=document.getElementById('headline');
const subline=document.getElementById('subline');
const messages=document.getElementById('messages');
const form=document.getElementById('chatForm');
const input=document.getElementById('messageInput');
const clearBtn=document.getElementById('clearBtn');

function addMessage(text,who='nemo'){
  const el=document.createElement('div');
  el.className='bubble '+(who==='user'?'user':'nemo');
  el.textContent=text;
  messages.appendChild(el); messages.scrollTop=messages.scrollHeight;
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='ar-EG'; u.rate=0.96; u.pitch=1.02;
  window.speechSynthesis.speak(u);
}
function respond(text){
  const t=text.trim().toLowerCase();
  let answer='أنا لسه في النسخة التجريبية، ومش متصل حاليًا بعقل ذكاء اصطناعي. لكن أقدر أجرب معاكي أوامر بسيطة.';
  if(t.includes('الساعة')||t.includes('الوقت')) answer='أقدر أساعدك في تنظيم وقتك، لكن مش شايف ساعة جهازك من النسخة دي.';
  else if(t.includes('سبوتيفاي')||t.includes('موسيقى')||t.includes('اغاني')||t.includes('أغاني')) answer='لتشغيل Spotify، افتحي التطبيق من جهازك. في المرحلة التالية هنضيف اختصار تشغيل مناسب.';
  else if(t.includes('واتساب')||t.includes('رسالة')) answer='إرسال رسائل واتساب يحتاج ربطًا واختيار جهة الاتصال ومراجعة الرسالة قبل الإرسال. لسه مش مفعّل في النموذج ده.';
  else if(t.includes('منبه')||t.includes('اصحى')||t.includes('أصحى')) answer='المنبه يحتاج صلاحية أو اختصار من نظام الجهاز. هنضيفه في مرحلة ربط أوامر الجهاز.';
  else if(t.includes('اسمك')||t.includes('نيمو')) answer='أنا نيمو، مساعدك الشخصي التجريبي. سعيد إني ببدأ معاكي!';
  addMessage(answer,'nemo'); speak(answer);
}
form.addEventListener('submit',e=>{e.preventDefault();const v=input.value.trim();if(!v)return;addMessage(v,'user');input.value='';respond(v)});
clearBtn.addEventListener('click',()=>{messages.innerHTML='';addMessage('المحادثة بدأت من جديد. أنا نيمو.','nemo')});

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let recognition=null, listening=false;
if(SpeechRecognition){
  recognition=new SpeechRecognition();
  recognition.lang='ar-EG'; recognition.interimResults=false; recognition.maxAlternatives=1;
  recognition.onstart=()=>{listening=true;micBtn.classList.add('listening');statusEl.textContent='بسمعك';headline.textContent='أنا معاكي';subline.textContent='اتكلمي دلوقتي'};
  recognition.onresult=e=>{const text=e.results[0][0].transcript;addMessage(text,'user');respond(text)};
  recognition.onerror=()=>{hint.textContent='حصلت مشكلة في الميكروفون. جربي الكتابة أو راجعي إذن الميكروفون.'};
  recognition.onend=()=>{listening=false;micBtn.classList.remove('listening');statusEl.textContent='جاهز';headline.textContent='أهلًا، أنا نيمو';subline.textContent='اضغطي على الميكروفون وابدئي كلامك'};
}else{
  hint.textContent='التعرف على الكلام غير مدعوم في هذا المتصفح حاليًا. تقدري تكتبي في مربع المحادثة.';
}
micBtn.addEventListener('click',()=>{
  if(!recognition){hint.textContent='المتصفح لا يدعم التعرف على الكلام هنا. استخدمي الكتابة حاليًا.';return}
  try{if(listening)recognition.stop();else recognition.start()}catch(e){hint.textContent='تعذر تشغيل الميكروفون. جربي مرة أخرى.'}
});
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
