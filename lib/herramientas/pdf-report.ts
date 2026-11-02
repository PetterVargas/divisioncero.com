import type { jsPDF } from 'jspdf';

import { DIVISIONCERO_LOGO_PNG, DIVISIONCERO_LOGO_RATIO } from './divisioncero-logo';

const DIVISIONCERO_URL = 'https://divisioncero.com';
const LINK_COLOR: [number, number, number] = [37, 99, 235];

/**
 * Dibuja "Generado por DivisionCero" en (x, y), con "DivisionCero" como link
 * clicable a divisioncero.com. Usa la fuente/tamaño ya configurados en el
 * doc y restaura el color de texto gris estándar de los reportes al salir.
 */
export function drawGeneratedByDivisionCero(doc: jsPDF, x: number, y: number): void {
  const prefix = 'Generado por ';
  doc.setTextColor(120, 120, 120);
  doc.text(prefix, x, y);

  const linkX = x + doc.getTextWidth(prefix);
  doc.setTextColor(...LINK_COLOR);
  doc.textWithLink('DivisionCero', linkX, y, { url: DIVISIONCERO_URL });
  doc.setTextColor(120, 120, 120);
}

const LOGO_HEIGHT = 20;
const LOGO_TOP = 10;

/**
 * Cuánto baja el encabezado de la primera página (título, "Generado por", fecha y
 * el inicio del contenido) para dejar el logo arriba, encima del título.
 */
export const REPORT_HEADER_OFFSET = 22;

/**
 * Dibuja el logo de DivisionCero arriba a la izquierda de la primera página, en
 * `x` (el margen izquierdo del reporte), con link a divisioncero.com.
 */
export function drawDivisionCeroLogo(doc: jsPDF, x: number): void {
  const width = LOGO_HEIGHT * DIVISIONCERO_LOGO_RATIO;
  // Con alias se incrusta una sola vez; 'FAST' lo comprime (sin compresión pesa cientos de KB).
  doc.addImage(DIVISIONCERO_LOGO_PNG, 'PNG', x, LOGO_TOP, width, LOGO_HEIGHT, 'divisioncero-logo', 'FAST');
  doc.link(x, LOGO_TOP, width, LOGO_HEIGHT, { url: DIVISIONCERO_URL });
}
