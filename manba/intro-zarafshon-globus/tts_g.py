import certifi, asyncio, re, subprocess, json
certifi.where=lambda:'/root/.ccr/ca-bundle.crt'
import edge_tts
def fixuz(t): return re.sub(r"(?<=[oOgG])['’‘ʼ`´]",'ʻ',t)
CLEAN="silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02:stop_periods=-1:stop_duration=0.30:stop_threshold=-42dB:stop_silence=0.18"
PARTS=["Zarafshonlik dasturchimisiz?","Yoki dasturlashni endi boshlayapsizmi?","Bu video aynan siz uchun!"]
async def main():
    for i,t in enumerate(PARTS): await edge_tts.Communicate(fixuz(t),'uz-UZ-SardorNeural',rate='+10%').save(f'a_g{i}.mp3')
asyncio.run(main())
def dur(p):
    r=subprocess.run(['/tmp/ffmpeg','-i',p],capture_output=True,text=True).stderr
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',r); return int(m[1])*3600+int(m[2])*60+float(m[3])
d=[]
for i in range(3):
    subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i',f'a_g{i}.mp3','-af',CLEAN,f't_g{i}.mp3'],check=True); d.append(dur(f't_g{i}.mp3'))
GAP=0.22
subprocess.run(['/tmp/ffmpeg','-loglevel','error','-y','-i','t_g0.mp3','-f','lavfi','-t',str(GAP),'-i','anullsrc=r=24000:cl=mono','-i','t_g1.mp3','-f','lavfi','-t',str(GAP),'-i','anullsrc=r=24000:cl=mono','-i','t_g2.mp3','-filter_complex','[0:a][1:a][2:a][3:a][4:a]concat=n=5:v=0:a=1[o]','-map','[o]','t_g.mp3'],check=True)
tB=d[0]+GAP; tC=tB+d[1]+GAP; end=tC+d[2]
json.dump(dict(tB=round(tB,3),tC=round(tC,3),end=round(end,3),parts=PARTS),open('timing.json','w'))
print(d,'tB',round(tB,2),'tC',round(tC,2),'end',round(end,2))
