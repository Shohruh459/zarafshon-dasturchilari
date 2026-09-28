"""
Builds ayat.json (the Qur'an text used by the videos) from the quran-json
package: Uthmani text of the King Fahd Complex (via quranenc.com), CC BY-SA 4.0.

That text is encoded for the KFGQPC Uthmanic Hafs font, which repurposes a few
code points. Other fonts (Amiri Quran) draw those as different marks, so they
are mapped to their standard Unicode equivalents here:
  U+0656 -> U+08F2  open (staggered) kasratan
  U+0657 -> U+08F0  open fathatan
  U+065E -> U+08F1  open dammatan
  U+0652 -> U+06DF  small high rounded zero (letter written but not pronounced);
                    ordinary sukun in this text is already U+06E1

Usage:  python3 video/quran/build_ayat.py
Add a verse by listing it in AYAT; a fragment is (surah, ayah, first_word, last_word).
"""
import glob
import json
import os
import subprocess
import tempfile

KFGQPC_TO_UNICODE = str.maketrans({'ٖ': 'ࣲ', 'ٗ': 'ࣰ', 'ٞ': 'ࣱ', 'ْ': '۟'})

AYAT = {                         # key -> (surah, ayah, first word index, last word index or None)
    '51:47': (51, 47, 0, None),
    '17:85': (17, 85, 0, None),
    '17:85-fragment': (17, 85, 8, None),     # «وَمَآ أُوتِيتُم مِّنَ ٱلۡعِلۡمِ إِلَّا قَلِيلٗا»
    '24:40': (24, 40, 0, None),
    '24:40-fragment': (24, 40, 0, 22),       # up to «لَمۡ يَكَدۡ يَرَىٰهَاۗ»
    '55:19': (55, 19, 0, None),
    '55:20': (55, 20, 0, None),
    '25:53': (25, 53, 0, None),
    '16:68': (16, 68, 0, None),
    '16:69-a': (16, 69, 0, 8),               # «ثُمَّ كُلِي … ذُلُلٗاۚ»
    '16:69-b': (16, 69, 9, 14),              # «يَخۡرُجُ … أَلۡوَٰنُهُۥ»
    '16:69-c': (16, 69, 15, 17),             # «فِيهِ شِفَآءٞ لِّلنَّاسِۚ»
    '16:69-d': (16, 69, 18, 23),             # «إِنَّ فِي ذَٰلِكَ … يَتَفَكَّرُونَ»
    '16:68-ittakhidhi': (16, 68, 5, 5),      # feminine imperatives addressed to the bee
    '16:69-kuli': (16, 69, 1, 1),
    '16:69-fasluki': (16, 69, 5, 5),
    '57:25-hadid': (57, 25, 11, 17),         # «وَأَنزَلۡنَا ٱلۡحَدِيدَ … وَمَنَٰفِعُ لِلنَّاسِ»
    '57:25-anzalna': (57, 25, 11, 12),       # «وَأَنزَلۡنَا ٱلۡحَدِيدَ»
    '57:25-fihi': (57, 25, 13, 17),          # «فِيهِ بَأۡسٞ شَدِيدٞ وَمَنَٰفِعُ لِلنَّاسِ»
}

here = os.path.dirname(os.path.abspath(__file__))
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['npm', 'pack', 'quran-json@3.1.2', '--silent'], cwd=tmp, check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['tar', 'xzf', glob.glob(os.path.join(tmp, '*.tgz'))[0], '-C', tmp], check=True)
    quran = json.load(open(os.path.join(tmp, 'package', 'dist', 'quran.json'), encoding='utf-8'))

out = {}
for key, (s, a, first, last) in AYAT.items():
    words = next(v['text'] for v in quran[s - 1]['verses'] if v['id'] == a).split(' ')
    out[key] = ' '.join(words[first:None if last is None else last + 1]).translate(KFGQPC_TO_UNICODE)

json.dump({'source': 'quran-json 3.1.2 (CC BY-SA 4.0): Uthmani text of the King Fahd Complex via quranenc.com; '
                     'KFGQPC-specific marks mapped to standard Unicode (see build_ayat.py)',
           'ayat': out}, open(os.path.join(here, 'ayat.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(f'{k}: {v}' for k, v in out.items()))
