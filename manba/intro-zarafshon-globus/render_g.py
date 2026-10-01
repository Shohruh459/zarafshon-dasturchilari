import sys, json, subprocess, wave, time
import numpy as np
from playwright.sync_api import sync_playwright
T=json.load(open('timing.json')); DUR=T['end']+0.5; FPS=30; SR=44100; N=int(DUR*FPS)
rng=np.random.default_rng(1)
def env(n,a=0.005,d=0.1):
    x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def synth(k):
    if k=='pop': n=int(.14*SR); x=np.arange(n)/SR; f=520+380*np.exp(-x*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.04)*.55
    if k=='ding': n=int(.8*SR); x=np.arange(n)/SR; return (np.sin(2*np.pi*1318*x)+.5*np.sin(2*np.pi*1975*x))*env(n,.002,.2)*.32
    if k=='boom': n=int(.7*SR); x=np.arange(n)/SR; return rng.standard_normal(n)*.22*np.exp(-x*7)+np.sin(2*np.pi*(80*np.exp(-x*4)+40)*x)*.6*np.exp(-x*6)
    if k=='riser': n=int(1.3*SR); x=np.arange(n)/SR; f=200+1900*(x/1.3)**2; return (np.sin(2*np.pi*np.cumsum(f)/SR)*.22+rng.standard_normal(n)*.1)*(x/1.3)**1.5
    if k=='whoosh':
        n=int(.5*SR); x=np.arange(n)/SR; c=np.cumsum(rng.standard_normal(n)); o=np.zeros(n)
        for i in range(n):
            L=int(6+80*(1-i/n)); j=max(0,i-L); o[i]=(c[i]-c[j])/L
        return o/(np.abs(o).max()+1e-9)*np.sin(np.pi*x/.5)**2*.4
EV=[(0.02,'boom'),(0.1,'whoosh'),(T['tB']-0.5,'riser'),(T['tB']+0.2,'pop'),(T['tC']-1.0,'riser'),(T['tC']+0.25,'ding'),(T['tC']+0.3,'boom'),(T['tC']+0.4,'pop'),(T['tC']+0.6,'pop')]
subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i','t_g.mp3','-af',f'apad=whole_dur={DUR}','-ar','44100','-ac','2','narr_g.wav'],check=True)
with wave.open('narr_g.wav') as w: nar=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2).astype(np.float32)/32768
tot=int(DUR*SR)+SR; mix=np.zeros((tot,2),np.float32); mix[:len(nar)]+=nar[:tot]; cache={}
for t,k in EV:
    if k not in cache: cache[k]=synth(k).astype(np.float32)
    s=cache[k]; i0=int(t*SR)
    if i0>=0 and i0+len(s)<tot: mix[i0:i0+len(s),0]+=s*.33; mix[i0:i0+len(s),1]+=s*.33
mix=np.clip(mix,-1,1)
with wave.open('mix_g.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
out=sys.argv[1]
ff=subprocess.Popen(['/tmp/ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-i','mix_g.wav','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',out],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox','--font-render-hinting=none','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://127.0.0.1:8801/globe.html'); pg.wait_for_function('window.glReady===true',timeout=120000)
    t0=time.time()
    for i in range(N):
        pg.evaluate(f'setGL({i/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=95))
        if i%30==0: print(i,N,round(time.time()-t0),flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done',N,DUR)
