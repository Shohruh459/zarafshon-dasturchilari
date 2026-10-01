import time, sys, subprocess
from playwright.sync_api import sync_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 120
ff=subprocess.Popen(['/tmp/ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','webgl_test.mp4'],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://127.0.0.1:8765/scene.html'); pg.wait_for_function('window.ready===true',timeout=60000)
    t0=time.time()
    for i in range(N):
        pg.evaluate(f'setT({i/30})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=94))
        if i%20==0: print(i,N,round(time.time()-t0),flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done',round(time.time()-t0),'s')
