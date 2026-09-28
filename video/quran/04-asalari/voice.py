#!/usr/bin/env python3
"""
Uzbek voice-over for "Asalari" with Microsoft Edge neural TTS (pip install edge-tts).
Writes one MP3 per line to voice/ (committed, so rendering needs no network).

In the text, oʻ/gʻ use U+02BB (ʻ) and the glottal stop U+02BC (ʼ): with a
plain apostrophe the voice reads "yig'adigan" as "yigadigan".
Meanings of the ayat follow Tafsiri Hilol — CHECK AGAINST THE BOOK.

Usage:  python3 video/quran/04-asalari/voice.py [--voice uz-UZ-MadinaNeural --out voice-madina]
"""
import os
import sys

VOICE = sys.argv[sys.argv.index('--voice') + 1] if '--voice' in sys.argv else 'uz-UZ-SardorNeural'
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'voice'
RATE = '-4%'

# key -> text; start times are VOICE in audio.js, in sync with scene.html.
LINES = {
    'hook': 'Qurʼon asalariga ayol shaklida murojaat qiladi. Nega?',
    'a68': 'Robbing asalariga: togʻlardan, daraxtlardan uylar tutgin, deb vahiy qildi.',
    'a69': 'Soʻngra barcha mevalardan yegin, va Robbingning yoʻllaridan yurgin.',
    'fem': 'Uchala buyruq ham arab tilida ayol shaklida. Uya quradigan, asal yigʻadigan ishchi asalarilar esa — barchasi urgʻochi.',
    'colors': 'Uning qornidan turli rangdagi sharob chiqadi. Asal rangi gul shirasiga bogʻliq.',
    'shifo': 'Unda odamlar uchun shifo bor. Asal mikroblarga qarshi kurashadi.',
    'close': 'Albatta, bunda tafakkur qiladigan qavm uchun oyat bor.',
}


sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'common'))
from tts import synthesize  # noqa: E402

synthesize(LINES, os.path.join(os.path.dirname(os.path.abspath(__file__)), OUT), voice=VOICE, rate=RATE)
