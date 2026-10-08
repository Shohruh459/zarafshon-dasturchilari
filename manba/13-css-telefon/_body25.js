window.CFG=__CFG__;
const CFG=window.CFG,sc=CFG.sc;const ICONS=__ICONS__;
const clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>{x=clamp(x);return 1-Math.pow(1-x,3)},eio=x=>{x=clamp(x);return x*x*(3-2*x)};
const back=x=>{x=clamp(x);const c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const $=id=>document.getElementById(id);
const order=['hook','muammo','q1','q2','q3','cta'];
const sceneAt=tt=>{for(const k of order){if(tt<sc[k][0]+sc[k][1])return k}return 'cta'};
const INK='#0B1020',MUT='#667085',LINE='#E6E8F0',IND='#4F46E5',PUR='#A855F7',ORA='#FF6A3D',GRN='#12B76A',RED='#F04438',YEL='#FDB022';
const ico=(n,px,col)=>'<span class="ic" style="width:'+px+'px;height:'+px+'px;color:'+(col||INK)+'">'+ICONS[n]+'</span>';
const HEAD={hook:'',
 muammo:'<span class="chip r"><span class="n">!</span>Muammo</span><div class="ttl">Telefonda sahifa <em class="r">mayda</em></div>',
 q1:'<span class="chip"><span class="n">1</span>Viewport</span><div class="ttl">Bitta <em>qator</em></div>',
 q2:'<span class="chip"><span class="n">2</span>max-width</span><div class="ttl">Rasm ekrandan <em>chiqmasin</em></div>',
 q3:'<span class="chip"><span class="n">3</span>@media</span><div class="ttl">Tor ekranga <em>boshqa qoida</em></div>',
 cta:''};
let lastHead='';
const S=$('sc');
function el(cls,html,css){const d=document.createElement('div');d.className='a '+cls;d.innerHTML=html||'';Object.assign(d.style,css||{});S.appendChild(d);return d}
function kl(txt,top,size,cls,col){const w=document.createElement('div');w.className='a kl';w.style.top=top+'px';w.style.height=(size*1.14)+'px';const i=document.createElement('div');i.style.fontSize=size+'px';if(cls)i.className=cls;if(col)i.style.color=col;i.innerHTML=txt;w.appendChild(i);S.appendChild(w);w._i=i;return w}
function setKl(w,u){w.style.display=u>0?'block':'none';w._i.style.transform='translateY('+((1-ease(u))*108)+'%)'}
function app(d,u,y){y=y===undefined?36:y;d.style.display=u>0?'block':'none';if(u<=0)return;const e=back(u);d.style.opacity=clamp(u*4);d.style.transform='translateY('+((1-e)*y)+'px) scale('+(0.94+0.06*e)+')'}
function fade(d,u){d.style.display=u>0?'block':'none';if(u>0)d.style.opacity=clamp(u)}
const tile=(n,col,sz)=>'<div class="tile" style="width:'+sz+'px;height:'+sz+'px;background:'+col+'1A;flex:none">'+ico(n,sz*0.52,col)+'</div>';
const capAt=tt=>{for(const c of CFG.caps){if(tt>=c.s&&tt<c.e)return c}return CFG.caps[CFG.caps.length-1]};
// telefon maketi: ichida HAQIQIY mobil emulyatsiya skrinshoti
function phone(left,top,w,h,src,tag,tagCol,tagTxt){
 const d=el('','<div style="position:absolute;inset:0;border:10px solid #0B1020;border-radius:58px;overflow:hidden;background:#fff"><img src="'+src+'" style="width:100%;display:block"></div><div style="position:absolute;left:50%;top:14px;width:90px;height:22px;margin-left:-45px;border-radius:12px;background:#0B1020"></div>'+(tagTxt?'<div style="position:absolute;left:18px;right:18px;bottom:22px;text-align:center"><span class="pill" style="font-size:26px;padding:8px 18px;color:'+tagCol+';border-color:'+tagCol+'66;background:#fff">'+tagTxt+'</span></div>':''),{left:left+'px',top:top+'px',width:w+'px',height:h+'px',boxShadow:'0 22px 50px rgba(16,24,40,.22)',borderRadius:'58px'});
 return d}
const pillTag=(txt,col,left,top)=>el('','<span class="pill" style="font-size:30px;padding:8px 24px;font-weight:800;letter-spacing:.08em;color:'+col+';border-color:'+col+'66">'+txt+'</span>',{left:left+'px',top:top+'px'});
// ---- HOOK
const hLab=el('','<span style="display:inline-block;width:56px;height:3px;background:'+IND+';vertical-align:middle;margin-right:16px"></span><span style="vertical-align:middle;font-size:30px;font-weight:800;letter-spacing:.2em;color:'+MUT+'">KELISHGANIMIZDEK</span>',{left:'72px',top:'150px'});
const hA=kl('Bugun sahifani',205,92,'',INK),hB=kl('telefonga',305,170,'grad'),hC=kl('moslashni o‘rganamiz',505,78,'',INK);
const hOld=pillTag('OLDIN',RED,72,628),hNew=pillTag('KEYIN',GRN,578,628);
const hP1=phone(72,700,430,740,'m0.png'),hP2=phone(578,700,430,740,'m3.png');
const hArr=el('','<div style="display:flex;justify-content:center">'+ico('arrow-right',64,IND)+'</div>',{left:'495px',top:'1010px',width:'90px',zIndex:'30'});
// ---- MUAMMO
const mChK=pillTag('KOMPYUTER',MUT,72,520),mChT=pillTag('TELEFON',MUT,712,520);
const mMon=el('cd','<div style="height:50px;background:#F4F5FA;border-bottom:1.5px solid '+LINE+';display:flex;align-items:center;gap:8px;padding:0 18px"><i style="width:12px;height:12px;border-radius:50%;background:#FF6B6B"></i><i style="width:12px;height:12px;border-radius:50%;background:#FFD166"></i><i style="width:12px;height:12px;border-radius:50%;background:#5AD9B4"></i></div><img src="d0.png" style="width:100%;display:block;border-radius:0 0 30px 30px">',{left:'72px',top:'600px',width:'560px',overflow:'hidden'});
const mArr=el('','<div style="display:flex;justify-content:center">'+ico('arrow-right',56,IND)+'</div>',{left:'628px',top:'830px',width:'80px'});
const mPh=phone(712,590,296,600,'m0.png');
const mOk=el('','<span class="pill" style="font-size:32px;color:'+GRN+';border-color:'+GRN+'66">'+ico('check',34,GRN)+'Hammasi sig‘adi</span>',{left:'72px',top:'1010px'});
const mBad=el('','<span class="pill" style="font-size:32px;color:'+RED+';border-color:'+RED+'66">'+ico('x',34,RED)+'Mayda, o‘qib bo‘lmaydi</span>',{left:'420px',top:'1230px'});
// ---- QADAMLAR (q1,q2,q3)
function hlcode(s){let e=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 if(e.indexOf('&lt;')>=0)return e.replace(/(&lt;\/?[A-Za-z!][^]*?&gt;)/g,'<span style="color:#7DD3FC">$1</span>');
 if(e.indexOf('@media')>=0)return e.replace(/(@media)/,'<span style="color:#C4A5FF">$1</span>');
 return e.replace(/([a-z-]+):/g,'<span style="color:#7FE0C3">$1</span>:')}
function codeCard(top,lines,hlIdx,col,label){
 const c=el('term','<div class="bar"><i style="background:#FF6B6B"></i><i style="background:#FFD166"></i><i style="background:#5AD9B4"></i><span style="margin-left:auto;font-size:24px;font-weight:700;color:#8892B8;letter-spacing:.08em">'+label+'</span></div><div class="cl mono" style="padding:12px 30px 14px;font-size:27px;font-weight:500;color:#C7CCE6;white-space:pre"></div>',{left:'72px',top:top+'px',width:'936px',boxShadow:'0 18px 44px rgba(16,24,40,.18)'});
 const cl=c.querySelector('.cl');const els=lines.map(t=>{const d=document.createElement('div');d.style.cssText='height:40px;line-height:40px;border-radius:8px;padding:0 10px;margin:0 -10px;';d.innerHTML=hlcode(t);cl.appendChild(d);return d});
 return {c,els,hl:hlIdx,col:col}}
const Q1=codeCard(440,CFG.v,[0,1,2],IND,'index.html · kodning bir qismi');
const Q2=codeCard(440,CFG.pn,[2],GRN,'index.html · kodning bir qismi');
const Q3=codeCard(440,CFG.md,[0,1,2],ORA,'index.html · kodning bir qismi');
function qScene(Q,d,u){ // u: vaqt
}
const qP=[ // [oldin rasm, keyin rasm, oldin tag, keyin tag, top, h, chipsTop]
 ['m0.png','m1.png',['Mayda',RED],['Matn normal ✓',GRN],700,740],
 ['m1.png','m2.png',['Rasm kesilgan','#DC6803'],['Rasm sig‘di ✓',GRN],790,650],
 ['m2.png','m3.png',['Kartalar tor','#DC6803'],['Tagma-tag ✓',GRN],700,740]];
const qPh=qP.map((p,i)=>{const top=i===1?840:740,h=i===1?600:700;return {old:phone(72,top,430,h,p[0],0,p[2][1],p[2][0]),nw:phone(578,top,430,h,p[1],0,p[3][1],p[3][0]),chO:pillTag('OLDIN',RED,72,top-72),chN:pillTag('KEYIN',GRN,578,top-72),arr:el('','<div style="display:flex;justify-content:center">'+ico('arrow-right',64,IND)+'</div>',{left:'495px',top:(top+h/2-32)+'px',width:'90px',zIndex:'30'})}});
// ---- CTA
const cL=el('','XULOSA',{left:'72px',top:'140px',fontSize:'30px',fontWeight:800,letterSpacing:'.2em',color:MUT});
const cT=kl('3 qadam: <span class="grad">tayyor</span>',200,92,'',INK);
const STEPS=[['smartphone','viewport','ekran kengligiga moslashadi',IND],['expand','max-width','rasm ekrandan chiqmaydi',ORA],['columns-3','@media','tor ekranda boshqa qoida',GRN]];
const stepEls=STEPS.map((s,i)=>el('cd','<div style="display:flex;align-items:center;gap:24px;padding:0 32px;height:122px">'+tile(s[0],s[3],76)+'<div><div class="mono" style="font-size:38px;font-weight:700;color:'+s[3]+'">'+s[1]+'</div><div style="font-size:30px;font-weight:600;color:'+MUT+'">'+s[2]+'</div></div><span style="margin-left:auto">'+ico('check',46,GRN)+'</span></div>',{left:'72px',top:(330+i*140)+'px',width:'936px',height:'122px'}));
const sv=el('','<span class="pill" style="font-size:36px">'+ico('bookmark',38,IND)+'Saqlang</span> <span class="pill" style="font-size:36px;margin-left:14px">'+ico('send',38,ORA)+'Yuboring</span>',{left:'72px',top:'770px'});
const prompt=el('cd','<div style="padding:24px 34px"><div style="font-size:26px;font-weight:800;letter-spacing:.12em;color:'+IND+';margin-bottom:10px">PROMPT · IZOHDAN NUSXA OLING</div><div class="mono" style="font-size:31px;line-height:1.35;font-weight:500">Sahifamni telefonga moslashtir: viewport, max-width va media qo‘sh.</div></div>',{left:'72px',top:'880px',width:'936px'});
const tz=el('','<div style="background:linear-gradient(90deg,'+IND+','+PUR+');color:#fff;border-radius:32px;padding:26px 34px;display:flex;align-items:center;gap:18px;box-shadow:0 18px 44px rgba(79,70,229,.35)"><div><div style="font-size:24px;font-weight:800;letter-spacing:.14em;opacity:.8">KEYINGI VIDEO</div><div style="font-size:40px;font-weight:800;letter-spacing:-.02em;line-height:1.15">JavaScript: tugma bosilganda nima bo‘ladi?</div></div><div style="margin-left:auto">'+ico('arrow-right',56,'#fff')+'</div></div>',{left:'72px',top:'1100px',width:'936px'});
const QC=[Q1,Q2,Q3];
const ALL=[hLab,hA,hB,hC,hOld,hNew,hP1,hP2,hArr,mChK,mChT,mMon,mArr,mPh,mOk,mBad,Q1.c,Q2.c,Q3.c,...qPh.flatMap(o=>[o.old,o.nw,o.chO,o.chN,o.arr]),cL,cT,...stepEls,sv,prompt,tz];
window.setT=async function(tt){
 const k=sceneAt(tt),t0=sc[k][0],D=sc[k][1],lt=tt-t0,P=CFG.parts[k],St=P.starts,En=P.ends;
 if(k!==lastHead){$('head').innerHTML=HEAD[k];lastHead=k}
 $('head').style.opacity=k==='hook'||k==='cta'?0:1;$('head').style.transform='translateY('+((1-ease(lt/0.4))*-24)+'px)';
 $('world').style.transform='scale('+(1+0.03*clamp(lt/D))+')';
 $('pfill').style.width=(100*clamp(tt/CFG.total))+'%';
 ALL.forEach(d=>d.style.display='none');
 if(k==='hook'){fade(hLab,1);setKl(hA,1);setKl(hB,1);setKl(hC,1);
  const z=1+0.04*(1-ease(lt/0.35));[hA,hB,hC].forEach(w=>{w._i.style.transform='scale('+z+')';w._i.style.transformOrigin='0 50%'});
  app(hP1,(lt-0.15)/0.5,40);app(hOld,(lt-0.3)/0.4,14);app(hP2,(lt-0.8)/0.5,40);app(hNew,(lt-0.95)/0.4,14);fade(hArr,clamp((lt-0.9)/0.3));hArr.style.transform='translateX('+(6*Math.sin(tt*5))+'px)'}
 if(k==='muammo'){app(mChK,(lt-0.1)/0.4,14);app(mMon,(lt-0.15)/0.5);app(mOk,(lt-0.7)/0.4,14);fade(mArr,clamp((lt-St[1]+0.6)/0.4));mArr.style.transform='translateX('+(6*Math.sin(tt*5))+'px)';
  app(mChT,(lt-St[1]+0.6)/0.4,14);app(mPh,(lt-St[1]+0.5)/0.5);app(mBad,(lt-St[1]-0.9)/0.4,14)}
 if(k==='q1'||k==='q2'||k==='q3'){const qi=k==='q1'?0:k==='q2'?1:2,Q=QC[qi],o=qPh[qi];
  fade(Q.c,clamp((lt+0.1)/0.3));Q.c.style.transform='scale('+(0.97+0.03*ease(lt/0.4))+')';
  const n=Math.floor(clamp((lt-0.1)/Math.max(0.5,En[0]*0.75))*Q.els.length+0.001);
  Q.els.forEach((d,i)=>{d.style.opacity=i<n?1:0;const on=lt>=St[1]&&Q.hl.includes(i);d.style.background=on?Q.col+'30':'transparent';d.style.boxShadow=on?'inset 6px 0 0 '+Q.col:'none'});
  app(o.old,(lt-0.2)/0.5,40);app(o.chO,(lt-0.3)/0.4,14);
  app(o.nw,(lt-St[1]+0.1)/0.5,40);app(o.chN,(lt-St[1])/0.4,14);fade(o.arr,clamp((lt-St[1])/0.3));o.arr.style.transform='translateX('+(6*Math.sin(tt*5))+'px)'}
 if(k==='cta'){fade(cL,clamp(lt*4));setKl(cT,lt/0.4);const P0=En[0];
  [0.2,0.45,0.7].forEach((f,i)=>app(stepEls[i],(lt-P0*f)/0.4,22));
  app(sv,(lt-St[1]-0.05)/0.4,18);app(prompt,(lt-St[1]-0.3)/0.5,24);app(tz,(lt-St[2]-0.1)/0.5,24)}
 const c=capAt(tt);$('cap').firstElementChild.textContent=c.t;$('cap').firstElementChild.style.fontSize=c.t.length>56?'42px':'';
};
(async()=>{try{await Promise.all(['800 40px Inter','700 30px Inter','500 30px Inter','700 30px "JetBrains Mono"','500 30px "JetBrains Mono"'].map(f=>document.fonts.load(f,'Aa‘ʻ')))}catch(e){}await document.fonts.ready;await Promise.all([...document.querySelectorAll('#sc img')].map(i=>i.decode?i.decode().catch(()=>{}):0));await window.setT(0);window.glReady=true})();
