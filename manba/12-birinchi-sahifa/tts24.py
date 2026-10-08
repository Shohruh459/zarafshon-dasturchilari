import certifi, asyncio, re, subprocess, json
certifi.where=lambda:'/root/.ccr/ca-bundle.crt'
import edge_tts
from script24 import SC
def fixuz(t): t=t.replace('GitHub','Git xab').replace('commit','kommit').replace('clone','klon').replace('push','pash').replace('token','tokin').replace('Claude','Klod').replace('index.html','indeks nuqta eych ti em el').replace('HTML','eych ti em el'); return re.sub(r"(?<=[oOgG])['’‘ʼ`´]",'ʻ',t)
CLEAN="silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02:stop_periods=-1:stop_duration=0.30:stop_threshold=-42dB:stop_silence=0.18"
def dur(p):
    r=subprocess.run(['/tmp/ffmpeg','-i',p],capture_output=True,text=True).stderr
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',r); return int(m[1])*3600+int(m[2])*60+float(m[3])
async def gen():
    for s in SC:
        for i,t in enumerate(s['parts']): await edge_tts.Communicate(fixuz(t),'uz-UZ-SardorNeural',rate='+10%').save(f"a_{s['id']}_{i}.mp3")
asyncio.run(gen())
T={}
for s in SC:
    k=s['id']; ds=[]
    for i in range(len(s['parts'])):
        subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i',f'a_{k}_{i}.mp3','-af',CLEAN,f't_{k}_{i}.mp3'],check=True); ds.append(dur(f't_{k}_{i}.mp3'))
    ins=[];fc='';n=0
    for i,d in enumerate(ds):
        ins+=['-i',f't_{k}_{i}.mp3']
    # gaps via anullsrc
    args=['/tmp/ffmpeg','-loglevel','error','-y']; labels=[]; idx=0
    for i in range(len(ds)):
        args+=['-i',f't_{k}_{i}.mp3']; labels.append(f'[{idx}:a]'); idx+=1
        if i<len(ds)-1: args+=['-f','lavfi','-t',str(s['gaps'][i]),'-i','anullsrc=r=24000:cl=mono']; labels.append(f'[{idx}:a]'); idx+=1
    args+=['-filter_complex',''.join(labels)+f'concat=n={len(labels)}:v=0:a=1[o]','-map','[o]',f't_{k}.mp3']
    subprocess.run(args,check=True)
    starts=[];ends=[];t=0
    for i,d in enumerate(ds):
        starts.append(round(t,3)); ends.append(round(t+d,3)); t+=d+(s['gaps'][i] if i<len(ds)-1 else 0)
    T[k]=dict(starts=starts,ends=ends,dur=round(t,3)); print(k,T[k])
json.dump(T,open('timing.json','w'))
