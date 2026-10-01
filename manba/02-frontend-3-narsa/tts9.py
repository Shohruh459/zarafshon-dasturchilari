import certifi, asyncio, re, subprocess
certifi.where=lambda:'/root/.ccr/ca-bundle.crt'
import edge_tts
from script9 import SCENES,HOOK
def fixuz(t): return re.sub(r"(?<=[oOgG])['’‘ʼ`´]",'ʻ',t)
# boshidagi/oxiridagi jimlikni kes, ICHKI uzun pauzalarni 0.2 s ga qisqartir
CLEAN="silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02:stop_periods=-1:stop_duration=0.30:stop_threshold=-42dB:stop_silence=0.18"

async def gen(text,out):
    await edge_tts.Communicate(fixuz(text),'uz-UZ-SardorNeural',rate='+12%').save(out)
async def main():
    for s in SCENES:
        if s['id']=='hook':
            await gen(HOOK[0],'a_hookA.mp3'); await gen(HOOK[1],'a_hookB.mp3')
        else: await gen(s['say'],f"a_{s['id']}.mp3")
asyncio.run(main())
def clean(i,o): subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i',i,'-af',CLEAN,o],check=True)
def dur(p):
    r=subprocess.run(['/tmp/ffmpeg','-i',p],capture_output=True,text=True).stderr
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',r); return int(m[1])*3600+int(m[2])*60+float(m[3])
for s in SCENES:
    k=s['id']
    if k=='hook':
        clean('a_hookA.mp3','t_hookA.mp3'); clean('a_hookB.mp3','t_hookB.mp3')
        subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i','t_hookA.mp3','-f','lavfi','-t','0.2','-i','anullsrc=r=24000:cl=mono','-i','t_hookB.mp3','-filter_complex','[0:a][1:a][2:a]concat=n=3:v=0:a=1[o]','-map','[o]','t_hook.mp3'],check=True)
        open('swap.txt','w').write(str(round(dur('t_hookA.mp3')+0.2,3)))
        print('hook',round(dur('t_hook.mp3'),2),'swap',open('swap.txt').read())
    else:
        clean(f"a_{k}.mp3",f"t_{k}.mp3"); print(k,round(dur(f"t_{k}.mp3"),2))
