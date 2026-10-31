"""Traducción de CyberAcademy por unidades (un curso, o un directorio con ':flat').

  ca.py show <unidad>...        imprime '@@@@ <unidad> <n>' y los n segmentos únicos a traducir
  ca.py apply <trad.txt>        trad.txt: bloques '@@@@ <unidad>' + una traducción por segmento, en orden

Un segmento es el texto traducible de una línea: valor de title/description del frontmatter,
atributos title/description/alt de JSX, celdas de tabla o el texto tras los marcadores markdown.
Las frases de plantilla (convenciones, cierre, evaluación, diagrama, índices) se resuelven con RULES.
"""
import glob, json, os, re, sys

PROSE = {'mdx', 'md', 'markdown', 'text', 'txt', 'plaintext'}
COURSE = r'(Curso [^*\n]+?)'

# (regex sobre el segmento completo, plantilla en inglés; {C} = traducción del grupo 1)
RULES = [
    (r'Descarga el diagrama visual \(Excalidraw\) del \*\*' + COURSE + r'\*\*\.', 'Download the visual diagram (Excalidraw) of the **{C}**.'),
    (r'Diagrama visual del ' + COURSE, 'Visual diagram of the {C}'),
    (r'Diagrama del curso', 'Course diagram'),
    (r'Diagrama de la learning path Cyberusuario', 'CyberUsuario learning path diagram'),
    (r'\[Descargar diagrama \(Excalidraw\)\]\((.+)\)', '[Download diagram (Excalidraw)]({1})'),
    (r'\[Descargar diagrama del dominio \(Excalidraw\)\]\((.+)\)', '[Download the domain diagram (Excalidraw)]({1})'),
    (r'Para visualizar el diagrama visita \[Excalidraw\]\(https://excalidraw\.com/\)', 'To view the diagram, visit [Excalidraw](https://excalidraw.com/)'),
    (r'Draw', 'Draw'),
    (r'Evaluación y Certificación', 'Assessment and Certification'),
    (r'Valida lo aprendido y obtén tu certificación del curso', 'Validate what you learned and get your course certification'),
    (r'Evalúa lo aprendido', 'Assess what you learned'),
    (r'Ya recorriste todos los módulos del \*\*' + COURSE + r'\*\*\. Para cerrar el ciclo y certificarte, presenta la evaluación en nuestra plataforma de DivisionCero\.',
     "You've completed all the modules of the **{C}**. To close the cycle and get certified, take the assessment on our DivisionCero platform."),
    (r'\*\*\[Presentar evaluación →\]\((.+)\)\*\*', '**[Take the assessment →]({1})**'),
    (r'\*\*\[Ver mis certificados →\]\((.+)\)\*\*', '**[View my certificates →]({1})**'),
    (r'Tiene un precio\?', 'Does it have a price?'),
    (r'Sí, tenemos planes individuales para empresas, es nuestro objetivo de que la Ciberseguridad sea más accesible, para más información visita',
     'Yes, we have individual plans for companies; our goal is to make cybersecurity more accessible. For more information, visit'),
    (r'\[DivisionCero\]\(https://divisioncero\.com/?\)', '[DivisionCero](/en)'),
    (r'\[Precios DivisionCero\]\(https://divisioncero\.com/precios\)', '[DivisionCero Pricing](/en/precios)'),
    (r'¿Qué aprendimos\?', 'What did we learn?'),
    (r'Cierre por el momento; pero, no dejes el apasionamiento por aprender cada día\.', "That's a wrap for now; but don't lose your passion for learning every day."),
    (r'Lo aprendido', 'What we learned'),
    (r'Te hemos llevado a buen puerto en el \*\*' + COURSE + r'\*\*\.', "We've brought you safely through the **{C}**."),
    (r'Un pequeño repaso de los lugares visitados y practicados:', 'A quick recap of the places we visited and practiced:'),
    (r'Apoyanos', 'Support us'),
    (r'\*\*Conoce las formas de apoyar los proyectos sin ningún costo \[Juntos somos más\]\(https://divisioncero\.com/blog/juntos-somos-mas\)\*\*',
     '**Learn the ways to support the projects at no cost: [Together we are more](/en/blog/juntos-somos-mas)**'),
    (r'Mil gracias por acompañarnos en este viaje 🤘🏽', 'Thank you so much for joining us on this journey 🤘🏽'),
    (r'Convenciones', 'Conventions'),
    (r'Tips pedagógicas para un mejor aprendizaje y clarificación', 'Teaching tips for better learning and clarity'),
    (r'Te invitamos a revisar \[por qué DivisionCero\]\(https://divisioncero\.com/blog/por-que-divisioncero\)\.', 'We invite you to read [why DivisionCero](/en/blog/por-que-divisioncero).'),
    (r'Tipos', 'Types'),
    (r'Hacks', 'Hacks'),
    (r'Información, consejos y herramientas que harán tu vida más fácil\.', 'Information, tips and tools that will make your life easier.'),
    (r'Errores', 'Mistakes'),
    (r'No cometas los mismos errores que ya nosotros hemos cometido\.', "Don't make the same mistakes we've already made."),
    (r'Optimización', 'Optimization'),
    (r'Haz más con menos en todos los contextos \(financiero, herramientas, etc\.\)', 'Do more with less in every context (financial, tools, etc.)'),
    (r'Riesgos', 'Risks'),
    (r'Anticipa dolores de cabeza innecesarios, como debe actuar un ciberguardian\.', 'Anticipate unnecessary headaches, as a CyberGuardian should.'),
    (r'Bienvenido al \*\*' + COURSE + r'\*\*\.', 'Welcome to the **{C}**.'),
    (r'Descripción', 'Description'),
    (r'Módulos', 'Modules'),
    (r'Temas', 'Topics'),
    (r'Overview', 'Overview'),
    (r'Bienvenido al dominio \*\*(.+)\*\*\.', 'Welcome to the **{C}** domain.'),
    (r'Cursos', 'Courses'),
    (r'Recursos', 'Resources'),
    (r'Vista general del módulo', 'Module overview'),
    (r'Descripción del módulo', 'Module description'),
]
TM_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tm.json')
TM = json.load(open(TM_PATH)) if os.path.exists(TM_PATH) else {}
SEP = {'Overview': 'Overview', 'Validación': 'Validation', 'Cierre': 'Wrap-up', 'Módulos': 'Modules'}


def unit_files(unit):
    flat = unit.endswith(':flat')
    d = unit[:-5] if flat else unit
    pat = '*' if flat else '**/*'
    mdx = sorted(f for f in glob.glob(os.path.join(d, pat + '.mdx'), recursive=not flat) if not f.endswith('.en.mdx'))
    meta = sorted(glob.glob(os.path.join(d, pat + 'meta.json'), recursive=not flat))
    meta = [m for m in meta if os.path.basename(m) == 'meta.json']
    return mdx, meta


def jsx_only(s):
    return re.fullmatch(r'</?[A-Za-z][\w.]*(\s+[\w-]+(=("[^"]*"|\{[^}]*\}))?)*\s*/?>', s) is not None


def tag_end(s):
    """Índice justo después del '>' que cierra la etiqueta de apertura (respeta {...} y "...")."""
    depth, q = 0, False
    for i, ch in enumerate(s):
        if q:
            if ch == '"': q = False
        elif ch == '"' and depth == 0: q = True
        elif ch == '{': depth += 1
        elif ch == '}': depth -= 1
        elif ch == '>' and depth == 0 and i > 0: return i + 1
    return -1


def line_parts(line):
    """Devuelve [(inicio, fin)] de los segmentos traducibles dentro de la línea."""
    s = line.strip()
    off = len(line) - len(line.lstrip())
    if not s or s == '---' or s.startswith(('import ', 'export ')) or not re.search(r'[A-Za-zÁÉÍÓÚáéíóúñÑ]{2}', s):
        return []
    if s.startswith('<') or re.match(r'^[\w-]+=["{]', s):
        spans = [(m.start(2) + off, m.end(2) + off) for m in re.finditer(r'\b(title|description|alt)="([^"]*)"', s)]
        end = tag_end(s) if s.startswith('<') else -1
        if end > 0:
            rest = s[end:]
            mm = re.match(r'^(.*?)(</[\w.]+>)?$', rest)
            txt = mm.group(1)
            if txt.strip() and '<' not in txt and re.search(r'[A-Za-z]{2}', txt):
                a = off + end + (len(txt) - len(txt.lstrip()))
                spans.append((a, a + len(txt.strip())))
        return spans
    m = re.fullmatch(r'(\s*)!\[([^\]]*)\]\(([^)]*)\)\s*', line)
    if m:
        return [(m.start(2), m.end(2))] if re.search(r'[A-Za-z]{2}', m.group(2)) else []
    if re.fullmatch(r'\|?[\s:|-]+\|?', s):
        return []
    if s.startswith('|'):
        spans, pos = [], line.index('|')
        for cell in s.strip('|').split('|'):
            pos = line.index(cell, pos)
            c = cell.strip()
            if c and re.search(r'[A-Za-záéíóúñ]{2}', c):
                a = pos + (len(cell) - len(cell.lstrip()))
                spans.append((a, a + len(c)))
            pos += len(cell)
        return spans
    m = re.match(r'^(\s*(?:#{1,6} |[-*+] (?:\[[ xX]\] )?|\d+\. |> )*)', line)
    a = len(m.group(1))
    return [(a, len(line.rstrip()))] if a < len(line.rstrip()) else []


def walk(path):
    """Itera (n_linea, spans) de un .mdx, incluido el frontmatter."""
    lines = open(path).read().split('\n')
    out, code, prose, fm, imp = [], False, False, 0, False
    for i, l in enumerate(lines):
        s = l.strip()
        if imp:
            imp = ' from ' not in l and not s.startswith('} from'); continue
        if s.startswith('import ') and ' from ' not in s:
            imp = True; continue
        if i == 0 and s == '---':
            fm = 1; continue
        if fm == 1:
            if s == '---':
                fm = 2; continue
            m = re.match(r'^(title|description):\s*(.*)$', l)
            if m and m.group(2).strip():
                v = m.group(2)
                a = m.start(2) + (1 if v[:1] in '"\'' else 0)
                b = len(l.rstrip()) - (1 if v.rstrip()[-1:] in '"\'' and v[:1] in '"\'' else 0)
                out.append((i, [(a, b)], True))
            continue
        if s.startswith('```'):
            code = not code
            lang = s[3:].split()[0].lower() if code and s[3:].strip() else ''
            prose = code and lang in PROSE
            continue
        if code and not prose:
            continue
        sp = line_parts(l)
        if sp:
            out.append((i, sp, False))
    return lines, out


def segments(unit):
    mdx, meta = unit_files(unit)
    segs = []
    def add(x):
        x = x.strip()
        if x and x not in segs: segs.append(x)
    for f in mdx:
        lines, items = walk(f)
        for i, sp, _ in items:
            for a, b in sp: add(lines[i][a:b])
    for m in meta:
        d = json.load(open(m))
        for k in ('title', 'description'):
            if d.get(k): add(d[k])
        for p in d.get('pages', []):
            mm = re.fullmatch(r'---(.*)---', p)
            if mm and not re.fullmatch(r'Módulo \d+', mm.group(1)) and mm.group(1) not in SEP: add(mm.group(1))
    return segs


def rule(seg, tr):
    for pat, tpl in RULES:
        m = re.fullmatch(pat, seg)
        if not m: continue
        out = tpl
        if '{C}' in tpl:
            c = tr.get(m.group(1)) if tr is not None else m.group(1)
            if c is None: return None
            out = out.replace('{C}', c)
        if '{1}' in tpl: out = out.replace('{1}', m.group(1))
        return out
    return None


def pending(unit):
    segs = segments(unit)
    plain = [s for s in segs if s not in TM and rule(s, TM) is None and rule(s, None) is None]
    return segs, plain


def localize(s):
    s = re.sub(r'(href="|\]\()/(cyberacademy|kudo|herramientas|docs|blog|precios|releases|legal|open-source)', r'\1/en/\2', s)
    s = re.sub(r'(href="|\]\()https://divisioncero\.com/(blog|precios|kudo|cyberacademy|herramientas|docs)', r'\1/en/\2', s)
    return s.replace('/en/cyberacademy/downloads/', '/cyberacademy/downloads/').replace('/en/cyberacademy/presentaciones/', '/cyberacademy/presentaciones/')


def apply(unit, trans):
    segs, plain = pending(unit)
    assert len(trans) == len(plain), f'{unit}: esperaba {len(plain)} traducciones, hay {len(trans)}'
    tr = dict(TM)
    tr.update(zip(plain, trans))
    for s in segs:
        if s not in tr:
            r = rule(s, tr)
            assert r is not None, (unit, s)
            tr[s] = r
    mdx, meta = unit_files(unit)
    for f in mdx:
        lines, items = walk(f)
        for i, sp, is_fm in items:
            l = lines[i]
            if is_fm:
                key = l.split(':', 1)[0]
                (a, b), = sp
                lines[i] = f'{key}: ' + json.dumps(tr[l[a:b].strip()], ensure_ascii=False)
                continue
            for a, b in sorted(sp, reverse=True):
                src = l[a:b]
                t = tr[src.strip()]
                if l[:a].rstrip().endswith('="') and '"' in t:
                    raise SystemExit(f'comillas en atributo: {t}')
                l = l[:a] + t + l[b:]
            lines[i] = localize(l)
        open(f[:-4] + '.en.mdx', 'w').write('\n'.join(lines))
    for m in meta:
        d = json.load(open(m))
        for k in ('title', 'description'):
            if d.get(k): d[k] = tr[d[k].strip()]
        pages = []
        for p in d.get('pages', []):
            mm = re.fullmatch(r'---(.*)---', p)
            if mm:
                x = mm.group(1)
                x = re.sub(r'^Módulo (\d+)$', r'Module \1', x) if re.fullmatch(r'Módulo \d+', x) else SEP.get(x) or tr[x.strip()]
                p = f'---{x}---'
            pages.append(p)
        d['pages'] = pages
        json.dump(d, open(m[:-5] + '.en.json', 'w'), ensure_ascii=False, indent=2)
    for s in segs: TM[s] = tr[s]
    json.dump(TM, open(TM_PATH, 'w'), ensure_ascii=False, indent=0)
    print('ok', unit, len(mdx), 'mdx', len(meta), 'meta')


if __name__ == '__main__':
    if sys.argv[1] == 'show':
        for u in sys.argv[2:]:
            _, plain = pending(u)
            print(f'@@@@ {u} {len(plain)}')
            print('\n'.join(plain))
    elif sys.argv[1] == 'apply':
        for c in open(sys.argv[2]).read().split('@@@@ ')[1:]:
            head, rest = c.split('\n', 1)
            apply(head.split()[0], [l for l in rest.split('\n') if l.strip()])
