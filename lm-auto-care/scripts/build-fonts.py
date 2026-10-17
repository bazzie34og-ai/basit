"""Rebuild the static, latin-subset woff2 files in public/fonts/ from the
@fontsource variable fonts. Run once after changing weights:
    pip install fonttools brotli && python3 scripts/build-fonts.py
Variable fonts were ~550 KB; these seven static cuts are ~100 KB together."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

A = 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-%s.woff2'
S = 'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-%s.woff2'
JOBS = [
    (A % 'italic', {'wdth': 125, 'wght': 800}, 'archivo-expanded-800-italic'),
    (A % 'normal', {'wdth': 125, 'wght': 800}, 'archivo-expanded-800'),
    (A % 'normal', {'wdth': 100, 'wght': 600}, 'archivo-600'),
    (A % 'normal', {'wdth': 100, 'wght': 700}, 'archivo-700'),
    (S % 'normal', {'opsz': 18, 'wght': 400}, 'source-serif-400'),
    (S % 'italic', {'opsz': 18, 'wght': 400}, 'source-serif-400-italic'),
    (S % 'normal', {'opsz': 18, 'wght': 600}, 'source-serif-600'),
]
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x180)) + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC,
    0x2190, 0x2191, 0x2192, 0x2193, 0x2713, 0x2122, 0x25B4, 0x25BE, 0x00D7]

for src, loc, name in JOBS:
    font = TTFont(src)
    axes = {a.axisTag for a in font['fvar'].axes}
    inst = instantiateVariableFont(font, {k: v for k, v in loc.items() if k in axes})
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'calt', 'tnum', 'lnum', 'case']
    opts.name_IDs = ['*']
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(inst)
    inst.flavor = 'woff2'
    out = f'public/fonts/{name}.woff2'
    inst.save(out)
    print(name, os.path.getsize(out))
