/* Vybd shared motion: Motion (scroll, inView) + anime.js (split text, stagger, line draw) */
(function(){
  var M=window.Motion,A=window.anime,root=document.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ok=!!(M&&M.animate&&M.inView&&A&&A.animate)&&!reduce;
  var EASE=[.16,1,.3,1];
  var V=window.V={ok:ok,reduce:reduce,M:M,A:A,EASE:EASE};
  if(ok){
    root.classList.add('m');
    /* failsafe: any script error drops the hidden pre-reveal states so content never stays invisible */
    window.addEventListener('error',function(){root.classList.remove('m')});
  }

  /* mobile nav */
  var mb=document.getElementById('mbtn'),mn=document.getElementById('mnav');
  if(mb&&mn){
    var close=function(f){mn.classList.remove('open');mb.setAttribute('aria-expanded','false');if(f)mb.focus()};
    mb.addEventListener('click',function(){mn.style.top=Math.max(0,document.querySelector('.gnav').getBoundingClientRect().bottom)+'px';var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);if(o){var a=mn.querySelector('a');if(a)a.focus()}});
    mn.addEventListener('click',function(e){if(e.target.tagName==='A')close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mn.classList.contains('open'))close(true)});
  }

  V.once=function(el,fn,amount){
    if(!el)return;
    if(!ok){fn();return}
    M.inView(el,function(){fn();return undefined},{amount:amount==null?.2:amount,margin:'0px 0px -6% 0px'});
  };
  V.count=function(el,dur){
    var raw=el.getAttribute('data-to'),to=parseFloat(raw),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'';
    var fmt=function(n){return pre+Math.round(n).toLocaleString('en-US')+suf};
    if(!ok){el.textContent=fmt(to);return}
    el.textContent=fmt(0);
    M.animate(0,to,{duration:dur||1.6,ease:[.22,1,.36,1],onUpdate:function(v){el.textContent=fmt(v)}});
  };

  /* headings: split into words, rise from a clipped line */
  function split(el){
    if(el.dataset.done)return [];el.dataset.done='1';
    var words=[];
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var parts=n.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
          parts.forEach(function(p){
            if(!p)return;
            if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}
            var w=document.createElement('span');w.className='split-w';var i=document.createElement('span');i.textContent=p;w.appendChild(i);frag.appendChild(w);words.push(i);
          });
          n.parentNode.replaceChild(frag,n);
        }else if(n.nodeType===1&&n.tagName!=='BR')walk(n);
      });
    })(el);
    return words;
  }
  V.split=split;

  function revealAll(){
    document.querySelectorAll('[data-count]').forEach(function(el){V.once(el,function(){V.count(el)},.5)});
    if(!ok)return; /* reduced motion or no libraries: content is already in its final state */
    document.querySelectorAll('[data-split]').forEach(function(el){
      var lbl=el.textContent.replace(/\s+/g,' ').trim();
      if(!ok)return;
      el.setAttribute('aria-label',lbl);
      var w=split(el);
      w.forEach(function(s){s.setAttribute('aria-hidden','true')});
      V.once(el,function(){
        el.style.opacity=1;
        A.animate(w,{y:['110%','0%'],rotate:[4,0],duration:1100,delay:A.stagger(45,{start:+(el.dataset.delay||0)}),ease:'outExpo',onComplete:function(){w.forEach(function(s){s.style.transform=''})}});
      },.35);
    });
    document.querySelectorAll('[data-rv]').forEach(function(el){
      var kind=el.getAttribute('data-rv'),d=+(el.dataset.delay||0)/1000;
      /* clip-path hides the box from IntersectionObserver, so watch the parent */
      V.once(kind==='clip'?el.parentNode:el,function(){
        if(kind==='clip'){el.style.transitionDelay=d+'s';el.classList.add('in');return}
        if(kind==='stagger'){
          el.style.opacity=1;
          var kids=Array.prototype.slice.call(el.children);
          A.animate(kids,{opacity:[0,1],y:[28,0],duration:1000,delay:A.stagger(80,{start:d*1000}),ease:'outExpo'});
          return;
        }
        M.animate(el,{opacity:[0,1],y:[24,0],filter:['blur(6px)','blur(0px)']},{duration:1,delay:d,ease:EASE});
      },.15);
    });
    document.querySelectorAll('[data-draw]').forEach(function(el){
      var r=el.querySelector('.rule');if(!r)return;
      V.once(el,function(){M.animate(r,{scaleX:[0,1]},{duration:1.4,ease:EASE})},.5);
    });
  }

  /* scroll progress + ghost words drift (boostlab) */
  function scrolly(){
    var bar=document.querySelector('.sprog i');
    if(!ok){if(bar)bar.style.display='none';return}
    if(bar)M.scroll(M.animate(bar,{scaleX:[0,1]},{ease:'linear'}));
    document.querySelectorAll('.ghost span').forEach(function(g){
      var dir=g.parentNode.dataset.dir==='r'?1:-1;
      M.scroll(M.animate(g,{x:[dir*-8+'%',dir*8+'%']},{ease:'linear'}),{target:g.parentNode.parentNode,offset:['start end','end start']});
    });
    document.querySelectorAll('[data-par]').forEach(function(el){
      var k=+el.dataset.par||40;
      M.scroll(M.animate(el,{y:[k,-k]},{ease:'linear'}),{target:el,offset:['start end','end start']});
    });
  }

  V.start=function(){revealAll();scrolly()};
})();
