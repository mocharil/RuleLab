"""Synthesize music bed + SFX from cues, duck under the voice-over, write out/mix.wav.

Usage: python audio.py   (needs numpy; ffmpeg on PATH; run render.cjs first for out/cues.json)
"""
import json, pathlib, subprocess, wave
import numpy as np

HERE = pathlib.Path(__file__).parent
OUT = HERE / 'out'
SR = 48000
TL = json.loads((HERE / 'audio' / 'clips.json').read_text(encoding='utf-8'))
CUES = json.loads((OUT / 'cues.json').read_text(encoding='utf-8'))
TOTAL = TL['total']
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
SCENE = {s['id']: (s['start'], s['end']) for s in TL['scenes']}


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def place(buf, t0, sig, gain=1.0):
    i = int(t0 * SR)
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i] * gain


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):  # short signals only
        acc = (1 - a) * x[k] + a * acc
        y[k] = acc
    return y


def env(n, attack, release):
    e = np.ones(n)
    a, r = int(attack * SR), int(release * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r) ** 2
    return e


# ---------------- music ----------------
def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
music = np.zeros(N)
first_vo = {s['id']: s['lines'][0]['t'] for s in TL['scenes']}
beat_start = first_vo['reveal'] - 0.35          # groove kicks in with "Meet RuleLab"
groove_end = SCENE['close'][0] + 0.6
t_all = np.arange(N) / SR

# pad: additive, slowly breathing, one chord per 2 bars
seg = 2 * BAR
for k in range(int(TOTAL / seg) + 2):
    t0 = k * seg
    chord = CHORDS[k % 4]
    if t0 > SCENE['close'][0] + 6:
        chord = CHORDS[0]
    x = tt(seg + 1.2)
    sig = np.zeros_like(x)
    for m in chord + [chord[0] - 12]:
        f = note(m)
        for h, amp in ((1, 1.0), (2, 0.35), (3, 0.16), (4, 0.07)):
            for det in (-0.0018, 0.0018):
                sig += amp * np.sin(2 * np.pi * f * h * (1 + det) * x + rng.uniform(0, 6.28))
    sig *= env(len(x), 1.2, 1.4) * (0.85 + 0.15 * np.sin(2 * np.pi * x / seg))
    place(music, t0, sig, 0.012)

# kick, hats and pluck arpeggio during the product part
kick_t = tt(0.32)
kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kick_t * 30)) * kick_t) * np.exp(-kick_t * 11)
hat_t = tt(0.05)
hat = rng.standard_normal(len(hat_t)) * np.exp(-hat_t * 90)
hat = hat - lowpass(hat, 6000)
pl_t = tt(0.5)
b = beat_start
i = 0
while b < groove_end:
    bar_beat = i % 4
    ramp = min(1.0, (b - beat_start) / 4)
    if bar_beat in (0, 2):
        place(music, b, kick, 0.33 * ramp)
    place(music, b + BEAT / 2, hat, 0.05 * ramp)
    chord = CHORDS[int(b / seg) % 4]
    for half in (0, 1):
        m = chord[(i * 2 + half) % 3] + 12
        f = note(m)
        pl = (np.sin(2 * np.pi * f * pl_t) + 0.3 * np.sin(4 * np.pi * f * pl_t)) * np.exp(-pl_t * 9)
        place(music, b + half * BEAT / 2, pl, 0.022 * ramp)
    b += BEAT
    i += 1

# music level shaping: quiet hook, lift at reveal, settle, fade at end
lvl = np.interp(t_all, [0, 2, SCENE['reveal'][0], first_vo['reveal'], SCENE['close'][1] - 4, SCENE['close'][1]],
                [0.0, 0.8, 0.9, 1.0, 1.0, 0.0])
music *= lvl

# ---------------- SFX ----------------
sfx = np.zeros(N)


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def s_whoosh():
    x = noise(0.55)
    e = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    return (lowpass(x, 1800) - lowpass(x, 300)) * e * 1.6


def s_pop():
    x = tt(0.09)
    return np.sin(2 * np.pi * (900 - 3000 * x) * x) * np.exp(-x * 45)


def s_tick():
    x = tt(0.035)
    return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 140)


def s_click():
    x = tt(0.03)
    return (np.sin(2 * np.pi * 1500 * x) * 0.7 + noise(0.03) * 0.3) * np.exp(-x * 160)


def s_stamp():
    x = tt(0.28)
    return np.sin(2 * np.pi * (95 + 60 * np.exp(-x * 25)) * x) * np.exp(-x * 13) + lowpass(noise(0.28), 900) * np.exp(-x * 30) * 0.8


def s_impact():
    x = tt(0.9)
    return np.sin(2 * np.pi * (42 + 40 * np.exp(-x * 9)) * x) * np.exp(-x * 4.5) + lowpass(noise(0.9), 400) * np.exp(-x * 7) * 0.5


def s_swell():
    x = noise(1.0)
    e = np.linspace(0, 1, len(x)) ** 3
    return (lowpass(x, 3000) - lowpass(x, 500)) * e * 1.2


SFX = {'whoosh': (s_whoosh, 0.18, -0.25), 'pop': (s_pop, 0.16, 0), 'tick': (s_tick, 0.10, 0), 'click': (s_click, 0.22, 0),
       'stamp': (s_stamp, 0.32, 0), 'impact': (s_impact, 0.40, 0), 'swell': (s_swell, 0.14, -1.0)}
cache = {}
for c in CUES:
    k, t = c['k'], c['t']
    if k == 'type':
        tc = t
        while tc < t + c.get('d', 1):
            place(sfx, tc, s_click() * rng.uniform(0.5, 1), 0.07)
            tc += rng.uniform(0.045, 0.085)
    elif k == 'count':
        for j in range(14):
            place(sfx, t + j * c.get('d', 1) / 14, s_tick(), 0.05)
    elif k == 'scan':
        x = tt(c.get('d', 1.5))
        sig = np.sin(2 * np.pi * (300 + 500 * x / x[-1]) * x) * np.sin(np.linspace(0, np.pi, len(x))) * 0.5
        place(sfx, t, sig, 0.05)
    elif k in SFX:
        fn, g, off = SFX[k]
        if k not in cache:
            cache[k] = fn()
        place(sfx, t + off, cache[k], g)

# ---------------- voice ----------------
vo = np.zeros(N)
for clip in TL['clips']:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(HERE / 'audio' / clip['file']), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    place(vo, clip['t'], np.frombuffer(raw, dtype=np.float32).astype(np.float64), 1.0)

# duck music under the voice (smoothed envelope)
win = int(0.25 * SR)
cs = np.concatenate([[0], np.cumsum(np.abs(vo))])
idx = np.arange(N)
venv = (cs[np.minimum(idx + win // 2, N)] - cs[np.maximum(idx - win // 2, 0)]) / win
duck = 1 - 0.55 * np.clip(venv / 0.04, 0, 1)
mix = music * duck * 1.0 + sfx + vo * 0.95
mix = mix[: int(TOTAL * SR)]
peak = np.max(np.abs(mix))
mix = mix / max(peak, 1e-9) * 0.89
stereo = np.stack([mix, mix], axis=1)
with wave.open(str(OUT / 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((stereo * 32767).astype('<i2').tobytes())
print('mix.wav', round(TOTAL, 2), 's, peak', round(float(peak), 3))
