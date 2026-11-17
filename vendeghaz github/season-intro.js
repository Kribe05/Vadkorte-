(()=>{
  // Future seasons reuse this motion; replace the artwork and the seasonal label.
  const SETTINGS={season:'autumn',pauseMs:300,openingMs:2300};
  const root=document.documentElement;
  const intro=document.getElementById('season-intro');
  if(!intro)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!root.classList.contains('intro-pending')||motion.matches){clearTimeout(window.__vadkorteIntroFallback);root.classList.remove('intro-pending','intro-revealing');intro.remove();return;}
  const panel=intro.querySelector('.intro-panel');
  const artwork=intro.querySelector('.intro-leaves');
  const skip=intro.querySelector('.intro-skip');
  const previousFocus=document.activeElement;
  let finished=false;
  let safetyTimer;
  let revealTimer;
  let replayReady=false;
  let replayArmed=false;
  function replayCurtain(){
    if(motion.matches||root.classList.contains('intro-pending')||document.querySelector('dialog[open]'))return;
    intro.classList.remove('replay');
    void intro.offsetWidth;
    root.classList.add('intro-replay');
    intro.classList.add('replay');
    const onEnd=event=>{if(event.target!==panel||event.animationName!=='raise-curtain')return;intro.classList.remove('replay');root.classList.remove('intro-replay');panel.removeEventListener('animationend',onEnd);};
    panel.addEventListener('animationend',onEnd);
  }
  function onScroll(){
    if(window.scrollY>Math.max(650,window.innerHeight*.85))replayArmed=true;
    if(replayArmed&&window.scrollY<75){replayArmed=false;replayCurtain();}
  }
  function prepareReplay(){if(replayReady||motion.matches)return;replayReady=true;window.addEventListener('scroll',onScroll,{passive:true});}

  const pageElements=[document.querySelector('.header'),document.getElementById('main'),document.querySelector('.mobile-planning'),document.querySelector('.skip')].filter(Boolean);
  function finish(){
    if(finished)return;
    finished=true;
    clearTimeout(safetyTimer);
    clearTimeout(revealTimer);
    clearTimeout(window.__vadkorteIntroFallback);
    root.classList.remove('intro-pending');
    root.classList.remove('intro-revealing');
    document.body.classList.remove('intro-active');
    pageElements.forEach(element=>{element.inert=element.dataset.introInert==='true';delete element.dataset.introInert;});
    document.removeEventListener('keydown',onKeyDown,true);
    window.removeEventListener('beforeprint',finish);
    window.removeEventListener('pagehide',finish);
    motion.removeEventListener('change',onMotionChange);
    intro.classList.remove('is-opening');
    intro.setAttribute('aria-hidden','true');
    intro.inert=true;
    prepareReplay();
    if(previousFocus&&previousFocus!==document.body&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
  }
  function onKeyDown(event){if(event.key==='Escape'){event.preventDefault();finish();}}
  function onMotionChange(event){if(event.matches)finish();}
  window.__vadkorteFinishIntro=finish;
  intro.dataset.season=SETTINGS.season;
  intro.style.setProperty('--intro-pause',SETTINGS.pauseMs+'ms');
  intro.style.setProperty('--intro-opening',SETTINGS.openingMs+'ms');
  intro.setAttribute('aria-hidden','false');
  pageElements.forEach(element=>{element.dataset.introInert=String(Boolean(element.inert));element.inert=true;});
  document.body.classList.add('intro-active');
  skip.focus({preventScroll:true});
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',onKeyDown,true);
  window.addEventListener('beforeprint',finish);
  window.addEventListener('pagehide',finish);
  motion.addEventListener('change',onMotionChange);
  panel.addEventListener('animationend',event=>{if(event.target===panel&&event.animationName==='raise-curtain')finish();});
  safetyTimer=setTimeout(finish,4400);
  const decoded=typeof artwork.decode==='function'?artwork.decode().catch(()=>{}):Promise.resolve();
  Promise.race([decoded,new Promise(resolve=>setTimeout(resolve,500))]).then(()=>{if(!finished&&!motion.matches){intro.classList.add('is-opening');revealTimer=setTimeout(()=>{if(!finished)root.classList.add('intro-revealing');},SETTINGS.pauseMs+Math.round(SETTINGS.openingMs*.55));}else if(motion.matches)finish();});
})();

