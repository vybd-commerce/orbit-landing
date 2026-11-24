(function(){
  var V=window.V,M=V.M,A=V.A,ok=V.ok,$=function(s){return document.getElementById(s)};
  var ic=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
  var CAP=[
    {q:'Where is the opportunity?',t:'Understand your market',p:'Demand, competitors and pricing, researched before you spend.',g:['Demand research','Competitor analysis','US pricing'],s:'Market',i:ic('<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>')},
    {q:'How do I get ready?',t:'Get your business ready',p:'US rules, labels and paperwork, handled so your products can come in.',g:['Regulatory compliance','Documentation','Import readiness'],s:'Compliance',i:ic('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>')},
    {q:'How do products get here?',t:'Get your products here',p:'Freight, customs and warehousing, so stock is where you need it.',g:['Freight','Customs coordination','Warehousing','Inventory'],s:'Logistics',i:ic('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>')},
    {q:'How do I sell?',t:'Build your sales channels',p:'Your stores, listings and marketplaces, set up and managed.',g:['Marketplace setup','Product listings','Channel management'],s:'Sales',i:ic('<path d="M3 4h2l2.4 11h11L21 8H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>')},
    {q:'How do I keep it running?',t:'Run your day-to-day operations',p:'Customer questions, returns and daily support, kept running.',g:['Customer support','Returns','Operational management'],s:'Operations',i:ic('<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>')}
  ];
  var WHERE=[
    [['Vybd Plan','$33/mo','US demand and competitors; positioning and pricing'],['US Scale','from $3,000/mo','Monthly market and buyer research']],
    [['Test Drop','$3,000','Customs clearance handled'],['US Launch','$20,000','FDA and compliance support, label review']],
    [['Test Drop','$3,000','Freight for up to 500 units and 90 days of US warehousing'],['US Scale','from $3,000/mo','Inventory, purchase orders, deductions and reporting']],
    [['Vybd Plan','$33/mo','Which channels to start on'],['US Launch','$20,000','Amazon, Walmart and Shopify set up; listings, copy, images and video']],
    [['US Scale','from $3,000/mo','A senior operator, 8 hours a month'],['US Scale','from $3,000/mo','Inventory, purchase orders, deductions and reporting']]
  ];
  var tick='<span class="tk" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.3 2.3 4.7-5"/></svg></span>';
  var plus='<i aria-hidden="true"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 1.5v9M1.5 6h9"/></svg></i>';
  var track=$('capstrack'),fns=$('fns');
  CAP.forEach(function(c,i){
    fns.insertAdjacentHTML('beforeend','<li>'+c.i+c.s+tick+'</li>');
    var wh=WHERE[i].map(function(w){return '<li><b>'+w[0]+'</b><em>'+w[1]+'</em><span>'+w[2]+'</span></li>'}).join('');
    track.insertAdjacentHTML('beforeend','<article class="cc"><p class="q">'+c.q+'</p><span class="ci">'+c.i+'</span><h3>'+c.t+'</h3><p>'+c.p+'</p><div class="tags">'+c.g.map(function(x){return '<span>'+x+'</span>'}).join('')+'</div><details><summary>Where you get it'+plus+'</summary><ul class="wh">'+wh+'</ul></details></article>');
  });

  V.start();

  /* hero B: docks slide in, crate drops, inbound lanes draw, then outbound; parcels in, orders out */
  (function(){
    var flow=$('flow');if(!flow)return;
    var NS='http://www.w3.org/2000/svg',pk=$('fpk'),ping=$('fping'),done=false;
    var ins=[0,1,2,3].map(function(i){return $('fi'+i)}),outs=[0,1,2].map(function(i){return $('fo'+i)});
    var docks=flow.querySelectorAll('.dock'),dests=flow.querySelectorAll('.dest');
    function mover(path,dur,begin,make){
      var g=make();var am=document.createElementNS(NS,'animateMotion');am.setAttribute('dur',dur+'s');am.setAttribute('begin',begin+'s');am.setAttribute('repeatCount','indefinite');am.setAttribute('rotate','auto');
      var mp=document.createElementNS(NS,'mpath');mp.setAttribute('href','#'+path.id);am.appendChild(mp);g.appendChild(am);pk.appendChild(g);
    }
    function parcel(){var g=document.createElementNS(NS,'g');g.innerHTML='<rect class="parcel" x="-9" y="-7" width="18" height="14" rx="2"/><rect class="parcel-t" x="-9" y="-1.5" width="18" height="3"/>';return g}
    function order(){var c=document.createElementNS(NS,'circle');c.setAttribute('r',5);c.setAttribute('class','order');return c}
    function draw(p,cb){
      p.classList.remove('wait');
      if(!ok){p.classList.add('ani');cb&&cb();return}
      p.setAttribute('pathLength','1');p.style.strokeDasharray='1';p.style.strokeDashoffset='1';void p.getBoundingClientRect();
      p.style.transition='stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)';p.style.strokeDashoffset='0';
      setTimeout(function(){p.removeAttribute('pathLength');p.style.transition=p.style.strokeDasharray=p.style.strokeDashoffset='';p.classList.add('ani');cb&&cb()},820);
    }
    function pulse(){ping.classList.remove('go');void ping.offsetWidth;ping.classList.add('go')}
    if(!ok){flow.classList.remove('pre');ins.concat(outs).forEach(function(p){draw(p)});return}
    ins.concat(outs).forEach(function(p){p.classList.add('wait')});
    function play(){
      if(done)return;done=true;
      docks.forEach(function(d,k){d.style.transitionDelay=(k*.1)+'s'});dests.forEach(function(d,k){d.style.transitionDelay=(.5+k*.1)+'s'});
      flow.classList.remove('pre');
      ins.forEach(function(p,k){setTimeout(function(){draw(p,function(){pulse();mover(p,3.6+k*.35,0,parcel);mover(p,3.6+k*.35,(3.6+k*.35)/2,parcel)})},900+k*260)});
      setTimeout(function(){outs.forEach(function(p,k){draw(p,function(){mover(p,2.4+k*.3,0,order);mover(p,2.4+k*.3,1.2,order)})})},900+4*260+600);
    }
    V.once(flow,play,.3);
    if('IntersectionObserver' in window){var s=flow.querySelector('svg');new IntersectionObserver(function(es){es.forEach(function(e){flow.classList.toggle('idle',!e.isIntersecting);if(s.pauseAnimations){e.isIntersecting?s.unpauseAnimations():s.pauseAnimations()}})}).observe(flow)}
  })();

  /* partner hub: wires draw out from the core, then the six functions land */
  var hub=$('hub');
  if(ok&&hub){
    var wires=hub.querySelectorAll('.hub-wire path');
    wires.forEach(function(w){w.style.opacity=0});
    V.once(hub,function(){A.animate(wires,{opacity:[0,1],strokeDashoffset:[40,0],duration:900,delay:A.stagger(250,{start:200}),ease:'outQuad'})},.3);
  }

  /* problem: messages land one by one, the counter climbs to 27 */
  var ib=$('inbox'),n=$('ibn'),items=document.querySelectorAll('#iblist li');
  V.once(ib,function(){
    if(!ok)return;
    A.animate(items,{opacity:[0,1],x:[-16,0],duration:700,delay:A.stagger(110,{start:300}),ease:'outExpo'});
    M.animate(0,27,{duration:1.6,delay:.3,ease:[.22,1,.36,1],onUpdate:function(v){n.textContent=Math.round(v)}});
  },.3);

  /* stories: bars fill when the cards land */
  document.querySelectorAll('.pc').forEach(function(pc){V.once(pc,function(){pc.classList.add('in')},.4)});

  /* capabilities: pin + horizontal drive on wide screens; swipe track elsewhere */
  var caps=$('solutions'),pin=$('capspin'),wrap=$('capswrap'),bar=$('capsbar'),sw=$('capsw');
  var wide=window.matchMedia('(min-width:1024px)');
  var stopScroll=null,anim=null;
  function overflow(){return Math.max(0,track.scrollWidth-document.documentElement.clientWidth)}
  function layout(){
    if(stopScroll){stopScroll();stopScroll=null}
    if(anim){anim.cancel&&anim.cancel();anim=null}
    track.style.transform='';
    if(ok&&wide.matches&&overflow()>40){
      caps.classList.add('pinned');
      pin.style.height='calc(100svh - var(--nav-h) + '+overflow()+'px)';
      stopScroll=M.scroll(function(p){if(p>.95&&V.track)V.track('Capabilities End',{mode:'pinned'},'caps-end');track.style.transform='translate3d('+(-p*overflow())+'px,0,0)';bar.style.transform='scaleX('+(.15+.85*p)+')'},{target:pin,offset:['start '+getNav()+'px','end end']});
      sw.textContent='Scroll for more';
    }else{
      caps.classList.remove('pinned');pin.style.height='';
      sw.textContent='Swipe for more';
    }
  }
  function getNav(){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||64}
  wrap.addEventListener('scroll',function(){var m=wrap.scrollWidth-wrap.clientWidth;if(m&&wrap.scrollLeft>=m-8&&V.track)V.track('Capabilities End',{mode:'swipe'},'caps-end');bar.style.transform='scaleX('+(.15+.85*(m?wrap.scrollLeft/m:0))+')'},{passive:true});
  $('prev').addEventListener('click',function(){wrap.scrollBy({left:-wrap.clientWidth*.8,behavior:V.reduce?'auto':'smooth'})});
  $('next').addEventListener('click',function(){wrap.scrollBy({left:wrap.clientWidth*.8,behavior:V.reduce?'auto':'smooth'})});
  /* keyboard: a focused card in the pinned row scrolls the page until the card is on screen */
  track.addEventListener('focusin',function(e){
    if(!caps.classList.contains('pinned'))return;
    var card=e.target.closest('.cc');if(!card)return;
    var o=overflow(),pad=parseFloat(getComputedStyle(track).paddingLeft)||0;
    var p=Math.min(1,Math.max(0,(card.offsetLeft-pad)/o));
    var nav=getNav(),top=pin.getBoundingClientRect().top+window.scrollY-nav;
    window.scrollTo({top:top+p*(pin.offsetHeight-(window.innerHeight-nav)),behavior:'auto'});
  });
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,150)});
  layout();
  if(ok){V.once(track,function(){A.animate(track.children,{opacity:[0,1],x:[80,0],rotate:[2,0],duration:1100,delay:A.stagger(70),ease:'outExpo'})},.15)}

  /* control tower: one real state change — receiving finishes, listings start, the flag clears */
  V.once($('ctart'),function(){
    var go=function(){
      var c4=$('ct4'),c5=$('ct5');
      c4.querySelector('i').className='ok';c4.querySelector('em').textContent='Done';
      c5.querySelector('i').className='now';c5.querySelector('em').textContent='In progress';
      $('ctwk').textContent='Week 7';$('ctdone').textContent='5 of 6 done';$('ctbar').style.width='83.3%';
      [c4,c5,$('ctwk').parentNode].forEach(function(el){A.animate(el,{backgroundColor:['rgba(27,181,155,.22)','rgba(27,181,155,0)'],duration:1400,ease:'outQuad'})});
      $('ctflag').classList.add('cleared');$('ctflag').querySelector('span').textContent='Resolved by an operator';$('ctopen').textContent='1 open';
    };
    if(ok)setTimeout(go,1600);
  },.4);

  /* how: line drawn by scroll, first-order card lands at the end */
  var fill=$('stepsfill'),steps=$('steps');
  if(ok){
    M.scroll(function(p){var k=Math.min(1,p*1.5);fill.style.transform=(wide.matches?'scaleX(':'scaleY(')+k+')'},{target:steps,offset:['start 80%','end 60%']});
    V.once($('firstorder'),function(){M.animate($('firstorder'),{opacity:[0,1],y:[30,0],scale:[.94,1]},{type:'spring',bounce:.35,duration:.9,delay:.2})},.6);
  }

  /* who: strips as tabs (C&R accordion) */
  var strips=[].slice.call(document.querySelectorAll('.strip'));
  function pick(i,how){var t=strips[i].querySelector('[role=tab]').textContent.trim().replace(/\.$/,'');if(V.track)V.track('Who Tab',{segment:t,via:how},'who:'+t)}
  function sel(i,focus){
    strips.forEach(function(s,k){
      var on=k===i,b=s.querySelector('[role=tab]'),p=s.querySelector('[role=tabpanel]');
      s.classList.toggle('on',on);b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;p.hidden=!on;
      if(on&&ok)M.animate(p,{opacity:[0,1],y:[16,0]},{duration:.7,delay:.15,ease:V.EASE});
    });
    if(focus)strips[i].querySelector('[role=tab]').focus();
  }
  strips.forEach(function(s,i){
    var b=s.querySelector('[role=tab]');
    b.addEventListener('click',function(){sel(i);pick(i,'click')});
    var hov,hovT;
    s.addEventListener('mouseenter',function(){if(window.matchMedia('(min-width:900px) and (hover:hover)').matches&&!s.classList.contains('on'))hov=setTimeout(function(){sel(i);hovT=setTimeout(function(){pick(i,'hover')},1200)},140)});
    s.addEventListener('mouseleave',function(){clearTimeout(hov);clearTimeout(hovT)});
    b.addEventListener('keydown',function(e){
      var k=e.key,j=null;
      if(k==='ArrowRight'||k==='ArrowDown')j=(i+1)%strips.length;
      if(k==='ArrowLeft'||k==='ArrowUp')j=(i-1+strips.length)%strips.length;
      if(k==='Home')j=0;if(k==='End')j=strips.length-1;
      if(j!==null){e.preventDefault();sel(j,true);pick(j,'keyboard')}
    });
  });

  /* pricing ladder */
  V.once($('ladfill'),function(){if(ok)M.animate($('ladfill'),{scaleX:[0,1]},{duration:1.6,ease:V.EASE})},.6);

  /* calculator (same model as vybd.ai's): $40 order, 15% product cost, 10% marketing */
  var r=$('crange'),rv=$('crev'),kp=$('ckeep'),sp=document.querySelectorAll('#csplit i'),note=$('cnote');
  var AOV=40,LB=Math.ceil(Math.max(1.5,(12*9*5)/139)),UL=5.5+1.2*Math.max(0,LB-1)+2.5+.5+.5+.6,shown=0,ctl=null;
  function model(v){var lg=v/AOV*UL,cg=v*.15,mk=v*.1,vy=v*.12+36000,keep=v-cg-mk-lg-vy,parts=[cg,lg,mk,vy,Math.max(0,keep)],tot=parts.reduce(function(a,b){return a+b},0);return {keep:keep,sh:parts.map(function(x){return x/tot*100})}}
  function money(x){return (x<0?'−$':'$')+Math.abs(Math.round(x)).toLocaleString('en-US')}
  function render(v,instant){
    var m=model(v),vs='$'+Math.round(v).toLocaleString('en-US');rv.textContent=vs;r.setAttribute('aria-valuetext',vs+' a year, keep about '+money(m.keep));note.hidden=m.keep>=0;
    sp.forEach(function(el,i){el.style.flexBasis=m.sh[i]+'%'});kp.classList.toggle('neg',m.keep<0);
    if(ctl){ctl.stop();ctl=null}
    if(instant||!ok){shown=m.keep;kp.textContent=money(m.keep);return}
    ctl=M.animate(shown,m.keep,{duration:.45,ease:[.22,1,.36,1],onUpdate:function(x){shown=x;kp.textContent=money(x)}});
  }
  r.addEventListener('input',function(){render(+r.value)});
  render(+r.value,true);
  V.once($('calcbox'),function(){
    if(!ok){kp.setAttribute('aria-live','polite');return}
    M.animate(50000,250000,{duration:1.6,ease:'easeInOut',onUpdate:function(v){v=Math.round(v/10000)*10000;r.value=v;render(v,true)},onComplete:function(){kp.setAttribute('aria-live','polite')}});
  },.4);

  /* enterprise: systems pass into the panel */
  V.once($('entart'),function(){
    if(!ok)return;
    var art=$('entart');
    A.animate(art.querySelectorAll('.ent-sys li'),{opacity:[0,1],y:[10,0],duration:600,delay:A.stagger(50),ease:'outExpo'});
    A.animate(art.querySelectorAll('.ag'),{opacity:[0,1],x:[24,0],duration:800,delay:A.stagger(160,{start:450}),ease:'outExpo'});
  },.3);

  /* pause infinite loops offscreen */
  if(ok&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('idle',!e.isIntersecting)})});
    document.querySelectorAll('.hub,#ctart').forEach(function(e){io.observe(e)});
  }
})();
