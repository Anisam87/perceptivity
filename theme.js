/* PERCEPTIVITY — theme engine retired.
   Only one reality: black. Force dark, no toggle. */
(function(){
  try{ document.documentElement.removeAttribute('data-theme'); }catch(e){}
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.theme-toggle').forEach(function(t){ t.remove(); });
  });
})();
