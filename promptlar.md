# Claude bilan sayt yasash — tayyor promptlar

## 1) Videodagi prompt (oddiy)
```
Sushi yetkazib berish uchun chiroyli sayt yasab ber.
```

## 2) Kuchaytirilgan prompt (qavsdagi joylarni o‘zingizniki bilan almashtiring)
```
Men [biznes turi] egasiman. [Shahar] uchun telefonga mos bir sahifali sayt yasab ber. Bo‘limlar: sarlavha, menyu, narxlar, buyurtma tugmasi. Rang: [rang]. Matnlar o‘zbek tilida.
```
Tuzilishi: **Kontekst** (kimligingiz, qayerga) + **Bo‘limlar** (nima bo‘lsin) + **Uslub** (rang, til).

## 3) O‘zgartirish promptlari (sayt tayyor bo‘lgach, birma-bir yuboring)
```
Rangini ko‘k qil.
```
```
Tugmani kattaroq qil.
```
```
Sarlavhani qisqartir.
```

## Saytni qanday ochasiz
1. Promptni Claude’ga yuboring. Claude sahifani ko‘rsatadi yoki kod beradi.
2. Kod bersa, uni `index.html` nomi bilan saqlang (oddiy matn fayli, `.html` kengaytmasi).
3. Faylni brauzerda oching: sayt ishlaydi.
