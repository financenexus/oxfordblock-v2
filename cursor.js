(function(){
  'use strict';
  /* Pointer spotlight on history cards — the custom mouse cursor was removed
     in favor of a native red CSS cursor (see cursor.css). */
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  if(!fine.matches) return;

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
