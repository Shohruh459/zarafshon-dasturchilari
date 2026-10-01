import bpy, math, random, sys, os, time
# usage: python3 ombor.py <f0> <f1> <scale> <samples> <outdir>
f0, f1 = int(sys.argv[1]), int(sys.argv[2]); SCALE = float(sys.argv[3]); SAMPLES = int(sys.argv[4]); OUT = os.path.abspath(sys.argv[5])
os.makedirs(OUT, exist_ok=True)
FPS = float(sys.argv[6]) if len(sys.argv)>6 else 15.0
T_DOOR0, T_DOOR1 = 4.35, 5.35      # eshik ochilishi (sekund)
T_ENTER0 = 4.95                    # kamera ichkariga kira boshlaydi

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
sc.view_settings.exposure = -0.55
random.seed(7)

def mat(name, base, rough=0.5, metal=0.0, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit is not None:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = estr
    return m
def box(name, loc, size, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = name; o.scale = size; o.data.materials.append(m)
    if bevel > 0:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2
    return o

# ---- world (dark, tiny fog)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.012, 0.01, 0.035, 1); bg.inputs[1].default_value = 1.0

M_FLOOR = mat('floor', (0.02, 0.022, 0.04), 0.16, 0.35)
M_WALL = mat('wall', (0.05, 0.055, 0.09), 0.65, 0.1)
M_STEEL = mat('steel', (0.07, 0.08, 0.12), 0.35, 0.85)
M_ORANGE = mat('orange', (0.95, 0.38, 0.08), 0.4, 0.2)
M_BOX = mat('box', (0.30, 0.19, 0.10), 0.85, 0.0)
M_CYAN = mat('cyan', (0.02, 0.2, 0.35), 0.25, 0.0, (0.05, 0.75, 1.0), 4.5)
M_GOLD = mat('gold', (0.35, 0.2, 0.02), 0.25, 0.0, (1.0, 0.62, 0.08), 4.5)
M_PURP = mat('purp', (0.15, 0.06, 0.35), 0.25, 0.0, (0.55, 0.25, 1.0), 4.5)
M_LAMP = mat('lamp', (1, 1, 1), 0.5, 0.0, (0.85, 0.92, 1.0), 14.0)
M_SIGN = mat('sign', (1, 0.7, 0.2), 0.3, 0.0, (1.0, 0.65, 0.12), 6.0)
M_DOOR = mat('door', (0.1, 0.11, 0.16), 0.3, 0.9)

# ---- building: x in [-4,4], y in [0,34], wall at y=0 with door gap x in [-1.7,1.7], z in [0,3.4]
H = 4.2
box('floor', (0, 12, -0.05), (30, 60, 0.1), M_FLOOR)
box('ceiling', (0, 17, H + 0.05), (8.6, 36, 0.1), M_WALL)
box('wallL', (-4.3, 17, H / 2), (0.2, 36, H), M_WALL)
box('wallR', (4.3, 17, H / 2), (0.2, 36, H), M_WALL)
box('wallEnd', (0, 35, H / 2), (8.8, 0.2, H), M_WALL)
box('frontL', (-3.0, 0, H / 2), (2.6, 0.5, H), M_WALL)
box('frontR', (3.0, 0, H / 2), (2.6, 0.5, H), M_WALL)
box('frontTop', (0, 0, 3.4 + (H - 3.4) / 2), (3.4, 0.5, H - 3.4), M_WALL)
# door frame (orange) + sliding panel
box('dfL', (-1.78, -0.28, 1.7), (0.16, 0.12, 3.4), M_ORANGE); box('dfR', (1.78, -0.28, 1.7), (0.16, 0.12, 3.4), M_ORANGE); box('dfT', (0, -0.28, 3.46), (3.72, 0.12, 0.16), M_ORANGE)
door = box('door', (0, -0.1, 1.7), (3.4, 0.12, 3.4), M_DOOR)
for i in range(7): box(f'rib{i}', (0, -0.18, 0.25 + i * 0.5), (3.3, 0.05, 0.06), M_STEEL).parent = door
# sign
bpy.ops.object.text_add(location=(0, -0.45, 3.95), rotation=(math.pi / 2, 0, 0)); tx = bpy.context.object; tx.data.body = 'OMBOR'; tx.data.extrude = 0.05; tx.data.size = 0.55; tx.data.align_x = 'CENTER'; tx.data.materials.append(M_SIGN); tx.data.font = bpy.data.fonts.load('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf')
# outside floor lamp wash
bpy.ops.object.light_add(type='AREA', location=(0, -6, 4)); L = bpy.context.object; L.data.energy = 900; L.data.color = (1, 0.8, 0.55); L.data.size = 4; L.rotation_euler = (math.radians(40), 0, 0)
bpy.ops.object.light_add(type='SPOT', location=(0, -3.5, 3.2)); L = bpy.context.object; L.data.energy = 600; L.data.color = (1, 0.7, 0.4); L.data.spot_size = math.radians(60); L.rotation_euler = (math.radians(75), 0, 0)
# ---- shelving: two rows, aisle in the middle
LABELS = ['MIJOZLAR', 'BUYURTMALAR', 'MAHSULOTLAR']
def shelf(x, y, side):
    d = 0.9; wd = 1.9
    for dx in (-d / 2, d / 2):
        for dy in (-wd / 2, wd / 2): box('post', (x + dx, y + dy, 1.5), (0.07, 0.07, 3.0), M_STEEL)
    for k, z in enumerate((0.2, 1.1, 2.0, 2.9)):
        box('beam', (x, y, z), (d + 0.05, wd + 0.05, 0.07), M_ORANGE)
        if k < 3:
            n = random.choice((2, 3, 3))
            for j in range(n):
                cy = y - wd / 2 + (j + 0.5) * wd / n; s = (0.62, wd / n - 0.12, random.uniform(0.5, 0.75))
                r = random.random(); m = M_CYAN if r < 0.16 else M_GOLD if r < 0.30 else M_PURP if r < 0.42 else M_BOX
                box('crate', (x + random.uniform(-0.04, 0.04), cy, z + 0.035 + s[2] / 2), s, m, 0.03)
for yy in range(3, 33, 3):
    shelf(-3.1, yy, -1); shelf(3.1, yy, 1)
# aisle sign boards (hanging) every 9 m
for i, yy in enumerate((9, 18, 27)):
    bpy.ops.object.text_add(location=(0, yy, 3.55), rotation=(math.pi / 2, 0, math.pi / 2 * 0)); t2 = bpy.context.object
    t2.data.body = LABELS[i]; t2.data.extrude = 0.03; t2.data.size = 0.34; t2.data.align_x = 'CENTER'; t2.data.materials.append(M_SIGN); t2.data.font = bpy.data.fonts.load('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf')
    bpy.ops.object.empty_add(location=(0, yy, 3.9))
# ceiling lights
for yy in range(2, 34, 4):
    box('lamp', (0, yy, H - 0.08), (1.6, 0.35, 0.05), M_LAMP)
for yy in (4, 11, 18, 25, 32):
    bpy.ops.object.light_add(type='AREA', location=(0, yy, H - 0.2)); L = bpy.context.object; L.data.energy = 1100; L.data.size = 3.0; L.data.color = (0.8, 0.88, 1.0); L.rotation_euler = (0, 0, 0)
# end-wall glow (the "mijozlar" table highlight)
bpy.ops.object.light_add(type='AREA', location=(0, 33.5, 2.2)); L = bpy.context.object; L.data.energy = 900; L.data.size = 3; L.data.color = (1, 0.7, 0.3); L.rotation_euler = (math.radians(90), 0, 0)
# camera
bpy.ops.object.camera_add(location=(0, -9, 1.5)); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 26; cam.data.sensor_width = 36
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 4.0; cam.data.dof.focus_distance = 8.0

def ease(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def pose(t):
    # outside push-in, door opens, glide through the door and down the aisle
    y = -9.0 + 0.45 * t
    if t > T_ENTER0:
        u = (t - T_ENTER0)
        x_ = min(1.0, u / 1.2); y = -9.0 + 0.45 * T_ENTER0 + (4.5 * 1.2 * (x_ ** 3 - x_ ** 4 / 2) if u <= 1.2 else 4.5 * 1.2 * 0.5 + 4.5 * (u - 1.2))
    z = 1.55 + 0.05 * math.sin(t * 1.3)
    x = 0.12 * math.sin(t * 0.8)
    return x, y, z
for f in range(f0, f1 + 1):
    t = f / FPS
    out = os.path.join(OUT, f'f_{f:04d}.jpg')
    if os.path.exists(out): continue
    x, y, z = pose(t)
    cam.location = (x, y, z)
    look_y = y + 6.0
    cam.rotation_euler = (math.radians(90 - 1.5), 0, math.radians(0.8 * math.sin(t * 0.6)))
    # door slide up
    dz = 1.7 + 3.5 * ease((t - T_DOOR0) / (T_DOOR1 - T_DOOR0))
    door.location.z = dz
    cam.data.dof.focus_distance = max(2.5, 8.0 if t < T_ENTER0 else 7.5)
    sc.render.filepath = out
    t0 = time.time(); bpy.ops.render.render(write_still=True); print('FRAME', f, round(time.time() - t0, 1), flush=True)
