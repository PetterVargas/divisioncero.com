"""Traducción por líneas de .mdx: `show <files>` imprime las líneas traducibles; `all <trad.txt>` aplica.
trad.txt: bloques que empiezan con '@@@@ <ruta>' seguidos de una línea traducida por cada línea mostrada.
Se omiten: líneas vacías, '---', bloques de código (``` ... ```), imports/exports, líneas sin letras
y líneas que son solo etiquetas JSX sin texto. La indentación original se conserva."""
import os, re, sys
PROSE = {'mdx', 'md', 'markdown', 'text', 'txt', 'plaintext'}
PLAIN = os.environ.get('PLAIN') == '1'
INPLACE = os.environ.get('INPLACE') == '1'  # leer/escribir el borrador .en.mdx y pedir solo líneas en español
ES = re.compile(r"[áéíóúñÁÉÍÓÚÑ¿¡]|\b(de|del|la|las|los|el|y|en|para|con|por|que|se|su|sus|una|es|al|como|más|entre|sin|sobre|controles|requisitos|gestión|seguridad|datos)\b")  # traducir también bloques ``` sin lenguaje
def translatable(lines):
    out, code, prose = [], False, False
    for i, l in enumerate(lines):
        s = l.strip()
        if s.startswith('```'):
            code = not code
            lang = s[3:].split()[0].lower() if code and s[3:].strip() else ''
            prose = code and (lang in PROSE or (lang == '' and PLAIN))
            continue
        if code and not prose: continue
        if not s or s == '---' or s.startswith(('import ', 'export ')): continue
        if not re.search(r'[A-Za-zÁÉÍÓÚáéíóúñÑ]{2}', s): continue
        if re.fullmatch(r'</?[A-Za-z][\w.]*(\s+[\w-]+(=("[^"]*"|\{[^}]*\}))?)*\s*/?>', s) and not re.search(r'(title|description|alt)=', s): continue
        if re.fullmatch(r'\|?[\s:|-]+\|?', s): continue
        if INPLACE and not ES.search(re.sub(r'(href|src|light|dark)="[^"]*"|\]\([^)]*\)|`[^`]*`|https?://\S+', '', s)): continue
        out.append(i)
    return out
cmd = sys.argv[1]
if cmd == 'show':
    for p in sys.argv[2:]:
        lines = open(p[:-4] + '.en.mdx' if INPLACE else p).read().split('\n')
        print(f'@@@@ {p}')
        for i in translatable(lines): print(lines[i].strip())
elif cmd == 'all':
    for c in open(sys.argv[2]).read().split('@@@@ ')[1:]:
        path, rest = c.split('\n', 1)
        path = path.strip(); tr = [l for l in rest.split('\n') if l.strip()]
        lines = open(path[:-4] + '.en.mdx' if INPLACE else path).read().split('\n'); idx = translatable(lines)
        if len(idx) != len(tr):
            print(f'!! {path}: esperaba {len(idx)} líneas, hay {len(tr)}'); continue
        for i, t in zip(idx, tr):
            lines[i] = lines[i][:len(lines[i]) - len(lines[i].lstrip())] + t.strip()
        open(path.replace('.mdx', '.en.mdx'), 'w').write('\n'.join(lines))
        print('ok', path)
