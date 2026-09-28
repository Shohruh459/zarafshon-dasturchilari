#!/usr/bin/env python3
"""
Uzbek voice-over for the Milano Foods ad (Madina). One MP3 per line to voice/.
Start times are VOICE in audio.js, in sync with scene.html.

Usage:  SSL_CERT_FILE=... python3 video/milano/voice.py
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'quran', 'common'))
from tts import synthesize  # noqa: E402

LINES = {
    'hook': 'Qorningiz ochdimi?',
    'logo': 'Milano Foods — pitsa, burger va sushi.',
    'combo': 'Katta davra uchun kombo — bir yuz toʻqson toʻqqiz ming soʻm.',
    'reviews': 'Mijozlarimiz fikri.',
    'cta': 'Buyurtma bering — shahar boʻylab yetkazib beramiz.',
}

synthesize(LINES, os.path.join(HERE, 'voice'), rate='+0%')
