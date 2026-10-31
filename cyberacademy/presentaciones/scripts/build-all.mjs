import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Las presentaciones se publican dentro de divisioncero.com, en
// /cyberacademy/presentaciones/<slug>/. El índice es la página de Next
// app/cyberacademy/(home)/presentaciones, que lee el mismo decks.json.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const decks = JSON.parse(readFileSync(join(root, "decks.json"), "utf-8"));

const basePath = process.env.PRESENTACIONES_BASE_PATH ?? "/cyberacademy/presentaciones";
const outDir = resolve(
  root,
  process.env.PRESENTACIONES_OUT_DIR ?? "../../out/cyberacademy/presentaciones",
);

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://divisioncero.com";
const ogImage = `${siteUrl}/cyberacademy/og/home/image.png`;

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// Slidev ignora `htmlAttrs.lang`, usa el `info` en markdown como description y
// no emite canonical ni og:url; se corrige el <head> generado para SEO.
function fixDeckHead(deck, deckOut) {
  const file = join(deckOut, "index.html");
  const url = `${siteUrl}${basePath}/${deck.slug}/`;
  let html = readFileSync(file, "utf-8");

  html = html.replace(/<html lang="[^"]*"/, '<html lang="es"');
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeAttr(deck.description)}">`,
  );
  html = html.replace(
    /<meta property="(og|twitter):image" content="https:\/\/cover\.sli\.dev">/g,
    `<meta property="$1:image" content="${ogImage}">`,
  );
  if (!html.includes('property="og:image"')) {
    html = html.replace("</head>", `<meta property="og:image" content="${ogImage}">\n</head>`);
  }

  const extra = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="CyberAcademy">`,
    `<meta property="og:locale" content="es_419">`,
    deck.noindex ? `<meta name="robots" content="noindex, follow">` : "",
  ].filter(Boolean);
  html = html.replace("</head>", `${extra.join("\n")}\n</head>`);

  writeFileSync(file, html);
}

mkdirSync(outDir, { recursive: true });

for (const deck of decks) {
  const deckOut = join(outDir, deck.slug);
  rmSync(deckOut, { recursive: true, force: true });
  console.log(`\n▲ Building "${deck.title}" (${deck.entry})`);
  execFileSync(
    "pnpm",
    [
      "exec",
      "slidev",
      "build",
      deck.entry,
      "--out",
      deckOut,
      "--base",
      `${basePath}/${deck.slug}/`,
      "--router-mode",
      "hash",
    ],
    { cwd: root, stdio: "inherit" },
  );
  fixDeckHead(deck, deckOut);
}

console.log(`\n✓ ${decks.length} presentación(es) en ${outDir}`);
