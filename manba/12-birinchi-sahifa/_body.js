window.CFG=__CFG__;
const CFG=window.CFG,sc=CFG.sc;const ICONS=__ICONS__;
const clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>{x=clamp(x);return 1-Math.pow(1-x,3)},eio=x=>{x=clamp(x);return x*x*(3-2*x)};
const back=x=>{x=clamp(x);const c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const $=id=>document.getElementById(id);
const order=['hook','sorov','kod','ochish','ozgar','cta'];
const sceneAt=tt=>{for(const k of order){if(tt<sc[k][0]+sc[k][1])return k}return 'cta'};
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const INK='#0B1020',MUT='#667085',LINE='#E6E8F0',IND='#4F46E5',PUR='#A855F7',ORA='#FF6A3D',GRN='#12B76A',RED='#F04438',YEL='#FDB022';
const ico=(n,px,col)=>'<span class="ic" style="width:'+px+'px;height:'+px+'px;color:'+(col||INK)+'">'+ICONS[n]+'</span>';
const fxF=$('fxF').getContext('2d');const CONF=[IND,PUR,ORA,GRN,YEL,RED];
function bursts(tt){fxF.clearRect(0,0,1080,1920);
 CFG.bur.forEach((b,bi)=>{const age=tt-b.t;if(age<0||age>3.2)return;
  if(!b.conf){if(age>1.0)return;for(let i=0;i<b.n;i++){const ang=rnd(bi*50+i)*6.283,sp=260+rnd(bi*50+i+7)*420,r=(1-age)*7+2;fxF.fillStyle=CONF[i%CONF.length];fxF.globalAlpha=1-age;fxF.beginPath();fxF.arc(b.x+Math.cos(ang)*sp*age,b.y+Math.sin(ang)*sp*age+200*age*age,r,0,7);fxF.fill()}fxF.globalAlpha=1}})}
const HEAD={hook:'',
 sorov:'<span class="chip"><span class="n">1</span>So‘rov</span><div class="ttl">Aniq <em>so‘rov</em> yozamiz</div>',
 kod:'<span class="chip"><span class="n">2</span>Kod</span><div class="ttl">Claude <em>kod yozdi</em></div>',
 ochish:'<span class="chip"><span class="n">3</span>Saqlash</span><div class="ttl">Saqlang va <em>oching</em></div>',
 ozgar:'<span class="chip"><span class="n">4</span>O‘zgartirish</span><div class="ttl">Yoqmasa — <em>so‘rang</em></div>',
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
// ---- brauzer maketi + HAQIQIY sahifa (iframe)
const frames=[];
function browser(top,bodyH,srcdoc,url){
 const card=el('cd','<div style="height:70px;background:#F4F5FA;border-bottom:1.5px solid '+LINE+';display:flex;align-items:center;gap:10px;padding:0 24px"><i style="width:15px;height:15px;border-radius:50%;background:#FF6B6B"></i><i style="width:15px;height:15px;border-radius:50%;background:#FFD166"></i><i style="width:15px;height:15px;border-radius:50%;background:#5AD9B4"></i><span class="mono" style="margin-left:20px;flex:1;background:#fff;border:1.5px solid '+LINE+';border-radius:22px;height:42px;line-height:40px;padding:0 20px;font-size:25px;color:'+MUT+'">'+url+'</span></div><div class="bb" style="position:relative;height:'+bodyH+'px;overflow:hidden;background:#fff;border-radius:0 0 30px 30px"></div>',{left:'72px',top:top+'px',width:'936px',height:(70+bodyH)+'px'});
 const body=card.querySelector('.bb');const f=document.createElement('iframe');f.setAttribute('scrolling','no');f.style.cssText='border:0;width:936px;height:'+bodyH+'px;position:absolute;left:0;top:0;background:#fff';f.srcdoc=srcdoc;body.appendChild(f);frames.push(f);
 return {card,body,f};
}
function setClick(fr,on){const d=fr.contentDocument,b=d&&d.getElementById('b');if(!b)return;if(on){if(b.textContent!=='Rahmat!')b.click()}else b.textContent='Bosing'}
function btnPos(br){const r=br.f.contentDocument.getElementById('b').getBoundingClientRect();return {x:72+r.left+r.width/2,y:parseFloat(br.card.style.top)+70+r.top+r.height/2}}
// ---- HOOK
const hLab=el('','<span style="display:inline-block;width:56px;height:3px;background:'+IND+';vertical-align:middle;margin-right:16px"></span><span style="vertical-align:middle;font-size:30px;font-weight:800;letter-spacing:.2em;color:'+MUT+'">KELISHGANIMIZDEK</span>',{left:'72px',top:'150px'});
const hA=kl('Bugun Claude bilan',205,92,'',INK),hB=kl('Birinchi',305,200,'grad'),hB2=kl('sahifa',525,200,'grad'),hC=kl('yasashni o‘rganamiz',765,78,'',INK);
const brH=browser(900,440,CFG.p1,'sahifa.html');
const blank=el('','<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;color:#98A2B3">'+ico('file-code',90,'#C5CAD8')+'<div style="font-size:40px;font-weight:700">Hali hech narsa yo‘q</div></div>',{left:'0',top:'0',width:'936px',height:'440px',background:'#fff',zIndex:'5'});
brH.body.appendChild(blank);blank.style.position='absolute';
const divl=el('','',{left:'0',top:'0',width:'6px',height:'440px',background:'linear-gradient(180deg,'+IND+','+PUR+')',zIndex:'6'});brH.body.appendChild(divl);
const chOld=el('','<span class="pill" style="font-size:28px;padding:8px 22px;color:'+MUT+'">OLDIN</span>',{left:'24px',top:'20px',zIndex:'7'});brH.body.appendChild(chOld);
const chNew=el('','<span class="pill" style="font-size:28px;padding:8px 22px;background:'+GRN+';color:#fff;border-color:transparent">KEYIN</span>',{left:'24px',top:'20px',zIndex:'7'});brH.body.appendChild(chNew);
// ---- SO'ROV
const chat=el('cd','<div style="padding:26px 34px 6px;display:flex;align-items:center;gap:16px">'+tile('sparkles',PUR,64)+'<span style="font-size:30px;font-weight:800;letter-spacing:.1em;color:'+MUT+'">CLAUDE GA YOZAMIZ</span></div><div id="chT" style="margin:10px 34px 28px;background:'+IND+';color:#fff;border-radius:28px 28px 28px 8px;padding:24px 30px;font-size:42px;line-height:1.3;font-weight:600;min-height:190px"></div>',{left:'72px',top:'450px',width:'936px'});
const chT=chat.querySelector('#chT');const PROMPT='Menga bitta sahifa yoz: sarlavha, bitta matn va bitta tugma. Faqat HTML, bitta fayl.';
const INFO=[['layout-template','Nima kerak','sarlavha, matn, tugma',IND],['file-text','Nechta qism','3 ta qism',ORA],['file-code','Qaysi format','faqat HTML, bitta fayl',GRN]];
const infoEls=INFO.map((f,i)=>el('cd','<div style="display:flex;align-items:center;gap:24px;padding:0 32px;height:120px">'+tile(f[0],f[3],76)+'<div><div style="font-size:26px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:'+f[3]+'">'+f[1]+'</div><div style="font-size:40px;font-weight:800;letter-spacing:-.02em">'+f[2]+'</div></div></div>',{left:'72px',top:(850+i*140)+'px',width:'936px',height:'120px'}));
const bannerS=el('','<div style="background:linear-gradient(90deg,'+IND+','+PUR+');color:#fff;border-radius:32px;padding:24px 34px;display:flex;align-items:center;gap:18px;box-shadow:0 18px 44px rgba(79,70,229,.35)"><div style="font-size:42px;font-weight:800;letter-spacing:-.02em">Aniq so‘rov = yaxshi natija</div><div style="margin-left:auto">'+ico('check',56,'#fff')+'</div></div>',{left:'72px',width:'936px',top:'1290px'});
// ---- KOD
const KL=CFG.p1.split('\n');
function hl(s){let e=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 if(e.indexOf('&lt;')>=0)return e.replace(/(&lt;\/?[A-Za-z!][^]*?&gt;)/g,'<span style="color:#7DD3FC">$1</span>');
 if(e.indexOf('{')>=0)return e.replace(/([a-z-]+):/g,'<span style="color:#7FE0C3">$1</span>:');
 return e.replace(/("[^"]*")|(=&gt;)/g,(m,s,ar)=>s?'<span style="color:#FFD166">'+s+'</span>':'<span style="color:#C4A5FF">'+ar+'</span>')}
const codeCard=el('term','<div class="bar"><i style="background:#FF6B6B"></i><i style="background:#FFD166"></i><i style="background:#5AD9B4"></i><span style="margin-left:auto;font-size:24px;font-weight:700;color:#8892B8;letter-spacing:.08em">index.html · TEZLASHTIRILGAN</span></div><div id="cl" class="mono" style="padding:14px 30px 16px;font-size:28px;font-weight:500;color:#C7CCE6;white-space:pre"></div>',{left:'72px',top:'440px',width:'936px',boxShadow:'0 18px 44px rgba(16,24,40,.18)'});
const cl=codeCard.querySelector('#cl');const lineEls=KL.map(t=>{const d=document.createElement('div');d.style.cssText='height:40px;line-height:40px;border-radius:8px;padding:0 10px;margin:0 -10px;';d.innerHTML=hl(t)||'&nbsp;';cl.appendChild(d);return d});
const HLR=[[10,IND,'Sarlavha','h1'],[11,ORA,'Matn','p'],[12,GRN,'Tugma','button']];
const kPills=HLR.map((h,i)=>el('','<span class="pill mono" style="color:'+h[1]+';border-color:'+h[1]+'66;font-size:32px">'+h[3]+'<span style="font-family:Inter;color:'+INK+'"> = '+h[2]+'</span></span>',{left:(72+i*300)+'px',top:'1255px'}));
const ask=el('','<div style="display:inline-block;background:'+IND+';color:#fff;border-radius:28px 28px 8px 28px;padding:16px 28px;font-size:36px;font-weight:600">Bu qator nima qiladi? 🤔</div>',{left:'72px',width:'936px',top:'1350px',textAlign:'right'});
// ---- OCHISH
const fileC=el('cd','<div style="display:flex;align-items:center;gap:24px;padding:0 34px;height:130px">'+tile('file-code',IND,80)+'<div class="mono" style="font-size:46px;font-weight:700">index.html</div><span style="margin-left:auto;color:'+GRN+';background:'+GRN+'1A;font-weight:800;font-size:28px;padding:10px 22px;border-radius:30px;display:flex;align-items:center;gap:10px">'+ico('save',32,GRN)+'Saqlandi</span></div>',{left:'72px',top:'440px',width:'936px',height:'130px'});
const arrD=el('','<div style="display:flex;justify-content:center">'+ico('arrow-down',70,IND)+'</div>',{left:'72px',width:'936px',top:'585px'});
const brO=browser(690,560,CFG.p1,'index.html');
const cursor=el('','<svg width="64" height="64" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10.5 19z" fill="#0B1020" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',{left:'0',top:'0',zIndex:'40'});
const ripple=el('','',{left:'0',top:'0',width:'90px',height:'90px',borderRadius:'50%',border:'6px solid '+IND,zIndex:'39'});
// ---- O'ZGARTIRISH
const ask2=el('','<div style="display:inline-block;background:'+IND+';color:#fff;border-radius:28px 28px 8px 28px;padding:20px 34px;font-size:46px;font-weight:700" id="a2t"></div>',{left:'72px',width:'936px',top:'440px',textAlign:'right'});
const a2t=ask2.querySelector('#a2t');
const diff=el('term','<div style="padding:16px 28px" class="mono"><div style="font-size:28px;line-height:42px;font-weight:500;white-space:pre"><div style="background:#F044381F;color:#FF9C94;border-radius:6px;padding:0 10px;margin:0 -10px">- button{font-size:28px;padding:12px 28px}</div><div style="background:#12B76A22;color:#7FE0A8;border-radius:6px;padding:0 10px;margin:0 -10px">+ button{font-size:28px;padding:12px 28px;</div><div style="background:#12B76A22;color:#7FE0A8;border-radius:6px;padding:0 10px;margin:0 -10px">+   background:#12B76A;color:#fff;border:0;</div><div style="background:#12B76A22;color:#7FE0A8;border-radius:6px;padding:0 10px;margin:0 -10px">+   border-radius:12px}</div></div></div>',{left:'72px',top:'580px',width:'936px',boxShadow:'0 18px 44px rgba(16,24,40,.18)'});
const brOld=browser(810,500,CFG.p1,'index.html');
const brNew=browser(810,500,CFG.p2,'index.html');
// ---- CTA
const cL=el('','XULOSA',{left:'72px',top:'140px',fontSize:'30px',fontWeight:800,letterSpacing:'.2em',color:MUT});
const cT=kl('Birinchi sahifa <span class="grad">tayyor</span>',200,84,'',INK);
const STEPS=[['message-square','Aniq so‘rov yozing',IND],['eye','Kodni o‘qing',ORA],['save','Faylga saqlang',GRN]];
const stepEls=STEPS.map((s,i)=>el('cd','<div style="display:flex;align-items:center;gap:24px;padding:0 32px;height:118px">'+tile(s[0],s[2],76)+'<div style="font-size:42px;font-weight:800;letter-spacing:-.02em">'+(i+1)+'. '+s[1]+'</div><span style="margin-left:auto">'+ico('check',46,GRN)+'</span></div>',{left:'72px',top:(340+i*136)+'px',width:'936px',height:'118px'}));
const sv=el('','<span class="pill" style="font-size:36px">'+ico('bookmark',38,IND)+'Saqlang</span> <span class="pill" style="font-size:36px;margin-left:14px">'+ico('send',38,ORA)+'Yuboring</span>',{left:'72px',top:'790px'});
const tz=el('','<div style="background:linear-gradient(90deg,'+IND+','+PUR+');color:#fff;border-radius:32px;padding:26px 34px;display:flex;align-items:center;gap:18px;box-shadow:0 18px 44px rgba(79,70,229,.35)"><div>'+ico('smartphone',64,'#fff')+'</div><div><div style="font-size:24px;font-weight:800;letter-spacing:.14em;opacity:.8">KEYINGI VIDEO</div><div style="font-size:40px;font-weight:800;letter-spacing:-.02em;line-height:1.15">Telefonga moslashuvchan sahifa</div></div><div style="margin-left:auto">'+ico('arrow-right',56,'#fff')+'</div></div>',{left:'72px',top:'930px',width:'936px'});
const q=el('cd','<div style="padding:24px 34px;display:flex;align-items:center;gap:20px">'+tile('message-square',ORA,76)+'<div style="font-size:38px;font-weight:800;letter-spacing:-.02em;line-height:1.2">Sizningcha, nima kerak?<br><span style="color:'+MUT+';font-weight:700">Izohda yozing 👇</span></div></div>',{left:'72px',top:'1130px',width:'936px'});
const ALL=[hLab,hA,hB,hB2,hC,brH.card,chat,...infoEls,bannerS,codeCard,...kPills,ask,fileC,arrD,brO.card,cursor,ripple,ask2,diff,brOld.card,brNew.card,cL,cT,...stepEls,sv,tz,q];
let lastNewF=0;
window.setT=async function(tt){
 const k=sceneAt(tt),t0=sc[k][0],D=sc[k][1],lt=tt-t0,P=CFG.parts[k],St=P.starts,En=P.ends;
 if(k!==lastHead){$('head').innerHTML=HEAD[k];lastHead=k}
 $('head').style.opacity=k==='hook'||k==='cta'?0:1;$('head').style.transform='translateY('+((1-ease(lt/0.4))*-24)+'px)';
 $('world').style.transform='scale('+(1+0.03*clamp(lt/D))+')';
 $('pfill').style.width=(100*clamp(tt/CFG.total))+'%';
 ALL.forEach(d=>d.style.display='none');
 if(k==='hook'){const S1=St[1];
  setClickAll(false);
  fade(hLab,1);setKl(hA,1);setKl(hB,1);setKl(hB2,1);setKl(hC,1);
  const z=1+0.04*(1-ease(lt/0.35));[hA,hB,hB2,hC].forEach(w=>{w._i.style.transform='scale('+z+')';w._i.style.transformOrigin='0 50%'});
  brH.card.style.display='block';brH.card.style.opacity=1;brH.card.style.transform='translateY('+(5*Math.sin(tt*2))+'px)';
  const p=eio((lt-S1-0.1)/1.1);blank.style.clipPath='inset(0 0 0 '+(p*100)+'%)';
  divl.style.left=(p*936)+'px';divl.style.display=(p>0&&p<1)?'block':'none';
  chOld.style.display=p<0.5?'block':'none';chNew.style.display=p>=0.5?'block':'none';chNew.style.opacity=clamp((p-0.5)*4);
 }
 if(k==='sorov'){const P0=En[0];
  app(chat,(lt-0.1)/0.5);const n=Math.floor(clamp((lt-0.4)/(P0*0.5))*PROMPT.length);chT.textContent=PROMPT.slice(0,n)+(n<PROMPT.length&&lt>0.4?'▌':'');
  [0.50,0.68,0.86].forEach((f,i)=>app(infoEls[i],(lt-P0*f)/0.45,26));
  app(bannerS,(lt-St[1]-0.3)/0.5,24)}
 if(k==='kod'){const n=Math.floor(clamp((lt-0.15)/(St[1]-0.5))*KL.length);
  fade(codeCard,clamp((lt+0.1)/0.3));codeCard.style.transform='scale('+(0.97+0.03*ease(lt/0.4))+')';
  lineEls.forEach((d,i)=>{d.style.opacity=i<n?1:0;d.style.background='transparent';d.style.boxShadow='none'});
  const u1=lt-St[1],len=St[2]-St[1];
  if(lt>=St[1]){const cur=Math.min(2,Math.floor(clamp(u1/len)*3));
   if(lt<St[2])HLR.forEach((h,i)=>{if(i<=cur){const d=lineEls[h[0]];d.style.background=h[1]+(i===cur?'30':'16');d.style.boxShadow='inset 6px 0 0 '+h[1]}});
   kPills.forEach((p,i)=>app(p,(u1-(i/3)*len-0.05)/0.35,16))}
  if(lt>=St[2])app(ask,(lt-St[2]-0.2)/0.4,16)}
 if(k==='ochish'){const S1=St[1];
  app(fileC,(lt-0.05)/0.45);fade(arrD,clamp((lt-0.4)/0.3));arrD.style.transform='translateY('+(6*Math.sin(tt*5))+'px)';
  app(brO.card,(lt-0.5)/0.5);
  const clk=S1+1.9;const bp=btnPos(brO);
  const cx=bp.x,cy=bp.y;const mu=eio((lt-(S1+0.9))/0.8);
  setClick(brO.f,lt>=clk);
  if(lt>=S1+0.8){cursor.style.display='block';cursor.style.left=(cx+250*(1-mu)-6)+'px';cursor.style.top=(cy+170*(1-mu)-6)+'px';cursor.style.transform='scale('+(lt>=clk&&lt<clk+0.12?0.85:1)+')'}
  if(lt>=clk&&lt<clk+0.7){const r=(lt-clk)/0.7;ripple.style.display='block';ripple.style.left=(cx-45)+'px';ripple.style.top=(cy-45)+'px';ripple.style.opacity=1-r;ripple.style.transform='scale('+(0.4+1.4*ease(r))+')'}}
 if(k==='ozgar'){
  const s1='Tugmani yashil qil.';ask2.style.display='block';const n=Math.floor(clamp((lt-0.15)/0.8)*s1.length);a2t.textContent=s1.slice(0,n)+(n<s1.length?'▌':'');ask2.style.opacity=clamp((lt+0.05)*6);
  app(diff,(lt-1.0)/0.5,22);
  const G=2.0;app(brOld.card,(lt-1.4)/0.5);setClick(brOld.f,false);setClick(brNew.f,false);
  if(lt>=G){brNew.card.style.display='block';brNew.card.style.opacity=clamp((lt-G)/0.2);brNew.card.style.top='810px';brNew.card.style.transform='scale(1)';brOld.card.style.display='block'}
  brNew.card.style.zIndex=lt>=G?'12':'0';if(lt>=G)brNew.card.style.boxShadow='0 0 0 '+(8*(1-clamp((lt-G)/0.6)))+'px '+GRN+'55,0 18px 44px rgba(16,24,40,.09)'}
 if(k==='cta'){fade(cL,clamp(lt*4));setKl(cT,lt/0.4);const P0=En[0];
  [0.25,0.5,0.75].forEach((f,i)=>app(stepEls[i],(lt-P0*f)/0.4,22));
  app(sv,(lt-St[1]-0.05)/0.4,18);app(tz,(lt-St[2]-0.1)/0.5,24);app(q,(lt-St[2]-0.9)/0.5,24)}
 bursts(tt);
 const c=capAt(tt);$('cap').firstElementChild.textContent=c.t;$('cap').firstElementChild.style.fontSize=c.t.length>56?'42px':'';
};
function setClickAll(on){frames.forEach(f=>{try{setClick(f,on)}catch(e){}})}
(async()=>{try{await Promise.all(['800 40px Inter','700 30px Inter','500 30px Inter','700 30px "JetBrains Mono"','500 30px "JetBrains Mono"'].map(f=>document.fonts.load(f,'Aa‘ʻ')))}catch(e){}await document.fonts.ready;
 await Promise.all(frames.map(f=>new Promise(r=>{if(f.contentDocument&&f.contentDocument.readyState==='complete'&&f.contentDocument.getElementById('b'))r();else f.addEventListener('load',()=>r())})));
 await window.setT(0);window.glReady=true})();
