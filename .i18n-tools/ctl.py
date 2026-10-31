"""Páginas de controles Kudo: `show <files>` lista segmentos; `apply <es.mdx> <trad.txt>` escribe .en.mdx.
trad.txt: una línea por segmento, en el orden de `show` (title, description, definición, requisitos...)."""
import re, sys
HEAD = {'## Definición de Control': '## Control Definition', '## Requisitos': '## Requirements', '## Requisitos (How)': '## Requirements (How)'}
def parse(path):
    s = open(path).read()
    _, fm, body = s.split('---', 2)
    title = re.search(r'^title:\s*(.*)$', fm, re.M).group(1).strip().strip('"')
    desc = re.search(r'^description:\s*(.*)$', fm, re.M).group(1).strip().strip('"')
    blocks, cur = [], []
    for line in body.strip('\n').split('\n'):
        if line.startswith('#'):
            if cur: blocks.append(('p', ' '.join(x.strip() for x in cur))); cur = []
            blocks.append(('h', line.strip()))
        elif line.strip(): cur.append(line)
        elif cur: blocks.append(('p', ' '.join(x.strip() for x in cur))); cur = []
    if cur: blocks.append(('p', ' '.join(x.strip() for x in cur)))
    return title, desc, blocks
cmd = sys.argv[1]
if cmd == 'show':
    for p in sys.argv[2:]:
        t, d, b = parse(p)
        print(f'#### {p}'); print(t); print(d)
        for k, v in b:
            if k == 'p': print(v)
            elif v not in HEAD and not re.fullmatch(r'### Requisito \d+', v): print('!!HEAD', v)
elif cmd == 'all':
    import subprocess, tempfile
    chunks = open(sys.argv[2]).read().split('#### ')[1:]
    for c in chunks:
        path, rest = c.split('\n', 1)
        f = tempfile.NamedTemporaryFile('w', delete=False, suffix='.txt'); f.write(rest); f.close()
        subprocess.run([sys.executable, __file__, 'apply', path.strip(), f.name], check=True)
else:
    src, tr = sys.argv[2], sys.argv[3]
    lines = [l.rstrip('\n') for l in open(tr) if l.strip()]
    t, d, b = parse(src)
    n = 2 + sum(1 for k, _ in b if k == 'p')
    assert len(lines) == n, f'{src}: esperaba {n} líneas, hay {len(lines)}'
    q = lambda x: '"' + x.replace('"', '\\"') + '"' if ':' in x or '"' in x else x
    out = [f'---\ntitle: {q(lines[0])}\ndescription: {q(lines[1])}\n---\n']
    i = 2
    for k, v in b:
        if k == 'h':
            out.append(HEAD.get(v) or re.sub(r'^### Requisito (\d+)$', r'### Requirement \1', v)); out.append('')
        else:
            out.append(lines[i]); out.append(''); i += 1
    open(src.replace('.mdx', '.en.mdx'), 'w').write('\n'.join(out).rstrip() + '\n')
    print('ok', src)
