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

