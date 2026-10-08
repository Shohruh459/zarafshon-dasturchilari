SC=[
 dict(id='hook',parts=["Kelishganimizdek, bugun Claude bilan birinchi sahifa yasashni o'rganamiz.","Bo'sh ekrandan tayyor sahifagacha."],gaps=[0.2]),
 dict(id='sorov',parts=["Avval Claude'ga aniq yozamiz: nima kerak, nechta qism, qaysi format.","Qanchalik aniq bo'lsa, natija shunchalik yaxshi."],gaps=[0.2]),
 dict(id='kod',parts=["Claude kod yozadi.","Uch qism ko'rinadi: sarlavha, matn va tugma.","Kodni o'qib chiqing, tushunmagan joyni so'rang."],gaps=[0.2,0.2]),
 dict(id='ochish',parts=["Kodni index.html nomi bilan saqlang va brauzerda oching.","Sahifa tayyor. Tugmani bosib ko'ring."],gaps=[0.2]),
 dict(id='ozgar',parts=["Yoqmasa, yana so'rang: tugmani yashil qil."],gaps=[]),
 dict(id='cta',parts=["Xulosa: aniq so'rov yozing, kodni o'qing, faylga saqlang.","Saqlab qo'ying.","Keyingi videoda: sahifani telefonga qanday moslaymiz?"],gaps=[0.2,0.25]) ]
# Sahifa kodi: videoda ko'rsatiladigan va brauzerda render qilinadigan kod BIR XIL (bitta manba)
CSS_BTN="    button{font-size:28px;padding:12px 28px}"
CSS_BTN2="    button{font-size:28px;padding:12px 28px;background:#12B76A;color:#fff;border:0;border-radius:12px}"
def page(v2=False):
    return "\n".join([
'<!DOCTYPE html>','<html>','<head>','  <meta charset="UTF-8">','  <style>',
'    body{font:28px sans-serif;text-align:center}',
CSS_BTN2 if v2 else CSS_BTN,
'  </style>','</head>','<body>',
'  <h1>Salom, men Ali!</h1>',
'  <p>Bu mening birinchi sahifam.</p>',
'  <button id="b">Bosing</button>',
'  <script>',
'    b.onclick = () => b.textContent = "Rahmat!";',
'  </script>','</body></html>'])
