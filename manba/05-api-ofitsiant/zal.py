import bpy, math, random, sys, os, time
# usage: python3 zal.py <f0> <f1> <scale> <samples> <outdir> [fps] [f1,f2,...]
f0, f1 = int(sys.argv[1]), int(sys.argv[2]); SCALE = float(sys.argv[3]); SAMPLES = int(sys.argv[4]); OUT = os.path.abspath(sys.argv[5])
FPS = float(sys.argv[6]) if len(sys.argv) > 6 else 15.0
FR = [int(x) for x in sys.argv[7].split(',')] if len(sys.argv) > 7 else list(range(f0, f1 + 1))
os.makedirs(OUT, exist_ok=True)
T_WAL0, T_DOOR0, T_DOOR1 = 4.7, 5.7, 6.5
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 3; sc.cycles.transmission_bounces = 1
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.03
sc.render.resolution_x = int(1080 * SCALE); sc.render.resolution_y = int(1920 * SCALE); sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 95
try: sc.view_settings.view_transform = 'AgX'
except Exception: sc.view_settings.view_transform = 'Filmic'
sc.view_settings.look = 'AgX - Medium High Contrast' if sc.view_settings.view_transform == 'AgX' else 'None'
sc.view_settings.exposure = -0.7
random.seed(11)
def mat(name, base, rough=0.5, metal=0.0, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit is not None:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = estr
    return m
def box(name, loc, size, m, bevel=0.0, rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = name; o.scale = size; o.data.materials.append(m)
    if rot: o.rotation_euler = rot
    if bevel > 0:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2
    return o
def cyl(name, loc, r, h, m, verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc); o = bpy.context.object; o.name = name; o.data.materials.append(m); return o
def sph(name, loc, r, m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=r, location=loc); o = bpy.context.object; o.name = name; o.data.materials.append(m)
    bpy.ops.object.shade_smooth(); return o
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.02, 0.012, 0.03, 1); bg.inputs[1].default_value = 1.0
M_FLOOR = mat('floor', (0.05, 0.022, 0.012), 0.12, 0.0)
M_CEIL = mat('ceil', (0.03, 0.02, 0.025), 0.8)
M_WALL = mat('wall', (0.07, 0.03, 0.03), 0.7)
M_WOOD = mat('wood', (0.30, 0.15, 0.07), 0.45)
M_CLOTH = mat('cloth', (0.65, 0.12, 0.10), 0.8)
M_WHITE = mat('white', (0.9, 0.9, 0.88), 0.5)
M_DARK = mat('dark', (0.03, 0.03, 0.05), 0.5)
M_SKIN = mat('skin', (0.75, 0.5, 0.38), 0.6)
M_RED = mat('red', (0.8, 0.05, 0.08), 0.5)
M_GOLD = mat('gold', (0.9, 0.55, 0.1), 0.35, 0.6)
M_STEEL = mat('steel', (0.18, 0.19, 0.21), 0.3, 0.8)
M_LAMP = mat('lamp', (1, 0.8, 0.5), 0.5, 0.0, (1.0, 0.7, 0.35), 12.0)
M_CAND = mat('cand', (1, 0.7, 0.3), 0.5, 0.0, (1.0, 0.6, 0.2), 20.0)
M_SIGN = mat('sign', (1, 0.7, 0.2), 0.3, 0.0, (1.0, 0.65, 0.12), 6.0)
M_KIT = mat('kit', (0.25, 0.2, 0.14), 0.6, 0.0, (1.0, 0.6, 0.3), 0.15)
H = 4.0; WY = 10.0
box('floor', (0, 5, -0.05), (10, 40, 0.1), M_FLOOR)
box('ceiling', (0, 5, H + 0.05), (10, 40, 0.1), M_CEIL)
box('wallL', (-4.5, 5, H / 2), (0.2, 40, H), M_WALL); box('wallR', (4.5, 5, H / 2), (0.2, 40, H), M_WALL)
box('wallB', (0, -12, H / 2), (10, 0.2, H), M_WALL)
# kitchen wall with door gap x in [-1.5,1.5]
box('kwL', (-3.0, WY, H / 2), (3.0, 0.3, H), M_WALL); box('kwR', (3.0, WY, H / 2), (3.0, 0.3, H), M_WALL); box('kwT', (0, WY, 3.2 + (H - 3.2) / 2), (3.0, 0.3, H - 3.2), M_WALL)
box('dfL', (-1.55, WY - 0.2, 1.6), (0.12, 0.1, 3.2), M_GOLD); box('dfR', (1.55, WY - 0.2, 1.6), (0.12, 0.1, 3.2), M_GOLD); box('dfT', (0, WY - 0.2, 3.25), (3.2, 0.1, 0.12), M_GOLD)
# swinging doors: hinge at outer edge
hingeL = bpy.data.objects.new('hL', None); hingeR = bpy.data.objects.new('hR', None)
for h_, x in ((hingeL, -1.5), (hingeR, 1.5)): bpy.context.collection.objects.link(h_); h_.location = (x, WY - 0.1, 0)
dL = box('doorL', (0.75, 0, 1.55), (1.5, 0.1, 3.1), M_WOOD, 0.02); dL.parent = hingeL
dR = box('doorR', (-0.75, 0, 1.55), (1.5, 0.1, 3.1), M_WOOD, 0.02); dR.parent = hingeR
for d_ in (dL, dR):
    box('win', (0, -0.06, 2.0), (0.7, 0.04, 0.7), M_KIT).parent = d_
bpy.ops.object.text_add(location=(0, WY - 0.4, 3.62), rotation=(math.pi / 2, 0, 0)); tx = bpy.context.object; tx.data.body = 'OSHXONA'; tx.data.extrude = 0.04; tx.data.size = 0.42; tx.data.align_x = 'CENTER'; tx.data.materials.append(M_SIGN); tx.data.font = bpy.data.fonts.load('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf')
# kitchen interior
box('kfloor', (0, WY + 4, -0.04), (9, 8, 0.1), M_STEEL); box('kback', (0, WY + 8, 2), (9, 0.2, 4), M_KIT)
box('counter', (-2.2, WY + 4, 0.45), (2.0, 5, 0.9), M_STEEL); box('counter2', (2.2, WY + 4, 0.45), (2.0, 5, 0.9), M_STEEL)
for i_ in range(5):
    cyl('pot', (-2.2, WY + 2 + i_ * 1.0, 1.05), 0.28, 0.3, M_GOLD, 20); cyl('pot2', (2.2, WY + 2.3 + i_ * 1.0, 1.05), 0.25, 0.28, M_STEEL, 20)
box('stove', (2.2, WY + 6.5, 1.0), (1.8, 1.2, 0.2), mat('fire', (1, .3, .05), 0.5, 0.0, (1.0, 0.35, 0.05), 8.0))
box('shelfk', (0, WY + 7.8, 2.4), (6.0, 0.3, 0.1), M_WOOD)
bpy.ops.object.light_add(type='POINT', location=(0, WY + 6, 2.2)); L = bpy.context.object; L.data.energy = 600; L.data.color = (1, 0.55, 0.25)
bpy.ops.object.light_add(type='AREA', location=(0, WY + 3, 3.8)); L = bpy.context.object; L.data.energy = 600; L.data.size = 5; L.data.color = (1, 0.88, 0.7)
# tables + chairs
def table(x, y):
    cyl('top', (x, y, 0.8), 0.55, 0.06, M_WOOD); cyl('cl', (x, y, 0.84), 0.5, 0.02, M_CLOTH); cyl('stem', (x, y, 0.4), 0.06, 0.8, M_STEEL, 12)
    cyl('foot', (x, y, 0.03), 0.3, 0.05, M_STEEL, 24); cyl('cand', (x, y, 0.92), 0.03, 0.14, M_CAND, 12)
    for a in (0, 2.1, 4.2):
        cx, cy = x + 0.95 * math.cos(a + 0.5), y + 0.95 * math.sin(a + 0.5)
        cyl('seat', (cx, cy, 0.48), 0.24, 0.06, M_RED, 16); cyl('leg', (cx, cy, 0.24), 0.04, 0.48, M_STEEL, 8)
        box('back', (cx + 0.2 * math.cos(a + 0.5), cy + 0.2 * math.sin(a + 0.5), 0.8), (0.04, 0.4, 0.5), M_RED)
for (x, y) in ((-2.7, 1.0), (2.7, 2.0), (-2.7, 4.8), (2.7, 6.0), (-2.7, 8.2), (2.7, 9.0)): table(x, y)
for yy in (0, 4, 8):
    for px in (-1.7, 1.7): cyl('pend', (px, yy + 1, 3.3), 0.2, 0.22, M_LAMP, 16)
    bpy.ops.object.light_add(type='POINT', location=(0, yy + 1, 3.0)); L = bpy.context.object; L.data.energy = 1100; L.data.color = (1, 0.72, 0.45); L.data.shadow_soft_size = 0.4
bpy.ops.object.light_add(type='AREA', location=(0, -5, 3.5)); L = bpy.context.object; L.data.energy = 500; L.data.size = 6; L.data.color = (1, 0.8, 0.6)
# waiter
wt = bpy.data.objects.new('waiter', None); bpy.context.collection.objects.link(wt)
def part(o): o.parent = wt; return o
part(cyl('legs', (0, 0, 0.5), 0.17, 1.0, M_DARK, 16)); part(cyl('shirt', (0, 0, 1.35), 0.22, 0.75, M_WHITE, 20)); part(cyl('vest', (0, -0.02, 1.3), 0.23, 0.45, M_DARK, 20))
part(sph('head', (0, 0, 1.95), 0.17, M_SKIN)); part(sph('hair', (0, 0.03, 2.03), 0.17, M_DARK)); part(box('bow', (0, -0.22, 1.66), (0.2, 0.05, 0.08), M_RED))
part(cyl('arm', (-0.1, -0.3, 1.45), 0.06, 0.6, M_WHITE, 12)); part(cyl('tray', (-0.1, -0.5, 1.7), 0.32, 0.03, M_STEEL, 24))
paper = part(box('order', (-0.1, -0.5, 1.74), (0.28, 0.2, 0.01), M_WHITE))
wt.rotation_euler = (0, 0, math.pi)  # faces +y? set per frame
bpy.ops.object.camera_add(location=(0, -9, 1.55)); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 26; cam.data.sensor_width = 36; cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 4.0; cam.data.dof.focus_distance = 9.0
def ease(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def lerp(a, b, u): return a + (b - a) * u
KT=[0,4.7,7.5,8.7,11.6]; KY=[-9.0,-6.9,5.0,9.2,11.3]
def cam_y(t):
    n=len(KT)
    for i in range(n-1):
        if t<=KT[i+1] or i==n-2:
            def tan(j):
                if j==0: return (KY[1]-KY[0])/(KT[1]-KT[0])
                if j==n-1: return (KY[-1]-KY[-2])/(KT[-1]-KT[-2])
                return (KY[j+1]-KY[j-1])/(KT[j+1]-KT[j-1])
            h=KT[i+1]-KT[i]; u=min(1,max(0,(t-KT[i])/h)); u2=u*u; u3=u2*u
            return (2*u3-3*u2+1)*KY[i]+(u3-2*u2+u)*h*tan(i)+(-2*u3+3*u2)*KY[i+1]+(u3-u2)*h*tan(i+1)
def waiter_pos(t):
    if t < T_WAL0: return None
    u = (t - T_WAL0) / 2.6
    x = lerp(-3.4, 0.0, ease(min(1, u))); y = lerp(3.2, WY + 0.8, min(1, u))
    if u > 1: y = WY + 0.8 + (t - T_WAL0 - 2.6) * 1.4
    return x, y
for f in FR:
    t = f / FPS; out = os.path.join(OUT, f'f_{f:04d}.jpg')
    if os.path.exists(out): continue
    cy = cam_y(t); cam.location = (0.15 * math.sin(t * 0.7), cy, 1.55 + 0.04 * math.sin(t * 1.3))
    cam.rotation_euler = (math.radians(89), 0, math.radians(0.8 * math.sin(t * 0.5)))
    cam.data.dof.focus_distance = max(2.5, (WY if cy < WY - 1 else WY + 3.0 + 0) - cy) if cy < WY + 1 else 4.5
    o = ease((t - T_DOOR0) / (T_DOOR1 - T_DOOR0)); hingeL.rotation_euler = (0, 0, math.radians(95) * o); hingeR.rotation_euler = (0, 0, -math.radians(95) * o)
    p = waiter_pos(t)
    if p is None: wt.location = (-9, 0, 0)
    else:
        wt.location = (p[0], p[1], 0.05 * abs(math.sin(t * 7)))
        wt.rotation_euler = (0, 0, math.pi)
    sc.render.filepath = out; t0 = time.time(); bpy.ops.render.render(write_still=True); print('FRAME', f, round(time.time() - t0, 1), flush=True)
