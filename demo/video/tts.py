"""Generate voice-over lines (edge-tts) with word timings, then write timeline.js.

Usage: python tts.py   (needs: pip install edge-tts; ffprobe on PATH)
"""
import asyncio, json, pathlib, subprocess
import edge_tts

HERE = pathlib.Path(__file__).parent
AUDIO = HERE / 'audio'
AUDIO.mkdir(exist_ok=True)
SCRIPT = json.loads((HERE / 'script.json').read_text(encoding='utf-8'))


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


async def synth(text, mp3):
    words = []
    comm = edge_tts.Communicate(text, SCRIPT['voice'], rate=SCRIPT['rate'], boundary='WordBoundary')
    with open(mp3, 'wb') as fh:
        async for chunk in comm.stream():
            if chunk['type'] == 'audio':
                fh.write(chunk['data'])
            elif chunk['type'] == 'WordBoundary':
                words.append({'w': chunk['text'], 't': chunk['offset'] / 1e7, 'd': chunk['duration'] / 1e7})
    return words


async def main():
    t = 0.0
    scenes, clips = [], []
    for scene in SCRIPT['scenes']:
        start = t
        t += scene['lead']
        lines = []
        for i, (text, gap) in enumerate(scene['parts']):
            mp3 = AUDIO / f"{scene['id']}-{i}.mp3"
            words = await synth(text, mp3)
            dur = duration(mp3)
            lines.append({'t': round(t, 3), 'd': round(dur, 3), 'text': text,
                          'words': [{**w, 't': round(t + w['t'], 3), 'd': round(w['d'], 3)} for w in words]})
            clips.append({'file': mp3.name, 't': round(t, 3)})
            t += dur + gap
        t += scene['tail']
        scenes.append({'id': scene['id'], 'start': round(start, 3), 'end': round(t, 3), 'lines': lines})
        print(f"{scene['id']:9s} {start:7.2f} -> {t:7.2f}  ({t - start:5.2f}s)")
    timeline = {'total': round(t, 3), 'scenes': scenes, 'clips': clips}
    (HERE / 'timeline.js').write_text('window.TIMELINE=' + json.dumps(timeline) + ';\n', encoding='utf-8')
    (HERE / 'audio' / 'clips.json').write_text(json.dumps(timeline), encoding='utf-8')
    print(f'total {t:.2f}s = {int(t // 60)}:{t % 60:05.2f}')


asyncio.run(main())
