SCENES=[
 dict(id='hook', say="Dasturlashni endi boshlayapsizmi? Bu video aynan siz uchun! Har bir sayt aynan uchta narsadan iborat. Shuni bilsangiz, o'zingiz sayt yasay olasiz!"),
 dict(id='html', say="Birinchi: HTML. Bu skelet. U sahifada nima borligini aytadi: sarlavha, matn, tugma."),
 dict(id='css', say="Ikkinchi: CSS. Bu kiyim. Rang, shrift va joylashuvni belgilaydi."),
 dict(id='js', say="Uchinchi: JavaScript. Bu harakat. Tugma bosilganda nima bo'lishini belgilaydi."),
 dict(id='cta', say="Skelet, kiyim va harakat: har bir sayt shu uchtadan iborat. Saqlab qo'ying. Keyingi videoda: tugma bosilganda ma'lumot qayerga ketadi?"),
]
CODE=dict(
 html=["<h1>Mening saytim</h1>","<p>Salom, dunyo!</p>","<button>Bos</button>"],
 css=["body { background: #1b1340; color: white; }","h1 { color: #ffd166; }","button { background: #ff6b6b; border-radius: 30px; }"],
 js=["tugma.onclick = () => {","  matn.textContent = 'Tugma bosildi!';","};"])
CPS=dict(html=26,css=42,js=28)
HOOK=["Dasturlashni endi boshlayapsizmi? Bu video aynan siz uchun!","Har bir sayt aynan uchta narsadan iborat. Shuni bilsangiz, o'zingiz sayt yasay olasiz!"]
