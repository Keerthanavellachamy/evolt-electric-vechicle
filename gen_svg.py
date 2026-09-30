import os

def bg(idc):
    return f'''<defs>
  <radialGradient id="glow{idc}" cx="50%" cy="55%" r="60%">
    <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#000814" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="floor{idc}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1420"/>
    <stop offset="100%" stop-color="#000000"/>
  </linearGradient>
  <linearGradient id="body{idc}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1a2530"/>
    <stop offset="50%" stop-color="#0d1520"/>
    <stop offset="100%" stop-color="#050a10"/>
  </linearGradient>
</defs>
<rect width="800" height="500" fill="url(#floor{idc})"/>
<ellipse cx="400" cy="430" rx="360" ry="40" fill="url(#glow{idc})"/>
<ellipse cx="400" cy="440" rx="260" ry="18" fill="#00f0ff" opacity="0.15"/>'''

def bike(idc, accent):
    return f'''<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EVOLT electric bike studio render">
{bg(idc)}
<g transform="translate(150,150)">
  <circle cx="80" cy="260" r="70" fill="none" stroke="#1c2a36" stroke-width="14"/>
  <circle cx="420" cy="260" r="70" fill="none" stroke="#1c2a36" stroke-width="14"/>
  <circle cx="80" cy="260" r="70" fill="none" stroke="{accent}" stroke-width="3" opacity="0.8"/>
  <circle cx="420" cy="260" r="70" fill="none" stroke="{accent}" stroke-width="3" opacity="0.8"/>
  <path d="M80 260 L200 150 L300 150 L420 260" stroke="url(#body{idc})" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M200 150 L230 90 L280 90" stroke="url(#body{idc})" stroke-width="14" fill="none" stroke-linecap="round"/>
  <rect x="150" y="140" width="130" height="30" rx="10" fill="url(#body{idc})"/>
  <circle cx="230" cy="88" r="10" fill="{accent}" opacity="0.9"/>
  <rect x="60" y="250" width="40" height="8" rx="4" fill="{accent}" opacity="0.7"/>
</g>
<text x="400" y="470" text-anchor="middle" font-family="Arial" font-size="14" fill="#5fb8c9" opacity="0.6">EVOLT MOTORS — STUDIO RENDER</text>
</svg>'''

def auto(idc, accent):
    return f'''<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EVOLT electric auto studio render">
{bg(idc)}
<g transform="translate(180,140)">
  <rect x="0" y="120" width="360" height="140" rx="30" fill="url(#body{idc})"/>
  <rect x="30" y="40" width="300" height="100" rx="24" fill="url(#body{idc})"/>
  <rect x="50" y="55" width="260" height="55" rx="10" fill="#0b141d" stroke="{accent}" stroke-width="2" opacity="0.7"/>
  <circle cx="70" cy="270" r="45" fill="#111a22" stroke="{accent}" stroke-width="3"/>
  <circle cx="290" cy="270" r="45" fill="#111a22" stroke="{accent}" stroke-width="3"/>
  <rect x="-10" y="150" width="20" height="60" rx="8" fill="{accent}" opacity="0.85"/>
  <rect x="350" y="150" width="20" height="60" rx="8" fill="{accent}" opacity="0.85"/>
</g>
<text x="400" y="470" text-anchor="middle" font-family="Arial" font-size="14" fill="#5fb8c9" opacity="0.6">EVOLT MOTORS — STUDIO RENDER</text>
</svg>'''

def car(idc, accent):
    return f'''<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EVOLT electric car studio render">
{bg(idc)}
<g transform="translate(90,150)">
  <path d="M20 200 Q10 120 120 100 L200 60 Q260 40 340 60 L470 100 Q600 120 600 200 L600 220 Q600 240 580 240 L40 240 Q20 240 20 220 Z" fill="url(#body{idc})"/>
  <path d="M170 100 Q220 70 320 70 Q400 70 450 100 L420 100 Q380 82 300 82 Q230 82 200 100 Z" fill="#0b141d" stroke="{accent}" stroke-width="2" opacity="0.75"/>
  <circle cx="140" cy="245" r="48" fill="#0d151d" stroke="{accent}" stroke-width="3"/>
  <circle cx="480" cy="245" r="48" fill="#0d151d" stroke="{accent}" stroke-width="3"/>
  <rect x="15" y="150" width="30" height="12" rx="6" fill="{accent}"/>
  <rect x="565" y="150" width="30" height="12" rx="6" fill="{accent}" opacity="0.8"/>
  <rect x="10" y="180" width="20" height="8" rx="4" fill="{accent}" opacity="0.9"/>
</g>
<text x="400" y="470" text-anchor="middle" font-family="Arial" font-size="14" fill="#5fb8c9" opacity="0.6">EVOLT MOTORS — STUDIO RENDER</text>
</svg>'''

items = [
    ("images/bikes/x1.svg", bike, "#00f0ff"),
    ("images/bikes/x2pro.svg", bike, "#39ff9d"),
    ("images/autos/a1.svg", auto, "#00f0ff"),
    ("images/autos/a2pro.svg", auto, "#39ff9d"),
    ("images/cars/c1.svg", car, "#00f0ff"),
    ("images/cars/c1pro.svg", car, "#39ff9d"),
]
for i,(path, fn, accent) in enumerate(items):
    full = os.path.join("/home/claude/evolt", path)
    with open(full, "w") as f:
        f.write(fn(i, accent))
    print("wrote", full)

# hero banner
hero = f'''<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EVOLT hero electric car glowing in dark studio">
{bg(99).replace("800 500","1200 800").replace("400 430","600 700").replace("400 440","600 700")}
{car(99, "#00f0ff").split(">",1)[1].replace("<svg","<g").replace("</svg>","</g>")}
</svg>'''
with open("/home/claude/evolt/images/banners/hero.svg","w") as f:
    f.write(f'''<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EVOLT hero electric car glowing in a dark cinematic studio">
<defs>
  <radialGradient id="hg" cx="50%" cy="55%" r="65%">
    <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#000814" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="hbody" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#22323f"/>
    <stop offset="50%" stop-color="#0d1520"/>
    <stop offset="100%" stop-color="#050a10"/>
  </linearGradient>
</defs>
<rect width="1200" height="800" fill="#000000"/>
<ellipse cx="600" cy="680" rx="520" ry="60" fill="url(#hg)"/>
<ellipse cx="600" cy="700" rx="380" ry="24" fill="#00f0ff" opacity="0.18"/>
<g transform="translate(150,260) scale(1.5)">
  <path d="M20 200 Q10 120 120 100 L200 60 Q260 40 340 60 L470 100 Q600 120 600 200 L600 220 Q600 240 580 240 L40 240 Q20 240 20 220 Z" fill="url(#hbody)"/>
  <path d="M170 100 Q220 70 320 70 Q400 70 450 100 L420 100 Q380 82 300 82 Q230 82 200 100 Z" fill="#0b141d" stroke="#00f0ff" stroke-width="2" opacity="0.8"/>
  <circle cx="140" cy="245" r="48" fill="#0d151d" stroke="#00f0ff" stroke-width="3"/>
  <circle cx="480" cy="245" r="48" fill="#0d151d" stroke="#00f0ff" stroke-width="3"/>
  <rect x="15" y="150" width="30" height="12" rx="6" fill="#00f0ff"/>
  <rect x="565" y="150" width="30" height="12" rx="6" fill="#39ff9d" opacity="0.85"/>
</g>
</svg>''')
print("hero done")
