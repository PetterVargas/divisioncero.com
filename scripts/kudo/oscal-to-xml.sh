#!/usr/bin/env bash
# Convierte los modelos OSCAL JSON de Kudo a XML con el conversor oficial de NIST
# (XSLT 3.0 ejecutado con SaxonJS) y valida los JSON contra el esquema oficial.
#
#   bash scripts/kudo/oscal-to-xml.sh            # usa OSCAL v1.2.3
#   OSCAL_VERSION=1.2.3 bash scripts/kudo/oscal-to-xml.sh
#
# Descarga los artefactos de NIST en una carpeta temporal (no se versionan).
set -euo pipefail

OSCAL_VERSION="${OSCAL_VERSION:-1.2.3}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REV_DIR="$ROOT/content/kudo/framework/oscal/kudo/rev1"
WORK="${TMPDIR:-/tmp}/kudo-oscal-$OSCAL_VERSION"
BASE="https://github.com/usnistgov/OSCAL/releases/download/v$OSCAL_VERSION"

mkdir -p "$WORK"
cd "$WORK"

[ -f package.json ] || echo '{"private":true}' > package.json
if [ ! -d node_modules/xslt3 ]; then
  if command -v npm >/dev/null; then
    npm install --silent --no-audit --no-fund xslt3@2.7.0 ajv@8.17.1 ajv-formats@3.0.1 >/dev/null
  else
    pnpm add --silent xslt3@2.7.0 ajv@8.17.1 ajv-formats@3.0.1 >/dev/null
  fi
fi
XSLT3="$WORK/node_modules/.bin/xslt3"

for f in oscal_complete_json-to-xml-converter.xsl oscal_complete_schema.json; do
  [ -f "$f" ] || curl -fsSL -o "$f" "$BASE/$f"
done

if [ ! -f json2xml.sef.json ]; then
  echo "Compilando el conversor JSON→XML de NIST (una sola vez)…"
  "$XSLT3" -xsl:oscal_complete_json-to-xml-converter.xsl -export:json2xml.sef.json -nogo
fi

cat > validate.mjs <<'EOF'
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
const [schema, ...files] = process.argv.slice(2);
const ajv = new Ajv({ strict: false, allErrors: true, unicodeRegExp: true });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(fs.readFileSync(schema, 'utf8')));
let bad = 0;
for (const f of files) {
  const ok = validate(JSON.parse(fs.readFileSync(f, 'utf8')));
  console.log(`${ok ? '✓ válido  ' : '✗ inválido'} ${f.split('/').pop()}`);
  if (!ok) { bad++; console.log(JSON.stringify(validate.errors.slice(0, 10), null, 2)); }
}
process.exit(bad ? 1 : 0);
EOF

echo "Validando JSON contra el esquema OSCAL $OSCAL_VERSION…"
node validate.mjs oscal_complete_schema.json "$REV_DIR"/json/*.json

mkdir -p "$REV_DIR/xml"
for json in "$REV_DIR"/json/*.json; do
  name="$(basename "$json" .json)"
  "$XSLT3" -xsl:json2xml.sef.json -it:from-json "file=file://$json" -o:"$REV_DIR/xml/$name.xml"
  # El conversor de NIST v1.2.3 emite <assessment-task> en todos los contextos, pero
  # el XSD solo lo admite dentro de los resultados del AR; en el AP y en las
  # remediaciones (POA&M) el elemento correcto es <task>.
  case "$name" in
    *assessment-plan|*poam)
      sed -i.bak -e 's/<assessment-task\b/<task/g' -e 's#</assessment-task>#</task>#g' "$REV_DIR/xml/$name.xml"
      rm -f "$REV_DIR/xml/$name.xml.bak"
      ;;
  esac
  echo "  ✓ xml/$name.xml"
done
