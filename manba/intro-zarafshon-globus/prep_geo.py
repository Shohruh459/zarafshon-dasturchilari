# Natural Earth (GitHub raw) -> geo.json (O'zbekiston, viloyatlar, daryolar, shaharlar, dunyo chegaralari)
import json, urllib.request
from shapely.geometry import LineString
B='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
def get(n):
    with urllib.request.urlopen(B+n,timeout=300) as r: return json.load(r)
def rings(g):
    polys=[g['coordinates']] if g['type']=='Polygon' else g['coordinates'] if g['type']=='MultiPolygon' else []
    return [r for p in polys for r in p]
def lines(g): return [g['coordinates']] if g['type']=='LineString' else g['coordinates'] if g['type']=='MultiLineString' else []
def simp(c,t): return [[round(x,3),round(y,3)] for x,y in LineString(c).simplify(t,preserve_topology=False).coords]
out={}
out['world']=[simp(r,0.05) for f in get('ne_50m_admin_0_countries.geojson')['features'] for r in rings(f['geometry'])]
c=get('ne_10m_admin_0_countries.geojson'); nb=[]
for f in c['features']:
    n=f['properties'].get('NAME'); 
    if n=='Uzbekistan': out['uz']=[simp(r,0.004) for r in rings(f['geometry'])]
    elif n in {'Kazakhstan','Turkmenistan','Afghanistan','Tajikistan','Kyrgyzstan','Iran'}: nb+= [simp(r,0.004) for r in rings(f['geometry'])]
out['neighbors']=nb
out['regions']=[dict(name=f['properties']['name'],rings=[simp(r,0.004) for r in rings(f['geometry'])]) for f in get('ne_10m_admin_1_states_provinces.geojson')['features'] if f['properties'].get('admin')=='Uzbekistan']
out['rivers']=[dict(name=f['properties'].get('name'),line=simp(g,0.004)) for f in get('ne_10m_rivers_lake_centerlines.geojson')['features'] for g in lines(f['geometry']) if max(p[0] for p in g)>55 and min(p[0] for p in g)<75 and max(p[1] for p in g)>36 and min(p[1] for p in g)<46]
want={'Zarafshon','Tashkent','Samarkand','Bukhara','Navoi','Nukus','Fargona','Urgentch','Termiz','Qarshi'}
out['places']=[dict(name=f['properties']['name'],lon=f['geometry']['coordinates'][0],lat=f['geometry']['coordinates'][1]) for f in get('ne_10m_populated_places_simple.geojson')['features'] if f['properties']['name'] in want and f['properties'].get('adm0name')=='Uzbekistan']
json.dump(out,open('geo.json','w'),separators=(',',':'))
