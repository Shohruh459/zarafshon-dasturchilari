import sys, re, json, subprocess, wave, time
import numpy as np
sys.path.insert(0,'.')
from script9 import SCENES
FPS=30; SR=44100; TAIL=0.12
MIN={'hook':7.0,'html':5.0,'css':4.6,'js':5.4,'cta':5.5}
def adur(i):
    o=subprocess.run(['/tmp/ffmpeg','-i',f"t_{i}.mp3"],capture_output=True,text=True).stderr
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',o); return int(m[1])*3600+int(m[2])*60+float(m[3])
def disp(t): return re.sub(r"(?<=[oOgG])'","‘",t).replace("'","’")
t=0; sc={}
for s in SCENES:
    s['adur']=adur(s['id']); s['dur']=max(s['adur']+TAIL,MIN[s['id']]); s['t0']=t; sc[s['id']]=[round(t,3),round(s['dur'],3)]; t+=s['dur']
TOTAL=t
# captions
caps=[]
for s in SCENES:
    ph=[p for p in re.split(r'(?<=[.,:!?])\s+',disp(s['say'])) if p]
    wts=[max(6,len(p)) for p in ph]; tot=sum(wts); e=s['t0']
    for i,(p,w) in enumerate(zip(ph,wts)):
        end=e+s['adur']*w/tot
        caps.append(dict(s=round(e,3),e=round(end if i<len(ph)-1 else s['t0']+s['dur'],3),t=p)); e=end
from script9 import CODE,CPS
SWAP=float(open('swap.txt').read())
CLICK=3.5
def _ends(k):
    lines=CODE[k]; cum=[];c=0
    for l in lines: c+=len(l); cum.append(c); c+=1
    return [0.35+e/CPS[k] for e in cum]
BUR=[]
BUR.append(dict(t=0.0,x=540,y=1100,n=1,conf=False))
H_=sc['hook'][0]; Hh=sc['html'][0]; Cc=sc['css'][0]; Jj=sc['js'][0]; Ca=sc['cta'][0]
for e in _ends('html'): BUR.append(dict(t=Hh+e,x=540,y=1150,n=18,conf=False))
for e in _ends('css'): BUR.append(dict(t=Cc+e,x=540,y=1150,n=18,conf=False))
BUR.append(dict(t=Jj+CLICK,x=560,y=1250,n=26,conf=False)); BUR.append(dict(t=Jj+CLICK+0.1,x=540,y=1150,n=40,conf=True))
BUR.append(dict(t=Ca+0.3,x=540,y=820,n=40,conf=True))
CFG=dict(sc=sc,caps=caps,total=TOTAL,hookSwap=SWAP,code=CODE,cps=CPS,click=CLICK,bur=BUR)
page=open('video9.html').read().replace('__CFG__',json.dumps(CFG,ensure_ascii=False))
open('page.html','w').write(page)

# ---- sfx
def events():
    ev=[]
    for s in SCENES:
        k=s['id']; t0=s['t0']
        if k!='hook': ev.append((t0,'whoosh'))
        if k=='hook': ev+=[(0.02,'boom'),(0.5,'pop'),(0.7,'pop'),(0.9,'pop'),(1.9,'pop'),(SWAP,'whoosh'),(SWAP+0.12,'thud')]+[(t0+SWAP+0.3+i*0.45,'pop') for i in range(3)]
        if k in('html','css','js'):
            n=sum(len(l)+1 for l in CODE[k]); ev+=[(t0+0.35+q/CPS[k],'tick') for q in range(0,n,2)]
            if k!='js': ev+=[(t0+e,'pop') for e in _ends(k)]
            else: ev+=[(t0+CLICK,'click'),(t0+CLICK+0.05,'ding'),(t0+CLICK+0.1,'boom')]
        if k=='cta': ev+=[(t0+0.25,'boom'),(t0+0.3,'pop'),(t0+0.6,'ding'),(t0+1.1,'pop')]
    return ev
def synth(kind):
    rng=np.random.default_rng(1)
    def env(n,a=0.005,d=0.1):
        x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
    if kind=='click': n=int(.03*SR); return rng.standard_normal(n)*env(n,.0005,.006)*.5
    if kind=='thud':
        n=int(.22*SR); x=np.arange(n)/SR; f=130*np.exp(-x*9)+45; return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.07)*.9
    if kind=='tick': n=int(.018*SR); return rng.standard_normal(n)*env(n,.001,.004)*.22
    if kind=='pop':
        n=int(.14*SR); x=np.arange(n)/SR; f=520+380*np.exp(-x*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.04)*.55
    if kind=='ding':
        n=int(.7*SR); x=np.arange(n)/SR; return (np.sin(2*np.pi*1318*x)+.5*np.sin(2*np.pi*1975*x))*env(n,.002,.18)*.3
    if kind=='boom':
        n=int(.6*SR); x=np.arange(n)/SR; return rng.standard_normal(n)*.25*np.exp(-x*7)+np.sin(2*np.pi*(80*np.exp(-x*4)+40)*x)*.6*np.exp(-x*6)
    if kind=='riser':
        n=int(1.0*SR); x=np.arange(n)/SR; f=200+1800*x**2; return (np.sin(2*np.pi*np.cumsum(f)/SR)*.25+rng.standard_normal(n)*.12)*(x**1.5)
    if kind=='whoosh':
        n=int(.36*SR); x=np.arange(n)/SR; c=np.cumsum(rng.standard_normal(n)); out=np.zeros(n)
        for i in range(n):
            L=int(6+80*(1-i/n)); j=max(0,i-L); out[i]=(c[i]-c[j])/L
        return out/(np.abs(out).max()+1e-9)*np.sin(np.pi*x/.36)**2*.4
def build_audio():
    lst=[]
    for s in SCENES:
        subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i',f"t_{s['id']}.mp3",'-af',f"apad=whole_dur={s['dur']:.3f}",'-ar','44100','-ac','2',f"p_{s['id']}.wav"],check=True)
        lst.append(f"file 'p_{s['id']}.wav'")
    open('list.txt','w').write('\n'.join(lst))
    subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i','list.txt','-c','copy','narr.wav'],check=True)
    with wave.open('narr.wav') as w: nar=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2).astype(np.float32)/32768
    total=int(TOTAL*SR)+SR; mix=np.zeros((total,2),np.float32); mix[:len(nar)]+=nar[:total]; cache={}
    for tt,kind in events():
        if kind not in cache: cache[kind]=synth(kind).astype(np.float32)
        sd=cache[kind]; i0=int(tt*SR)
        if i0<0 or i0+len(sd)>total: continue
        mix[i0:i0+len(sd),0]+=sd*.33; mix[i0:i0+len(sd),1]+=sd*.33
    mix=np.clip(mix,-1,1)
    with wave.open('mix.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())

from playwright.sync_api import sync_playwright
def launch(p): return p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox','--font-render-hinting=none','--disable-lcd-text'])
if __name__=='__main__':
    out=sys.argv[1]
    with sync_playwright() as p:
        b=launch(p); pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('file://'+__import__('os').path.abspath('page.html')); pg.wait_for_timeout(500)
        if len(sys.argv)>2 and sys.argv[2]=='still':
            for tt in map(float,sys.argv[3:]):
                pg.evaluate(f'setT({tt})'); pg.screenshot(path=f'still_{tt}.png')
            print('total',TOTAL,sc); b.close(); sys.exit()
        build_audio()
        n=int(TOTAL*FPS)
        ff=subprocess.Popen(['/tmp/ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-i','mix.wav','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',out],stdin=subprocess.PIPE)
        t0=time.time()
        for i in range(n):
            pg.evaluate(f'setT({i/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=95))
            if i%150==0: print(i,n,round(time.time()-t0),flush=True)
        ff.stdin.close(); ff.wait(); b.close(); print('done',n,TOTAL)
