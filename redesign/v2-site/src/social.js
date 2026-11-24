(function(){
  var V=window.V,A=V.A,M=V.M,ok=V.ok;
  V.start();
  var chart=document.getElementById('chart');
  if(!ok)return;
  /* chart: card rises, the steady mint line draws first, then the order spikes */
  var spike=A.svg.createDrawable(chart.querySelector('.spike')),ship=A.svg.createDrawable(chart.querySelector('.ship'));
  var pk=chart.querySelectorAll('.pk,.anno');
  A.animate([spike,ship],{draw:['0 0','0 0'],duration:0});pk.forEach(function(e){e.style.opacity=0});
  chart.style.opacity=0;
  var tl=A.createTimeline({delay:700,defaults:{ease:'outExpo'}});
  tl.add(chart,{opacity:[0,1],y:[40,0],duration:1000})
    .add(ship,{draw:['0 0','0 1'],duration:1100,ease:'inOutQuad'},'-=500')
    .add(spike,{draw:['0 0','0 1'],duration:1800,ease:'inOutSine'},'-=700')
    .add(pk,{opacity:[0,1],scale:[.6,1],duration:600,delay:A.stagger(120)},'-=900');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.style.animationPlayState=e.isIntersecting?'running':'paused'})});
  var lt=document.querySelector('.logos-t');if(lt)io.observe(lt);
})();
