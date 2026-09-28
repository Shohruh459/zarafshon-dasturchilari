#!/usr/bin/env python3
"""
Uzbek voice-over for "Temir" (Madina). One MP3 per line to voice/.
Start times are VOICE in audio.js, in sync with scene.html.
Meaning of the ayah follows Tafsiri Hilol — CHECK AGAINST THE BOOK.

Usage:  SSL_CERT_FILE=... python3 video/quran/05-temir/voice.py
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'common'))
from tts import synthesize  # noqa: E402

LINES = {
    'hook': 'Qurʼon temir haqida «tushirdik» deydi. Temir qayerdan kelgan?',
    'ayah': 'Va temirni tushirdik. Unda qattiq kuch va odamlar uchun manfaatlar bor.',
    'core': 'Ogʻir yulduzlar yadrosida elementlar birin-ketin hosil boʻladi. Zanjir temirda toʻxtaydi: undan keyingi sintez energiya bermaydi.',
    'heat': 'Buning uchun milliardlab daraja kerak. Quyoshimiz hech qachon temir hosil qila olmaydi.',
    'nova': 'Yadro qulaydi, yulduz portlaydi — va temir koinotga sochiladi.',
    'earth': 'Yer massasining qariyb uchdan bir qismi temir. Uning yadrosi asosan temir va nikeldan iborat.',
    'blood': 'Qonimizdagi temir esa nafas olgan kislorodimizni butun tanaga tashiydi.',
    'close': 'Alloh bilguvchiroq.',
}

synthesize(LINES, os.path.join(HERE, 'voice'))
