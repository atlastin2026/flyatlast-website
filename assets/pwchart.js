/* FlyAtlast Price Watch example chart, drawn in the app's own chart theme
   (light-blue "you don't pay" zones, yellow fee band between navy lines,
   dashed pre-watch line, navy watch line). One source for the home page
   and the Why FlyAtlast page. Prices are illustrative. */
(function(){
  var NAVY='#1E3A5F',YEL='#F4C11C',LB='#EAF1F8',MU='#4A5F78';
  var UP='C$1,314',LO='C$1,279',D0='C$1,307';
  var S={
    above:{fin:'C$1,324',chip:'You pay nothing',cls:'n',note:'Ended above '+UP+'. The fee only applies inside the range.',pts:[[0,0],[.12,-.15],[.25,.1],[.38,-.12],[.52,-.45],[.68,-.85],[.84,-1.15],[1,-1.45]]},
    inside:{fin:'C$1,306',chip:'Inside the fee range: fee applies',cls:'y',note:'Ended between '+LO+' and '+UP+', so the fee applies.',pts:[[0,0],[.12,-.2],[.25,.15],[.38,-.1],[.52,.2],[.68,-.15],[.84,.25],[1,.1]]},
    below:{fin:'C$1,271',chip:'You pay nothing',cls:'n',note:'Ended below '+LO+'. The fee only applies inside the range.',pts:[[0,0],[.12,.2],[.25,.5],[.38,.35],[.52,.9],[.68,1.3],[.84,1.55],[1,1.85]]}
  };
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
  function svg(state,W,animate){
    var st=S[state]||S.above,narrow=W<430;
    var H=narrow?250:240,pL=10,pR=W-12,pT=34,pB=H-30;
    var sx=Math.round(W*(narrow?.2:.27));
    var dy=Math.round(pT+(pB-pT)*.47),uy=dy-14,ly=dy+Math.round((pB-pT)*.27);
    var unit=(ly-uy)*.62; // vertical scale for the scenario paths
    var tpts=st.pts.map(function(p){return [Math.round(sx+(pR-sx)*p[0]),Math.round(dy+p[1]*unit*.9)];});
    var cl=function(y){return Math.max(pT+6,Math.min(pB-6,y));};
    tpts=tpts.map(function(p){return [p[0],cl(p[1])];});
    var pre=[[pL,dy+10],[pL+(sx-pL)*.25,dy+20],[pL+(sx-pL)*.5,dy+12],[pL+(sx-pL)*.75,dy+26],[sx-6,dy+14],[sx,dy]].map(function(p){return Math.round(p[0])+','+Math.round(p[1]);}).join(' ');
    var anim=animate?' fapw-go':'';
    var s='<svg class="fapw-svg'+anim+'" viewBox="0 0 '+W+' '+H+'" width="100%" height="'+H+'" role="img" aria-label="Example 48-hour Price Watch chart. You pay nothing if the price ends above '+UP+' or below '+LO+'. The fee applies only inside the yellow band.">';
    s+='<rect x="'+sx+'" y="'+pT+'" width="'+(pR-sx)+'" height="'+(uy-pT)+'" fill="'+LB+'"/>';
    s+='<rect x="'+sx+'" y="'+ly+'" width="'+(pR-sx)+'" height="'+(pB-ly)+'" fill="'+LB+'"/>';
    s+='<rect x="'+sx+'" y="'+uy+'" width="'+(pR-sx)+'" height="'+(ly-uy)+'" fill="'+YEL+'"/>';
    s+='<line x1="'+sx+'" y1="'+uy+'" x2="'+pR+'" y2="'+uy+'" stroke="'+NAVY+'" stroke-width="2.2"/><line x1="'+sx+'" y1="'+ly+'" x2="'+pR+'" y2="'+ly+'" stroke="'+NAVY+'" stroke-width="2.2"/>';
    s+='<line x1="'+sx+'" y1="'+dy+'" x2="'+pR+'" y2="'+dy+'" stroke="'+NAVY+'" stroke-width="1" stroke-dasharray="2 3" opacity=".7"/>';
    s+='<line x1="'+sx+'" y1="'+(pT-8)+'" x2="'+sx+'" y2="'+pB+'" stroke="'+NAVY+'" stroke-width="1.4" stroke-dasharray="3 3" opacity=".6"/>';
    s+='<text x="'+(sx+8)+'" y="'+(pT-14)+'" font-size="12" font-weight="700" fill="'+NAVY+'">watch started</text>';
    s+='<polyline points="'+pre+'" fill="none" stroke="#9FB3C8" stroke-width="2.4" stroke-dasharray="6 4"/>';
    s+='<polyline class="fapw-l" pathLength="1" points="'+tpts.map(function(p){return p.join(',');}).join(' ')+'" fill="none" stroke="'+NAVY+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
    var L=tpts[tpts.length-1];
    s+='<circle class="fapw-dot" cx="'+L[0]+'" cy="'+L[1]+'" r="7.5" fill="'+NAVY+'" stroke="#fff" stroke-width="3"/>';
    function t(x,y,txt,bg){return '<text x="'+x+'" y="'+y+'" font-size="'+(narrow?11.5:12)+'" font-weight="700" fill="'+NAVY+'" stroke="'+bg+'" stroke-width="4" stroke-linejoin="round" paint-order="stroke">'+esc(txt)+'</text>';}
    s+=t(sx+8,pT+16,narrow?'Pay nothing above '+UP:'You don’t pay if the price ends above '+UP,LB);
    s+=t(sx+8,pB-9,narrow?'Pay nothing below '+LO:'You don’t pay if the price ends below '+LO,LB);
    s+=t(sx+8,ly-7,'Day 0 '+D0,YEL);
    s+='<line x1="'+pL+'" y1="'+pB+'" x2="'+pR+'" y2="'+pB+'" stroke="#C9D3DB"/>';
    [['Fri 7 Nov',sx,'start'],['Sat 8',(sx+pR)/2,'middle'],['Sun 9 Nov',pR,'end']].forEach(function(a){s+='<text x="'+a[1]+'" y="'+(pB+19)+'" text-anchor="'+a[2]+'" font-size="12" font-weight="700" fill="'+MU+'">'+a[0]+'</text>';});
    return s+'</svg>';
  }
  function info(state,animate){
    var st=S[state]||S.above;
    return '<div class="fapw-chips'+(animate?' fapw-go':'')+'"><span class="fapw-chip">Final check '+st.fin+'</span><span class="fapw-chip '+st.cls+'">'+esc(st.chip)+'</span></div><div class="fapw-note">'+esc(st.note)+'</div>';
  }
  function chart(el,state,animate){
    var last=0;
    function draw(anim){var W=Math.round(Math.max(280,Math.min(620,el.clientWidth||520)));last=W;el.innerHTML=svg(state,W,anim);}
    draw(animate);
    if(window.ResizeObserver){new ResizeObserver(function(){var W=Math.round(Math.max(280,Math.min(620,el.clientWidth||520)));if(Math.abs(W-last)>8)draw(false);}).observe(el);}
  }
  window.FAPWChart={chart:chart,info:info,svg:svg,states:S};
})();
