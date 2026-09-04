(function(){
  'use strict';
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
  if(!fine.matches || reduce.matches) return;

  var pointer=document.createElement('span');
  pointer.className='oxfordCursorPointer';
  pointer.setAttribute('aria-hidden','true');
  document.body.appendChild(pointer);
  document.documentElement.classList.add('oxford-cursor');

  var tx=-60,ty=-60,visible=false;
  function setVisible(show){
    visible=show;
    pointer.classList.toggle('is-visible',show);
  }
  function setMode(target){
    var text=!!target.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]');
    var interactive=!!target.closest('a,button,select,label,[role="button"],[role="radio"],summary');
    pointer.classList.toggle('is-text',text);
    pointer.classList.toggle('is-interactive',interactive&&!text);
  }
  document.addEventListener('pointermove',function(event){
    if(event.pointerType&&event.pointerType!=='mouse') return;
    tx=event.clientX;ty=event.clientY;
    pointer.style.transform='translate3d('+tx+'px,'+ty+'px,0)';
    if(!visible){setVisible(true)}
    setMode(event.target);
  },{passive:true});
  document.addEventListener('pointerdown',function(event){if(event.pointerType==='mouse'||!event.pointerType)pointer.classList.add('is-pressed')},{passive:true});
  document.addEventListener('pointerup',function(){pointer.classList.remove('is-pressed')},{passive:true});
  document.addEventListener('pointercancel',function(){pointer.classList.remove('is-pressed');setVisible(false)},{passive:true});
  document.documentElement.addEventListener('mouseleave',function(){setVisible(false)});
  document.documentElement.addEventListener('mouseenter',function(){if(tx>-1)setVisible(true)});
  document.addEventListener('visibilitychange',function(){if(document.hidden)setVisible(false)});

  /* Keep the history-card light aligned with the same pointer position. */
  document.querySelectorAll('.tlItem').forEach(function(card){
    card.addEventListener('pointermove',function(event){
      var rect=card.getBoundingClientRect();
      card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');
      card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');
    },{passive:true});
    card.addEventListener('pointerleave',function(){
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    });
  });
})();
