"""Generate voice-over lines (edge-tts) with word timings, then write timeline.js.

Usage: python tts.py           (needs: pip install edge-tts; ffprobe on PATH)
       python tts.py --reuse   only synthesize lines whose text changed; unchanged lines keep their
                               recorded mp3 and word timings from the previous timeline
"""
import asyncio, json, pathlib, shutil, subprocess, sys, tempfile
import edge_tts

HERE = pathlib.Path(__file__).parent
AUDIO = HERE / 'audio'
AUDIO.mkdir(exist_ok=True)
SCRIPT = json.loads((HERE / 'script.json').read_text(encoding='utf-8'))
REUSE = '--reuse' in sys.argv


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


def recorded_lines(keep):
    """Previous lines by text: a private copy of the mp3 plus word timings relative to the line start."""
    clips = AUDIO / 'clips.json'
    if not clips.exists():
        return {}
    previous = json.loads(clips.read_text(encoding='utf-8'))
    lines = {}
    for scene in previous['scenes']:
        for i, line in enumerate(scene['lines']):
            mp3 = AUDIO / f"{scene['id']}-{i}.mp3"
            if mp3.exists() and line['text'] not in lines:
                copy = keep / f"{len(lines)}.mp3"
                shutil.copy(mp3, copy)
                lines[line['text']] = (copy, [{**w, 't': w['t'] - line['t']} for w in line['words']])
    return lines


async def main():
    keep = pathlib.Path(tempfile.mkdtemp())
    reuse = recorded_lines(keep) if REUSE else {}
    t = 0.0
    scenes, clips = [], []
    for scene in SCRIPT['scenes']:
        start = t
        t += scene['lead']
        lines = []
        for i, (text, gap) in enumerate(scene['parts']):
            mp3 = AUDIO / f"{scene['id']}-{i}.mp3"
            if text in reuse:
                shutil.copy(reuse[text][0], mp3)
                words = reuse[text][1]
            else:
                words = await synth(text, mp3)
                print(f'  synthesized {mp3.name}: {text}')
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
    shutil.rmtree(keep, ignore_errors=True)
    print(f'total {t:.2f}s = {int(t // 60)}:{t % 60:05.2f}')


asyncio.run(main())
