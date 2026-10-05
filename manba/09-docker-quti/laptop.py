import bpy, math, sys, os, json
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector
W,H=1600,1200
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=int(sys.argv[1]) if len(sys.argv)>1 else 96
sc.cycles.use_denoising=True; sc.cycles.denoiser='OPENIMAGEDENOISE'
sc.render.resolution_x=W; sc.render.resolution_y=H; sc.render.film_transparent=True
sc.render.image_settings.file_format='PNG'; sc.render.image_settings.color_mode='RGBA'
try: sc.view_settings.view_transform='AgX'
except Exception: sc.view_settings.view_transform='Filmic'
sc.view_settings.exposure=-0.2
def mat(name,base,rough=0.5,metal=0.0,emit=None,es=0.0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*base,1); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    if emit is not None: b.inputs['Emission Color'].default_value=(*emit,1); b.inputs['Emission Strength'].default_value=es
    return m
def box(name,loc,size,m,bevel=0.0,parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=name; o.scale=size; o.data.materials.append(m)
    if bevel>0:
        bv=o.modifiers.new('bv','BEVEL'); bv.width=bevel; bv.segments=4
    if parent: o.parent=parent
    return o
ALU=mat('alu',(0.62,0.63,0.66),0.32,1.0); DARK=mat('dark',(0.012,0.012,0.014),0.35,0.0); KEY=mat('key',(0.018,0.018,0.02),0.55,0.0)
GLASS=mat('glass',(0.005,0.005,0.006),0.08,0.0); PAD=mat('pad',(0.55,0.56,0.6),0.2,1.0); SCREEN=mat('screen',(0.0,0.0,0.0),0.05,0.0)
# base
box('base',(0,0,0.05),(3.2,2.2,0.1),ALU,0.035)
box('wellglass',(0,0.45,0.1005),(3.0,1.0,0.002),DARK)
for r in range(5):
    for c in range(14):
        w=0.178; x=-1.3+c*0.2; y=0.82-r*0.19
        box('k',(x,y,0.115),(w,0.16,0.03),KEY,0.012)
box('space',(0,0.82-5*0.19,0.115),(1.1,0.16,0.03),KEY,0.012)
box('trackpad',(0,-0.62,0.1015),(1.15,0.7,0.004),PAD,0.01)
# lid on hinge
hinge=bpy.data.objects.new('hinge',None); sc.collection.objects.link(hinge); hinge.location=(0,1.1,0.1); hinge.rotation_euler=(math.radians(-112),0,0)
box('lid',(0,-1.075,0),(3.2,2.15,0.07),ALU,0.03,hinge)
box('bezel',(0,-1.075,-0.0365),(3.1,2.05,0.002),GLASS,0.0,hinge)
sw,sh=2.96,1.85
scr=box('screen',(0,-1.075,-0.0378),(sw,sh,0.001),SCREEN,0.0,hinge)
# hinge cylinder
bpy.ops.mesh.primitive_cylinder_add(radius=0.04,depth=2.6,location=(0,1.1,0.1),rotation=(0,math.radians(90),0)); c=bpy.context.object; c.data.materials.append(DARK)
# shadow catcher ground
bpy.ops.mesh.primitive_plane_add(size=30,location=(0,0,-0.0)); g=bpy.context.object; g.hide_render=True
# world: dark gradient for reflections
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; nt=w.node_tree; bg=nt.nodes['Background']; bg.inputs[0].default_value=(0.9,0.92,1.0,1); bg.inputs[1].default_value=0.25
# lights
def area(loc,rot,energy,size,color=(1,1,1)):
    bpy.ops.object.light_add(type='AREA',location=loc,rotation=rot); L=bpy.context.object; L.data.energy=energy; L.data.size=size; L.data.color=color; return L
area((-3,-4,5),(math.radians(50),0,math.radians(-30)),900,4)
area((4,-2,3),(math.radians(70),0,math.radians(60)),500,3,(0.8,0.9,1))
area((0,5,3),(math.radians(-110),0,0),400,5,(1,0.9,0.8))
# camera
bpy.ops.object.camera_add(location=(4.6,-7.0,3.0)); cam=bpy.context.object; sc.camera=cam; cam.data.lens=44
tgt=Vector((0.0,0.0,0.85)); d=tgt-cam.location; cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
bpy.context.view_layer.update()
# screen corners (world) -> pixels
mw=scr.matrix_world; corners=[mw@Vector(v) for v in [(-0.5,0.5,0),(0.5,0.5,0),(0.5,-0.5,0),(-0.5,-0.5,0)]]  # TL,TR,BR,BL in local (y up of lid local = away from hinge? checked by render)
quad=[]
for v in corners:
    p=world_to_camera_view(sc,cam,v); quad.append([round(p.x*W,2),round((1-p.y)*H,2)])
json.dump(dict(W=W,H=H,quad=quad),open('laptop.json','w'))
sc.render.filepath=os.path.abspath('laptop.png'); bpy.ops.render.render(write_still=True); print('QUAD',quad)
