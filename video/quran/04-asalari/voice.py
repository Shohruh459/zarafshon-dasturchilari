#!/usr/bin/env python3
"""
Uzbek voice-over for "Asalari" with Microsoft Edge neural TTS (pip install edge-tts).
Writes one MP3 per line to voice/ (committed, so rendering needs no network).

In the text, oʻ/gʻ use U+02BB (ʻ) and the glottal stop U+02BC (ʼ): with a
plain apostrophe the voice reads "yig'adigan" as "yigadigan".
Meanings of the ayat follow Tafsiri Hilol — CHECK AGAINST THE BOOK.

Usage:  python3 video/quran/04-asalari/voice.py [--voice uz-UZ-MadinaNeural]
"""
import asyncio
import os
import sys

VOICE = sys.argv[sys.argv.index('--voice') + 1] if '--voice' in sys.argv else 'uz-UZ-SardorNeural'
RATE = '-4%'

# key -> text; start times live in render.js (LINES), in sync with scene.html.
LINES = {
    'hook': 'Qurʼon asalariga ayol shaklida murojaat qiladi. Nega?',
    'a68': 'Robbing asalariga: togʻlardan, daraxtlardan uylar tutgin, deb vahiy qildi.',
    'a69': 'Soʻngra barcha mevalardan yegin, va Robbingning yoʻllaridan yurgin.',
    'fem': 'Uchala buyruq ham arab tilida ayol shaklida. Uya quradigan, asal yigʻadigan ishchi asalarilar esa — barchasi urgʻochi.',
    'colors': 'Uning qornidan turli rangdagi sharob chiqadi. Asal rangi gul shirasiga bogʻliq.',
    'shifo': 'Unda odamlar uchun shifo bor. Asal mikroblarga qarshi kurashadi.',
    'close': 'Albatta, bunda tafakkur qiladigan qavm uchun oyat bor.',
}


async def main():
    import certifi
    ca = os.environ.get('SSL_CERT_FILE')
    if ca:  # behind a TLS-inspecting proxy edge-tts must trust its CA
        certifi.where = lambda: ca
    import edge_tts
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voice')
    os.makedirs(out, exist_ok=True)
    for key, text in LINES.items():
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(os.path.join(out, f'{key}.mp3'))
        print('wrote', key)

asyncio.run(main())
