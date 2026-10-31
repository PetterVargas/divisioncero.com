import { jsPDF } from 'jspdf';

import { formatDateWithUtcOffset } from '@/lib/herramientas/datetime';
import { drawGeneratedByDivisionCero } from '@/lib/herramientas/pdf-report';

import { PLATFORM_INFO, type SocialProfile } from './platforms';

const MARGIN_X = 14;
const PAGE_WIDTH = 210;
const PAGE_BOTTOM = 280;
const TOP_Y = 20;
const LABEL_WIDTH = 48;
const VALUE_WIDTH = PAGE_WIDTH - MARGIN_X * 2 - LABEL_WIDTH;

/**
 * Las fuentes estándar de jsPDF solo cubren Latin-1 (más algunos signos
 * tipográficos); emojis y otros alfabetos se verían como símbolos rotos.
 */
function pdfSafe(value: string): string {
  return value
    .replace(/[^\u0000-ÿ–—‘’“”•…€]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed <= PAGE_BOTTOM) return y;
  doc.addPage();
  return TOP_Y;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text(title, MARGIN_X, y);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_X, y + 1.5, PAGE_WIDTH - MARGIN_X, y + 1.5);
  return y + 8;
}

function addRow(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFontSize(10);
  const lines: string[] = doc.splitTextToSize(pdfSafe(value) || tr('No disponible'), VALUE_WIDTH);
  y = ensureSpace(doc, y, lines.length * 5 + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(label, MARGIN_X, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(lines, MARGIN_X + LABEL_WIDTH, y);

  return y + lines.length * 5 + 2;
}

function formatFlag(value: boolean | null): string {
  if (value === null) return tr('No disponible');
  return value ? tr('Sí') : tr('No');
}

/**
 * Genera el PDF de forma síncrona para que el hash SHA-256 se calcule sobre
 * los bytes definitivos y pueda incluirse en el nombre del archivo.
 */
type Translate = (text: string, variables?: Record<string, string | number>) => string;

// Traductor activo mientras se genera el PDF (lo usan también las funciones auxiliares del módulo).
let tr: Translate = (text) => text;

export function buildSocialProfileReportPdf(profile: SocialProfile, t?: Translate): ArrayBuffer {
  tr = t ?? ((text) => text);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const platformLabel = PLATFORM_INFO[profile.platform].label;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(tr('Reporte de Identificación de Perfil'), MARGIN_X, TOP_Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  drawGeneratedByDivisionCero(doc, MARGIN_X, 26);
  doc.text(tr('Fecha y hora de generación: {date}', { date: formatDateWithUtcOffset(new Date()) }), MARGIN_X, 31);

  let y = 42;

  y = addSectionTitle(doc, 'Consulta', y);
  y = addRow(doc, tr('Red social'), platformLabel, y);
  y = addRow(doc, tr('URL ingresada'), profile.inputUrl, y);
  y = addRow(doc, tr('Fecha de consulta'), formatDateWithUtcOffset(new Date(profile.queriedAt)), y);
  y = addRow(doc, tr('Fuente'), tr(profile.source), y);

  y += 6;
  y = addSectionTitle(doc, tr('Identificación del perfil'), y);
  y = ensureSpace(doc, y, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`ID de ${platformLabel}`, MARGIN_X, y);
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(profile.id, MARGIN_X + LABEL_WIDTH, y + 0.5);
  y += 9;

  y = addRow(doc, tr('Usuario'), profile.username ? `@${profile.username}` : '', y);
  y = addRow(doc, tr('Nombre'), profile.name, y);
  y = addRow(doc, tr('URL del perfil'), profile.profileUrl, y);
  y = addRow(doc, tr('Cuenta verificada'), formatFlag(profile.verified), y);
  y = addRow(doc, tr('Cuenta privada'), formatFlag(profile.isPrivate), y);
  if (profile.description) y = addRow(doc, tr('Descripción'), profile.description, y);

  if (profile.details.length) {
    y += 6;
    y = addSectionTitle(doc, tr('Datos públicos del perfil'), y);
    for (const field of profile.details) {
      y = addRow(doc, tr(field.label), field.value, y);
    }
  }

  y += 6;
  y = ensureSpace(doc, y, 20);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  const disclaimer = doc.splitTextToSize(
    tr('La información corresponde a los datos públicos del perfil en el momento de la consulta. ') +
      tr('El ID numérico es permanente aunque el titular cambie su nombre de usuario, por lo que es el ') +
      tr('dato recomendado para documentar y reportar una cuenta. Las cifras pueden estar redondeadas por la ') +
      tr('propia red social. Emojis y caracteres de otros alfabetos se omiten en el PDF. ') +
      tr('El PDF se generó en tu navegador.'),
    PAGE_WIDTH - MARGIN_X * 2,
  );
  doc.text(disclaimer, MARGIN_X, y);

  return doc.output('arraybuffer');
}
