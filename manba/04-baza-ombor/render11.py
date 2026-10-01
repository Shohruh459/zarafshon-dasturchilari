import sys, re, json, subprocess, wave, time, os
import numpy as np
sys.path.insert(0,'.')
from script11 import SC
FPS=30; SR=44100
TM=json.load(open('timing.json'))
def disp(t): return re.sub(r"(?<=[oOgGmM])'","‘",t).replace("'","’")
sc={};parts={};t=0
EXTRA={'hook':0.3,'jadval':0.2,'amal':0.3,'nega':0.3,'cta':0.5}
MINDUR={'cta':5.2}
for s in SC:
    k=s['id']; d=TM[k]['dur']+EXTRA[k]; d=max(d,MINDUR.get(k,0)); sc[k]=[round(t,3),round(d,3)]; parts[k]=dict(starts=TM[k]['starts'],ends=TM[k]['ends']); t+=d
TOTAL=t
caps=[]
for s in SC:
    k=s['id']; t0=sc[k][0]
    for i,p in enumerate(s['parts']):
        st=t0+TM[k]['starts'][i]; en=t0+(TM[k]['starts'][i+1] if i<len(s['parts'])-1 else sc[k][1])
        caps.append(dict(s=round(st,3),e=round(en,3),t=disp(p)))
H=TM['hook']; J=sc['jadval'][0]; A=sc['amal'][0]; N=sc['nega'][0]; C=sc['cta'][0]
BL=min(8.8,J+TM['jadval']['starts'][1]+0.1)
BUR=[dict(t=H['starts'][2]+0.35,x=540,y=960,n=34,conf=False),
     dict(t=J+TM['jadval']['starts'][1]+0.1,x=540,y=800,n=24,conf=False),
     dict(t=C+0.3,x=540,y=820,n=40,conf=True)]
for i in (1,2,3,4): BUR.append(dict(t=A+TM['amal']['starts'][i],x=540,y=430+(i-1)*205+90,n=14,conf=False))
BUR.append(dict(t=N+TM['nega']['starts'][1]+0.1,x=800,y=730,n=26,conf=False))
CFG=dict(sc=sc,parts=parts,caps=caps,bur=BUR,total=TOTAL,blEnd=round(BL,3),bgN=int(BL*30)+3)
page=open('video11.html').read().replace('__CFG__',json.dumps(CFG,ensure_ascii=False)); open('page.html','w').write(page)
# ---- audio
rng=np.random.default_rng(1)
def env(n,a=0.005,d=0.1):
    x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def synth(k):
    if k=='tick': n=int(.018*SR); return rng.standard_normal(n)*env(n,.001,.004)*.22
    if k=='pop': n=int(.14*SR); x=np.arange(n)/SR; f=520+380*np.exp(-x*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.04)*.55
    if k=='ding': n=int(.7*SR); x=np.arange(n)/SR; return (np.sin(2*np.pi*1318*x)+.5*np.sin(2*np.pi*1975*x))*env(n,.002,.18)*.3
    if k=='boom': n=int(.6*SR); x=np.arange(n)/SR; return rng.standard_normal(n)*.25*np.exp(-x*7)+np.sin(2*np.pi*(80*np.exp(-x*4)+40)*x)*.6*np.exp(-x*6)
    if k=='thud': n=int(.22*SR); x=np.arange(n)/SR; f=130*np.exp(-x*9)+45; return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.07)*.9
    if k=='click': n=int(.03*SR); return rng.standard_normal(n)*env(n,.0005,.006)*.5
    if k=='riser': n=int(2.2*SR); x=np.arange(n)/SR; f=160+2400*(x/2.2)**2.2; return (np.sin(2*np.pi*np.cumsum(f)/SR)*.22+rng.standard_normal(n)*.1)*(x/2.2)**1.4
    if k=='whoosh':
        n=int(.4*SR); x=np.arange(n)/SR; c=np.cumsum(rng.standard_normal(n)); o=np.zeros(n)
        for i in range(n):
            L=int(6+80*(1-i/n)); j=max(0,i-L); o[i]=(c[i]-c[j])/L
        return o/(np.abs(o).max()+1e-9)*np.sin(np.pi*x/.4)**2*.4
def events():
    JS=TM['jadval']['starts']; AS=TM['amal']['starts']; NS=TM['nega']['starts']; CS=TM['cta']['starts']
    ev=[(0.02,'boom'),(2.6,'riser'),(4.3,'thud'),(4.4,'whoosh'),(H['starts'][2]+0.3,'boom'),(J+JS[1]+0.05,'whoosh')]
    ev+=[(J+JS[1]+0.1+0.18*i,'pop') for i in range(3)]+[(J+JS[2],'whoosh'),(J+JS[2]+0.5,'ding'),(J+JS[3]+0.2,'pop'),(J+JS[3]+0.6,'ding')]
    ev+=[(A,'whoosh')]+[(A+AS[i]-0.05,'pop') for i in (1,2,3,4)]+[(A+AS[i]+0.1,'ding') for i in (1,2,3,4)]+[(A+AS[4]+0.9,'pop')]
    ev+=[(N,'whoosh'),(N+0.9,'thud'),(N+NS[1]+0.1,'ding'),(N+NS[1]+0.8,'pop')]
    ev+=[(C,'whoosh'),(C+0.3,'boom'),(C+0.35,'pop'),(C+0.6,'ding'),(C+CS[1],'pop')]
    return ev
def build_audio():
    lst=[]
    for s in SC:
        k=s['id']; subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i',f't_{k}.mp3','-af',f"apad=whole_dur={sc[k][1]:.3f}",'-ar','44100','-ac','2',f'p_{k}.wav'],check=True); lst.append(f"file 'p_{k}.wav'")
    open('list.txt','w').write('\n'.join(lst)); subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i','list.txt','-c','copy','narr.wav'],check=True)
    with wave.open('narr.wav') as w: nar=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2).astype(np.float32)/32768
    tot=int(TOTAL*SR)+SR; mix=np.zeros((tot,2),np.float32); mix[:len(nar)]+=nar[:tot]; cache={}
    for tt,kind in events():
        if kind not in cache: cache[kind]=synth(kind).astype(np.float32)
        sd=cache[kind]; i0=int(tt*SR)
        if i0>=0 and i0+len(sd)<tot: mix[i0:i0+len(sd),0]+=sd*.33; mix[i0:i0+len(sd),1]+=sd*.33
    mix=np.clip(mix,-1,1)
    with wave.open('mix.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
from playwright.sync_api import sync_playwright
ARGS=['--no-sandbox','--font-render-hinting=none','--disable-lcd-text','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
def open_page(p):
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=ARGS); pg=b.new_page(viewport={'width':1080,'height':1920})
    msgs=[]; pg.on('pageerror',lambda e:msgs.append(str(e))); pg.on('console',lambda m:msgs.append(m.text) if m.type=='error' else None)
    pg.goto('http://127.0.0.1:8810/page.html')
    try: pg.wait_for_function('window.glReady===true',timeout=120000)
    except Exception: print('NOT READY',msgs[:5]); raise
    return b,pg,msgs
if __name__=='__main__':
    out=sys.argv[1]
    with sync_playwright() as p:
        b,pg,msgs=open_page(p)
        if len(sys.argv)>2 and sys.argv[2]=='still':
            for tt in map(float,sys.argv[3:]): pg.evaluate(f'setT({tt})'); pg.screenshot(path=f'still_{tt}.png')
            print('total',round(TOTAL,2),sc,msgs[:3]); b.close(); sys.exit()
        build_audio(); n=int(TOTAL*FPS)
        ff=subprocess.Popen(['/tmp/ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-i','mix.wav','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',out],stdin=subprocess.PIPE)
        t0=time.time()
        for i in range(n):
            pg.evaluate(f'setT({i/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=95))
            if i%60==0: print(i,n,round(time.time()-t0),flush=True)
        b.close(); ff.stdin.close(); ff.wait(); print('done',n,TOTAL)
