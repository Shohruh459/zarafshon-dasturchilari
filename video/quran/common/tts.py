"""
Uzbek voice-over with Microsoft Edge neural TTS (pip install edge-tts): one MP3
per line, written to the episode's voice directory and committed, so
rendering needs no network. Used by each episode's voice.py.

Write oʻ/gʻ with U+02BB (ʻ) and the glottal stop with U+02BC (ʼ): with a plain
apostrophe the voice reads "yig'adigan" as "yigadigan".
Behind a TLS-inspecting proxy set SSL_CERT_FILE to its CA bundle.
"""
import asyncio
import os

VOICE = 'uz-UZ-MadinaNeural'   # chosen for the series; uz-UZ-SardorNeural is the male voice
RATE = '-4%'


def synthesize(lines, out_dir, voice=VOICE, rate=RATE):
    import certifi
    ca = os.environ.get('SSL_CERT_FILE')
    if ca:
        certifi.where = lambda: ca
    import edge_tts

    async def run():
        os.makedirs(out_dir, exist_ok=True)
        for key, text in lines.items():
            await edge_tts.Communicate(text, voice, rate=rate).save(os.path.join(out_dir, f'{key}.mp3'))
            print('wrote', key)
    asyncio.run(run())
