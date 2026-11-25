(function(){
  var header=document.querySelector('.site-header');
  var hasHero=document.body.classList.contains('has-hero');
  function onScroll(){ if(hasHero) header.classList.toggle('is-solid', window.scrollY > window.innerHeight*0.6); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  var burger=document.querySelector('.burger');
  burger.addEventListener('click',function(){
    var open=document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded',open);
  });
  document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav-open')})});

  // reveal on scroll
  var io='IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} });
  },{threshold:.12}) : null;
  document.querySelectorAll('.reveal').forEach(function(el){ io ? io.observe(el) : el.classList.add('is-in'); });

  // hero slider
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  if(slides.length){
    var dots=[].slice.call(document.querySelectorAll('.hero-dots button'));
    var cap=document.querySelector('.hero-caption'), capName=document.querySelector('.hero-caption-name');
    var i=0, t;
    function go(n){
      slides[i].classList.remove('is-on'); dots[i].classList.remove('is-on');
      i=(n+slides.length)%slides.length;
      slides[i].classList.add('is-on'); dots[i].classList.add('is-on');
      capName.textContent=slides[i].dataset.name; cap.href=slides[i].dataset.href;
    }
    function play(){ clearInterval(t); t=setInterval(function(){go(i+1)},6000); }
    dots.forEach(function(d,k){ d.addEventListener('click',function(){go(k);play();}); });
    play();
  }

  // project filters
  var filters=document.querySelectorAll('.filters button');
  if(filters.length){
    function apply(f){
      filters.forEach(function(b){b.classList.toggle('is-on',b.dataset.filter===f)});
      document.querySelectorAll('.grid-all .card').forEach(function(c){ c.classList.toggle('is-hidden', f!=='all' && c.dataset.cat!==f); });
    }
    filters.forEach(function(b){ b.addEventListener('click',function(){ apply(b.dataset.filter); history.replaceState(null,'',b.dataset.filter==='all'?location.pathname:'#'+b.dataset.filter); }); });
    var h=location.hash.slice(1); if(h==='exterior'||h==='interior') apply(h);
  }

  // lightbox
  var items=[].slice.call(document.querySelectorAll('[data-lightbox]'));
  var lb=document.querySelector('.lightbox');
  if(items.length && lb){
    var img=lb.querySelector('img'), count=lb.querySelector('.lb-count'), cur=0;
    function show(n){ cur=(n+items.length)%items.length; img.src=items[cur].href; count.textContent=(cur+1)+' / '+items.length; }
    function close(){ lb.hidden=true; document.body.style.overflow=''; }
    items.forEach(function(a,k){ a.addEventListener('click',function(e){ e.preventDefault(); show(k); lb.hidden=false; document.body.style.overflow='hidden'; }); });
    lb.querySelector('.lb-close').onclick=close;
    lb.querySelector('.lb-prev').onclick=function(){show(cur-1)};
    lb.querySelector('.lb-next').onclick=function(){show(cur+1)};
    lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown',function(e){ if(lb.hidden) return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(cur-1); if(e.key==='ArrowRight')show(cur+1); });
    var sx=null; lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){ if(sx===null)return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) show(cur+(dx<0?1:-1)); sx=null; });
  }
})();
