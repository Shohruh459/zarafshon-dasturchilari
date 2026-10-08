SC=[
 dict(id='hook',parts=["Kelishganimizdek, bugun sahifani telefonga moslashni o'rganamiz.","Oldin va keyin."],gaps=[0.2]),
 dict(id='muammo',parts=["Telefon ekrani kichik.","Kompyuter uchun yozilgan sahifa u yerda mayda bo'lib qoladi."],gaps=[0.2]),
 dict(id='q1',parts=["Birinchi qadam: bitta qator.","Bu qator telefonga aytadi: ekran kengligiga moslash."],gaps=[0.2]),
 dict(id='q2',parts=["Ikkinchi qadam: qattiq o'lcham yoniga moslashuvchan o'lcham.","width yoniga max-width yozing."],gaps=[0.2]),
 dict(id='q3',parts=["Uchinchi qadam: ekran tor bo'lsa, boshqa qoida.","Kartalar bir-birining tagida turadi."],gaps=[0.2]),
 dict(id='cta',parts=["Xulosa: viewport, max-width va media.","Saqlab qo'ying.","Keyingi videoda: tugma bosilganda nima bo'lishini o'rganamiz!"],gaps=[0.2,0.25]) ]
# Haqiqiy sahifa: videoda ko'rsatiladigan kod va telefonda render qilinadigan kod BIR XIL manba
VIEW=['  <meta name="viewport"','        content="width=device-width,','        initial-scale=1">']
PIC_OLD=['    .pic{','      width:600px;','      height:140px;','      background:#6366F1}']
PIC_NEW=['    .pic{','      width:600px;','      max-width:100%;','      height:140px;','      background:#6366F1}']
MEDIA=['    @media (max-width:600px){','      .cards{flex-direction:column}','    }']
def page(level):
    """level 0: oldin (viewport yo'q); 1: +viewport; 2: +max-width; 3: +@media"""
    L=['<!DOCTYPE html>','<html>','<head>','  <meta charset="UTF-8">']
    if level>=1: L+=VIEW
    L+=['  <style>','    body{font-family:sans-serif;margin:0;padding:24px}']+(PIC_NEW if level>=2 else PIC_OLD)
    L+=['    .cards{display:flex;gap:12px;margin-top:16px}',
        '    .card{flex:1;background:#EEF2FF;padding:18px 10px;border-radius:12px;font-size:20px;text-align:center}']
    if level>=3: L+=MEDIA
    L+=['  </style>','</head>','<body>','  <h1>Mening sahifam</h1>','  <div class="pic"></div>','  <div class="cards">',
        '    <div class="card">Frontend</div>','    <div class="card">Backend</div>','    <div class="card">Baza</div>','  </div>','</body></html>']
    return "\n".join(L)
