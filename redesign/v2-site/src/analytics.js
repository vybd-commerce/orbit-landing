/* Vybd analytics: first-party events, consent-gated (no Plausible, no third party).
   - Events go by navigator.sendBeacon to /api/site/track on vybd.ai, which stores them in Postgres
     (site_events) with no IP and no cookie.
   - Nothing is sent until the visitor accepts in the privacy banner.
   - Only sent from vybd.ai hosts; anywhere else (previews) events are logged with console.debug.
   - Links never depend on this file: if it fails to load, every button still works.
   - No personal data: labels, locations, plan names and coarse bands only. */
(function(){
  var CFG={
    endpoint:'/api/site/track',
    hosts:/(^|\.)vybd\.ai$/,                            // only send from production
    key:'vybd_consent_v1'                               // stored choice: 'granted' | 'denied'
  };
  var V=window.V||(window.V={});
  var sent={},pending=[];
  var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  var gpc=!!navigator.globalPrivacyControl;
  var tags={};                                         // utm_* and ref for this visit, filled below

  /* ---------- internal traffic: ?internal=1 marks this browser, ?internal=0 clears it ---------- */
  try{
    var iv=new URLSearchParams(location.search).get('internal');
    if(iv==='1')localStorage.setItem('vybd_internal','1');
    if(iv==='0')localStorage.removeItem('vybd_internal');
  }catch(e){}
  var internal=store.get('vybd_internal')==='1';

  function consent(){return store.get(CFG.key)}
  function live(){return consent()==='granted'&&!internal&&CFG.hosts.test(location.hostname)}
  function send(name,props){
    var body=JSON.stringify({event:name,page:document.body.getAttribute('data-page')||null,path:location.pathname,referrer:document.referrer||null,props:props,
      utm_source:tags.utm_source,utm_medium:tags.utm_medium,utm_campaign:tags.utm_campaign,ref:tags.ref});
    try{
      if(navigator.sendBeacon&&navigator.sendBeacon(CFG.endpoint,new Blob([body],{type:'application/json'})))return;
      fetch(CFG.endpoint,{method:'POST',body:body,keepalive:true,headers:{'content-type':'application/json'}}).catch(function(){});
    }catch(e){}
  }
  /* track(name, props, onceKey): props are strings/numbers only; onceKey dedupes per page load */
  V.track=function(name,props,once){
    if(once){if(sent[once])return;sent[once]=1}
    props=props||{};
    try{console.debug('[vybd-analytics]',name,JSON.stringify(props),live()?'sent':'(not sent: '+(consent()!=='granted'?'no consent':internal?'internal':'preview host')+')')}catch(e){}
    if(consent()===null&&!internal){if(pending.length<60)pending.push([name,props]);return}   /* undecided: hold in memory only; sent only if the visitor accepts */
    if(!live())return;
    send(name,props);
  };

  /* ---------- consent banner ---------- */
  function banner(){
    var b=document.getElementById('consent');if(!b)return;
    b.hidden=false;
    b.querySelector('[data-c="yes"]').onclick=function(){store.set(CFG.key,'granted');b.hidden=true;V.track('Consent',{choice:'granted'});var p=pending;pending=[];p.forEach(function(a){V.track(a[0],a[1])})};
    b.querySelector('[data-c="no"]').onclick=function(){store.set(CFG.key,'denied');b.hidden=true;pending=[]};
  }
  document.querySelectorAll('[data-consent-open]').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();banner()})});
  if(!consent()){
    if(gpc)store.set(CFG.key,'denied');            // Global Privacy Control = an existing "no"
    else setTimeout(banner,1200);
  }

  /* ---------- source tags: keep utm_* and ref across pages and onto every booking link ---------- */
  var KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref'];
  try{
    var sp=new URLSearchParams(location.search),saved=JSON.parse(sessionStorage.getItem('vybd_src')||'{}');
    KEYS.forEach(function(k){var v=sp.get(k)||saved[k];if(v&&/^[\w.\-]{1,64}$/.test(v))tags[k]=v});
    sessionStorage.setItem('vybd_src',JSON.stringify(tags));
  }catch(e){}
  function carry(a){
    var u;try{u=new URL(a.getAttribute('href'),location.href)}catch(e){return}
    var booking=/vybd\.ai$/.test(u.hostname)&&u.pathname.indexOf('/book')===0;
    var sibling=u.origin===location.origin&&/\.html$|\/$/.test(u.pathname)&&!u.hash;
    if(!booking&&!sibling)return;
    var ch=false;Object.keys(tags).forEach(function(k){if(!u.searchParams.has(k)){u.searchParams.set(k,tags[k]);ch=true}});
    if(ch)a.setAttribute('href',sibling&&u.origin===location.origin?u.pathname.split('/').pop()+u.search:u.toString());
  }
  if(Object.keys(tags).length)document.querySelectorAll('a[href]').forEach(carry);

  /* ---------- click tracking (one delegated listener) ---------- */
  function where(el){
    var l=el.closest('[data-loc]');if(l)return l.getAttribute('data-loc');
    var s=el.closest('section[id]');return s?s.id:'page';
  }
  function label(el){return (el.getAttribute('data-label')||el.textContent||'').replace(/\s+/g,' ').trim().replace(/[.:]$/,'').slice(0,60)}
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');if(!a)return;
    var u;try{u=new URL(a.href,location.href)}catch(x){return}
    var loc=where(a),txt=label(a),tier=a.closest('.tier');
    if(tier){
      V.track('Plan Click',{plan:label(tier.querySelector('h3')),price:label(tier.querySelector('.amt')),cta:txt,location:loc});
    }
    if(/vybd\.ai$/.test(u.hostname)&&u.pathname.indexOf('/book')===0){
      V.track('Book Call Click',{location:loc,cta:txt,intent:u.searchParams.get('for')||'general'});
    }else if(u.origin!==location.origin&&!/vybd\.ai$/.test(u.hostname)){
      V.track('Outbound Click',{target:u.hostname,location:loc});
    }else if(u.origin===location.origin&&/social-commerce/.test(u.pathname)){
      V.track('Social Page Click',{location:loc});
    }else if(u.origin===location.origin&&u.hash&&u.pathname===location.pathname){
      V.track('Nav Click',{target:u.hash.slice(1),location:loc});
    }else if(!tier){
      V.track('CTA Click',{target:u.pathname||'/',cta:txt,location:loc});
    }
  },true);

  /* ---------- engagement: sections seen for 1s at 40%+, scroll depth ---------- */
  if('IntersectionObserver' in window){
    var timers={};
    var io=new IntersectionObserver(function(es){es.forEach(function(en){
      var id=en.target.getAttribute('data-loc')||en.target.id;
      if(en.isIntersecting){timers[id]=setTimeout(function(){V.track('Section View',{section:id},'sv:'+id)},1000)}
      else clearTimeout(timers[id]);
    })},{threshold:.4});
    document.querySelectorAll('main section[id],main [data-loc]').forEach(function(s){io.observe(s)});
  }
  var marks=[25,50,75,100],tick=false;
  window.addEventListener('scroll',function(){
    if(tick)return;tick=true;
    requestAnimationFrame(function(){
      tick=false;
      var d=document.documentElement,p=(window.scrollY+window.innerHeight)/d.scrollHeight*100;
      marks.forEach(function(m){if(p>=m-1)V.track('Scroll Depth',{depth:String(m)},'sd:'+m)});
    });
  },{passive:true});

  /* ---------- calculator: report only a coarse sales band, after the visitor drags ---------- */
  var cr=document.getElementById('crange');
  if(cr){
    var ct;
    var band=function(v){return v<100000?'<$100K':v<250000?'$100K–250K':v<500000?'$250K–500K':v<1000000?'$500K–1M':'$1M+'};
    cr.addEventListener('input',function(e){
      if(!e.isTrusted)return;                                   // ignore the intro animation
      V.track('Calculator Used',{},'calc-first');
      clearTimeout(ct);ct=setTimeout(function(){var b=band(+cr.value);V.track('Calculator Band',{band:b},'calc:'+b)},1200);
    });
  }

  /* ---------- capability cards: "Where you get it" opened ---------- */
  document.addEventListener('toggle',function(e){
    var d=e.target;if(!d.matches||!d.matches('.cc details')||!d.open)return;
    var t=label(d.closest('.cc').querySelector('h3'));V.track('Capability Open',{card:t},'cap:'+t);
  },true);
  /* ---------- pageview (held until a choice, like every event) ---------- */
  V.track('Pageview',{},'pv');
})();
