const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.header nav');
function setMenu(open,returnFocus=false){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Menü bezárása':'Menü megnyitása');navigation.classList.toggle('is-open',open);if(returnFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
navigation.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){event.preventDefault();setMenu(false,true);}});
document.addEventListener('click',event=>{if(!navigation.contains(event.target)&&!menuButton.contains(event.target))setMenu(false);});
const mobileLayout=window.matchMedia('(max-width: 900px)');
mobileLayout.addEventListener('change',event=>{if(!event.matches)setMenu(false);});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let lockedScroll=0;
function openDialog(dialog){lockedScroll=window.scrollY;document.body.style.setProperty('--scroll-lock-top',-lockedScroll+'px');dialog.showModal();document.body.classList.add('dialog-open');}
function animateElement(element,keyframes,duration=220){if(!reducedMotion.matches&&typeof element.animate==='function'){element.getAnimations().forEach(animation=>animation.cancel());element.animate(keyframes,{duration,easing:'cubic-bezier(.2,.7,.2,1)'});}}
const photos=[
{src:'assets/haz.webp',caption:'A VadKörTe – zöld ablakok, fehér falak, egy kis vidéki nyugalom.'},
{src:'assets/kert.webp',caption:'Kerti asztal a tornác előtt – lassú reggelekhez, hosszú beszélgetésekhez.'},
{src:'assets/tornac.webp',caption:'A fedett kiülő – egy külön kis világ a kertben.'},
{src:'assets/udvar.webp',caption:'A növényekkel teli kert és a külön faház.'},
{src:'assets/nappali.webp',caption:'A nappali – kényelmes kanapé, fa bútorok, otthonos részletek.'},
{src:'assets/konyha.webp',caption:'A konyha – egy közös reggeli vagy vacsora minden apró öröméhez.'},
{src:'assets/etkezo.webp',caption:'Az étkező – itt a reggeli kávé mellé idő is jut.'},
{src:'assets/furdo.webp',caption:'A fürdőszoba – természetes fa és kedves vidéki részletek.'},
{src:'assets/haloszoba.webp',caption:'A hálószoba – egy könyv, egy olvasólámpa, és egy nyugodt este.'},
{src:'assets/fahaz.webp',caption:'A 13 m²-es kerti faház belseje – saját kis kuckó, szaunával.'}
];
const galleryDialog=document.getElementById('gallery-dialog');
let activePhoto=0;
function showPhoto(index){const direction=index>activePhoto?1:-1;activePhoto=(index+photos.length)%photos.length;const photo=photos[activePhoto];const image=document.getElementById('lightbox-photo');image.src=photo.src;image.alt=photo.caption;document.getElementById('photo-caption').textContent=photo.caption;document.getElementById('photo-count').textContent=(activePhoto+1)+' / '+photos.length;if(galleryDialog.open)animateElement(image,[{opacity:.3,transform:'translateX('+direction*14+'px)'},{opacity:1,transform:'translateX(0)'}],180);}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));openDialog(galleryDialog);}));
document.querySelector('.gallery-prev').addEventListener('click',()=>showPhoto(activePhoto-1));
document.querySelector('.gallery-next').addEventListener('click',()=>showPhoto(activePhoto+1));
galleryDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(activePhoto-1);}if(event.key==='ArrowRight'){event.preventDefault();showPhoto(activePhoto+1);}});
const galleryImage=document.getElementById('lightbox-photo');
let swipeStart=null;
galleryImage.addEventListener('touchstart',event=>{swipeStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
galleryImage.addEventListener('touchend',event=>{if(!swipeStart||event.touches.length){swipeStart=null;return;}const touch=event.changedTouches[0];if(!touch){swipeStart=null;return;}const dx=touch.clientX-swipeStart.x;const dy=touch.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>=44&&Math.abs(dx)>Math.abs(dy)*1.4)showPhoto(activePhoto+(dx<0?1:-1));},{passive:true});
galleryImage.addEventListener('touchcancel',()=>{swipeStart=null;},{passive:true});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');document.body.style.removeProperty('--scroll-lock-top');window.scrollTo({top:lockedScroll,behavior:'instant'});});dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});});
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectTab(tab){const changed=tab.getAttribute('aria-selected')!=='true';tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;const panel=document.getElementById(item.getAttribute('aria-controls'));panel.hidden=!selected;if(selected&&changed)animateElement(panel,[{opacity:.15,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],240);});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];if(event.key==='ArrowLeft')target=tabs[(index+tabs.length-1)%tabs.length];if(event.key==='Home')target=tabs[0];if(event.key==='End')target=tabs[tabs.length-1];if(target){event.preventDefault();selectTab(target);target.focus();}});});
const planForm=document.getElementById('plan-form');
const arrival=planForm.elements.arrival;
const departure=planForm.elements.departure;
function localISO(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
function nextDay(value){const date=new Date(value+'T12:00:00');date.setDate(date.getDate()+1);return localISO(date);}
arrival.min=localISO(new Date());
departure.min=nextDay(arrival.min);
arrival.addEventListener('change',()=>{if(arrival.value){departure.min=nextDay(arrival.value);if(departure.value&&departure.value<=arrival.value)departure.value=departure.min;}document.getElementById('form-error').hidden=true;});
let planText='';
const dateFormatter=new Intl.DateTimeFormat('hu-HU',{year:'numeric',month:'long',day:'numeric'});
planForm.addEventListener('submit',event=>{event.preventDefault();const error=document.getElementById('form-error');if(!arrival.value||!departure.value||departure.value<=arrival.value||arrival.value<arrival.min){error.textContent='Válassz egy mai vagy későbbi érkezést és egy azt követő távozási napot.';error.hidden=false;return;}error.hidden=true;const start=dateFormatter.format(new Date(arrival.value+'T12:00:00'));const end=dateFormatter.format(new Date(departure.value+'T12:00:00'));const nights=Math.round((Date.parse(departure.value+'T12:00:00Z')-Date.parse(arrival.value+'T12:00:00Z'))/86400000);const mood=planForm.elements.mood.value;const result=document.getElementById('plan-result');result.replaceChildren();[['Helyszín','VadKörTe Vendégház, Bernecebaráti'],['Érkezés',start],['Távozás',end],['Pihenés',nights+' éjszaka · '+mood]].forEach(([label,value])=>{const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+': ';p.append(strong,document.createTextNode(value));result.append(p);});planText='ŐSZI PIHENÉSTERV\nVadKörTe Vendégház · Bernecebaráti\n\nÉrkezés: '+start+'\nTávozás: '+end+'\nIdőtartam: '+nights+' éjszaka\nHangulat: '+mood+'\n\nEz egy személyes útiterv, nem visszaigazolt foglalás. A szabad időpontokat, vendéglétszámot és árakat a szállásadóval kell egyeztetni.';document.getElementById('copy-status').textContent='';openDialog(document.getElementById('plan-dialog'));});
document.getElementById('copy-plan').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(planText);document.getElementById('copy-status').textContent='A terved a vágólapra került.';}catch{document.getElementById('copy-status').textContent='A böngésző nem engedte a másolást. A letöltéssel elmentheted a tervet.';}});
document.getElementById('download-plan').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+planText],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='vadkorte-pihenesterv.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('copy-status').textContent='A terved letöltése elindult.';});
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelector('[data-map]').addEventListener('click',()=>{openDialog(document.getElementById('map-dialog'));});

const mobilePlanning=document.querySelector('.mobile-planning');
if('ResizeObserver' in window){new ResizeObserver(()=>{if(mobileLayout.matches)document.documentElement.style.setProperty('--mobile-planning-space',Math.ceil(mobilePlanning.getBoundingClientRect().height+8)+'px');}).observe(mobilePlanning);}
if('IntersectionObserver' in window){
  const planningObserver=new IntersectionObserver(entries=>{mobilePlanning.classList.toggle('is-hidden',entries[0].isIntersecting);},{threshold:0,rootMargin:'0px 0px -80px 0px'});
  planningObserver.observe(planForm);
  const revealTargets=[...document.querySelectorAll('.intro,.spaces-copy,.amenities>div,.autumn-copy,.section-top,.location-heading,.local-map,.planning-copy,.plan-form,.faq')];
  const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px -20px 0px'});
  revealTargets.forEach((target,index)=>{if(target.getBoundingClientRect().top>window.innerHeight&&!reducedMotion.matches){target.classList.add('reveal-target');target.style.setProperty('--reveal-delay',target.parentElement.classList.contains('amenities')?((index%6)*35)+'ms':'0ms');revealObserver.observe(target);}});
  document.addEventListener('focusin',event=>{const target=event.target.closest('.reveal-target');if(target){target.classList.add('is-visible');revealObserver.unobserve(target);}});
  reducedMotion.addEventListener('change',event=>{if(event.matches)revealTargets.forEach(target=>{target.classList.add('is-visible');revealObserver.unobserve(target);});});
}

const wandFill=document.querySelector('.scroll-wand-fill');
const wandTip=document.querySelector('.scroll-wand-tip');
const wandCount=document.querySelector('.scroll-wand-count');
let wandQueued=false;
function updateWand(){
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const value=Math.max(0,Math.min(100,window.scrollY/max*100));
  wandFill.style.height=value+'%';
  wandTip.style.top=value+'%';
  wandCount.textContent=String(Math.round(value)).padStart(2,'0');
  wandQueued=false;
}
window.addEventListener('scroll',()=>{
  if(!wandQueued){wandQueued=true;requestAnimationFrame(updateWand);}
},{passive:true});
window.addEventListener('resize',updateWand);
updateWand();


