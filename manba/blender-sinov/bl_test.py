import bpy, math, time, sys
samples=int(sys.argv[1]); res=float(sys.argv[2]); out=sys.argv[3]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=samples
sc.cycles.use_denoising=True
try: sc.cycles.denoiser='OPENIMAGEDENOISE'
except Exception as e: print('denoiser',e)
sc.render.resolution_x=int(1080*res); sc.render.resolution_y=int(1920*res); sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'; sc.render.filepath=__import__('os').path.abspath(out)
sc.view_settings.view_transform='AgX' if 'AgX' in [v.identifier for v in bpy.types.ColorManagedViewSettings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
# world
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']; bg.inputs[0].default_value=(0.01,0.008,0.03,1); bg.inputs[1].default_value=1.0
# floor
bpy.ops.mesh.primitive_plane_add(size=30,location=(0,0,-1.4)); fl=bpy.context.object
m=bpy.data.materials.new('floor'); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value=(0.02,0.02,0.06,1); b.inputs['Metallic'].default_value=0.6; b.inputs['Roughness'].default_value=0.12
fl.data.materials.append(m)
# phone body
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,0)); ph=bpy.context.object; ph.scale=(1.34,0.16,2.7)
bev=ph.modifiers.new('b','BEVEL'); bev.width=0.12; bev.segments=6
sub=ph.modifiers.new('s','SUBSURF'); sub.levels=1
bm=bpy.data.materials.new('body'); bm.use_nodes=True; b=bm.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value=(0.05,0.05,0.07,1); b.inputs['Metallic'].default_value=1; b.inputs['Roughness'].default_value=0.2
ph.data.materials.append(bm)
# screen with emission texture
bpy.ops.mesh.primitive_plane_add(size=1,location=(0,-0.085,0),rotation=(math.pi/2,0,0)); sr=bpy.context.object; sr.scale=(1.22,2.44,1)
sm=bpy.data.materials.new('scr'); sm.use_nodes=True; nt=sm.node_tree; nt.nodes.clear()
tex=nt.nodes.new('ShaderNodeTexImage'); tex.image=bpy.data.images.load('//screen.png' if False else __import__('os').path.abspath('screen.png'))
em=nt.nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value=1.0; out_=nt.nodes.new('ShaderNodeOutputMaterial')
nt.links.new(tex.outputs['Color'],em.inputs['Color']); nt.links.new(em.outputs[0],out_.inputs[0])
sr.data.materials.append(sm)
# lights
for loc,col,pw in [((3,-3,3),(1,0.45,0.3),900),((-3.5,-2.5,1),(0.4,0.3,1),700)]:
    bpy.ops.object.light_add(type='AREA',location=loc); L=bpy.context.object; L.data.energy=pw; L.data.color=col; L.data.size=2.5
    L.rotation_euler=(math.radians(70),0,math.radians(30 if loc[0]>0 else -30))
# camera with DOF
bpy.ops.object.camera_add(location=(1.6,-6.2,0.6),rotation=(math.radians(88),0,math.radians(14))); cam=bpy.context.object; sc.camera=cam
cam.data.lens=50; cam.data.dof.use_dof=True; cam.data.dof.focus_object=ph; cam.data.dof.aperture_fstop=2.0
ph.rotation_euler=(0,0,math.radians(-18))
sr.rotation_euler=(math.pi/2,0,math.radians(-18)); sr.location=(0.085*math.sin(math.radians(18))*0+0.0,-0.085,0)
t0=time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SEC',round(time.time()-t0,1),'samples',samples,'size',sc.render.resolution_x,sc.render.resolution_y)
