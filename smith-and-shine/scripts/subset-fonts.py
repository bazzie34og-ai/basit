"""Rebuild public/fonts/fraunces-*.woff2 from the Fontsource package.
Keeps the opsz + wght axes, drops every character the site doesn't use.
Needs: pip install fonttools brotli.  Run: python3 scripts/subset-fonts.py"""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

U = list(range(0x20, 0x7F)) + [0xA0, 0xA3, 0xB7, 0xD7, 0xE9, 0x2013, 0x2014, 0x2018, 0x2019,
                               0x201C, 0x201D, 0x2026, 0x2022, 0x2605, 0x2192]
for style, wght in [('normal', (400, 800)), ('italic', (400, 700))]:
    f = TTFont(f'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-{style}.woff2')
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'calt', 'lnum', 'pnum']
    opts.name_IDs = ['*']
    s = subset.Subsetter(opts)
    s.populate(unicodes=U)
    s.subset(f)
    f = instantiateVariableFont(f, {'opsz': (36, 144), 'wght': wght})
    f.flavor = 'woff2'
    f.save(f'public/fonts/fraunces-{style}.woff2')
