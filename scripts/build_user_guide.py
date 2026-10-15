"""Build the bundled reading guide without a runtime Markdown dependency."""
import html
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]


def inline(text):
    escaped = html.escape(text)
    escaped = re.sub(r'`([^`]+)`', r'<code>\1</code>', escaped)
    return re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', escaped)


def render(text):
    lines = text.splitlines()
    output, index, section = [], 0, 0
    while index < len(lines):
        line = lines[index]
        if not line.strip():
            index += 1
            continue
        if line.startswith('```'):
            index += 1
            code = []
            while index < len(lines) and not lines[index].startswith('```'):
                code.append(lines[index]); index += 1
            output.append('<pre><code>' + html.escape('\n'.join(code)) + '</code></pre>')
        elif line.startswith('# '):
            output.append('<h1>' + inline(line[2:]) + '</h1>')
        elif line.startswith('## '):
            section += 1
            output.append(f'<h2 id="section-{section}">' + inline(line[3:]) + '</h2>')
        elif line.startswith('|'):
            rows = []
            while index < len(lines) and lines[index].startswith('|'):
                row = [cell.strip() for cell in lines[index].strip('|').split('|')]
                if not all(re.fullmatch(r'[: -]+', cell) for cell in row):
                    rows.append(row)
                index += 1
            output.append('<div class="table-scroll"><table><thead><tr>' + ''.join('<th>'+inline(cell)+'</th>' for cell in rows[0]) + '</tr></thead><tbody>' + ''.join('<tr>'+''.join('<td>'+inline(cell)+'</td>' for cell in row)+'</tr>' for row in rows[1:]) + '</tbody></table></div>')
            continue
        elif re.match(r'^(?:\d+\. |- )', line):
            ordered = bool(re.match(r'^\d+\.', line)); tag = 'ol' if ordered else 'ul'; items = []
            pattern = r'^\d+\. ' if ordered else r'^- '
            while index < len(lines) and re.match(pattern, lines[index]):
                items.append('<li>'+inline(re.sub(pattern, '', lines[index]))+'</li>'); index += 1
            output.append('<'+tag+'>'+''.join(items)+'</'+tag+'>')
            continue
        else:
            paragraph = [line]; index += 1
            while index < len(lines) and lines[index].strip() and not re.match(r'^(?:#|\||```|- |\d+\. )', lines[index]):
                paragraph.append(lines[index]); index += 1
            output.append('<p>'+inline(' '.join(paragraph))+'</p>')
            continue
        index += 1
    return '\n'.join(output)


def main():
    text = (ROOT/'docs/USER_GUIDE.md').read_text(encoding='utf-8')
    toc = ['Run the app', 'Orientation', 'Data & map', 'Library & assistant', 'Editor', 'Review', 'A/B impact', 'Public network', 'Activity & export', 'Test checklist', 'Technical tests']
    output = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>User guide · RuleLab</title><link rel="stylesheet" href="/static/guide.css"><link rel="stylesheet" href="/static/workspace-visual.css"><script type="module" src="/static/guide-visual.js"></script><body><header><a href="/workspace">RuleLab</a><span>USER GUIDE · 1.3</span><a href="/guide/download">Download Markdown</a></header><div class="guide-layout"><nav aria-label="Contents"><strong>Start here</strong>'+''.join(f'<a href="#section-{i+1}">{i+1:02}. {html.escape(label)}</a>' for i,label in enumerate(toc))+'<a class="guide-back" href="/workspace?view=library">Open Library ↗</a></nav><main>'+render(text)+'</main></div></body></html>'
    (ROOT/'app/static/guide.html').write_text(output, encoding='utf-8')
    print(f'Guide built: {len(toc)} sections, 2 tables, Markdown download and app links.')


if __name__ == '__main__':
    main()
