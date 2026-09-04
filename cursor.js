(function(){
  'use strict';
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
  if(!fine.matches || reduce.matches) return;

  var pointer=document.createElement('span');
  pointer.className='oxfordCursorPointer';
  pointer.setAttribute('aria-hidden','true');
  /* Clean SVG arrow cursor — Oxford red with white border, like a real OS cursor */
  pointer.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28" fill="none">'
    +'<path d="M1 1L1 23.5L6.5 18L11.5 27L15 25.5L10 16.5L17 15.5L1 1Z" fill="#D42B24" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>'
    +'</svg>';
  document.body.appendChild(pointer);
  document.documentElement.classList.add('oxford-cursor');

  var tx=-60,ty=-60,visible=false,pressed=false,interactive=false;
  var currentScale=1,targetScale=1;
  var raf=null;

  function setVisible(show){
    visible=show;
    pointer.classList.toggle('is-visible',show);
  }

  function applyTransform(){
    pointer.style.transform='translate3d('+tx+'px,'+ty+'px,0) scale('+currentScale+')';
  }

  function animateScale(){
    var diff=targetScale-currentScale;
    if(Math.abs(diff)<0.005){
      currentScale=targetScale;
      applyTransform();
      raf=null;
      return;
    }
    currentScale+= diff*0.35;
    applyTransform();
    raf=requestAnimationFrame(animateScale);
  }

  function setScale(s){
    targetScale=s;
    if(!raf) raf=requestAnimationFrame(animateScale);
  }

  function setMode(target){
    var text=!!target.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]');
    interactive=!!target.closest('a,button,select,label,[role="button"],[role="radio"],summary');
    pointer.classList.toggle('is-text',text);
    if(text){
      setScale(1);
    } else if(pressed){
      setScale(0.85);
    } else if(interactive){
      setScale(1.1);
    } else {
      setScale(1);
    }
  }

  document.addEventListener('pointermove',function(event){
    if(event.pointerType&&event.pointerType!=='mouse') return;
    tx=event.clientX;ty=event.clientY;
    applyTransform();
    if(!visible){setVisible(true)}
    setMode(event.target);
  },{passive:true});

  document.addEventListener('pointerdown',function(event){
    if(event.pointerType==='mouse'||!event.pointerType){
      pressed=true;
      setScale(0.85);
    }
  },{passive:true});

  document.addEventListener('pointerup',function(){
    pressed=false;
    setScale(interactive?1.1:1);
  },{passive:true});

  document.addEventListener('pointercancel',function(){
    pressed=false;
    setScale(1);
    setVisible(false);
  },{passive:true});

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
