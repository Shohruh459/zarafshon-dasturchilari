import sys, subprocess, time
from playwright.sync_api import sync_playwright
I0=int(sys.argv[1]); N=int(sys.argv[2])
ff=subprocess.Popen(['/tmp/ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','part2.mp4'],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox','--font-render-hinting=none','--disable-lcd-text','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://127.0.0.1:8766/page.html'); pg.wait_for_function('window.glReady===true',timeout=90000); pg.wait_for_timeout(300)
    if I0<0:
        for tt in (30.3,30.7,31.4,28.1): pg.evaluate(f'setT({tt})'); pg.screenshot(path=f'cf_{tt}.png')
        b.close(); ff.stdin.close(); sys.exit()
    t0=time.time()
    for i in range(I0,N):
        pg.evaluate(f'setT({i/30})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=95))
        if (i-I0)%50==0: print(i,N,round(time.time()-t0),flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done')
