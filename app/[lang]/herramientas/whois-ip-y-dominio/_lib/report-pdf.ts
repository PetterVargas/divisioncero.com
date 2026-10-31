import { jsPDF } from 'jspdf';

import { formatDateWithUtcOffset } from '@/lib/herramientas/datetime';
import { drawGeneratedByDivisionCero } from '@/lib/herramientas/pdf-report';

import {
  formatDnssec,
  formatDomainStatus,
  formatRdapDate,
  formatRoles,
  getRegistrantName,
  type WhoisContact,
  type WhoisDomainResult,
  type WhoisIpResult,
  type WhoisIspInfo,
} from './whois';

const MARGIN_X = 14;
const PAGE_WIDTH = 210;
const PAGE_BOTTOM = 280;
const TOP_Y = 20;
const LABEL_WIDTH = 52;
const VALUE_WIDTH = PAGE_WIDTH - MARGIN_X * 2 - LABEL_WIDTH;

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
  const lines: string[] = doc.splitTextToSize(value || tr('No disponible'), VALUE_WIDTH);
  y = ensureSpace(doc, y, lines.length * 5 + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(label, MARGIN_X, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(lines, MARGIN_X + LABEL_WIDTH, y);

  return y + lines.length * 5 + 2;
}

function addParagraph(doc: jsPDF, text: string, y: number): number {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  const lines: string[] = doc.splitTextToSize(text, PAGE_WIDTH - MARGIN_X * 2);
  y = ensureSpace(doc, y, lines.length * 4.5 + 2);
  doc.text(lines, MARGIN_X, y);
  return y + lines.length * 4.5 + 2;
}

function addReportHeader(doc: jsPDF, title: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(title, MARGIN_X, TOP_Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  drawGeneratedByDivisionCero(doc, MARGIN_X, 26);
  doc.text(tr('Fecha y hora de generación: {date}', { date: formatDateWithUtcOffset(new Date()) }), MARGIN_X, 31);

  return 42;
}

function addContacts(doc: jsPDF, contacts: WhoisContact[], y: number): number {
  if (!contacts.length) return y;
  y += 6;
  y = addSectionTitle(doc, tr('Contactos'), y);
  for (const contact of contacts) {
    y = ensureSpace(doc, y, 20);
    y = addRow(doc, 'Roles', formatRoles(contact.roles), y);
    y = addRow(doc, 'Nombre', contact.name, y);
    y = addRow(doc, 'Identificador', contact.handle, y);
    if (contact.emails.length) y = addRow(doc, tr('Correo'), contact.emails.join(', '), y);
    if (contact.phones.length) y = addRow(doc, tr('Teléfono'), contact.phones.join(', '), y);
    if (contact.address) y = addRow(doc, tr('Dirección'), contact.address, y);
    y += 3;
  }
  return y;
}

function addRemarks(doc: jsPDF, remarks: string[], y: number): number {
  if (!remarks.length) return y;
  y += 3;
  y = addSectionTitle(doc, tr('Observaciones del registro'), y);
  for (const remark of remarks) {
    y = addParagraph(doc, remark, y);
  }
  return y;
}

function addDisclaimer(doc: jsPDF, text: string, y: number) {
  y += 6;
  y = ensureSpace(doc, y, 16);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text(doc.splitTextToSize(text, PAGE_WIDTH - MARGIN_X * 2), MARGIN_X, y);
}

/**
 * Genera el PDF de forma síncrona para que el hash SHA-256 se calcule sobre
 * los bytes definitivos y pueda incluirse en el nombre del archivo.
 */
type Translate = (text: string, variables?: Record<string, string | number>) => string;

// Traductor activo mientras se genera el PDF (lo usan también las funciones auxiliares del módulo).
let tr: Translate = (text) => text;

export function buildWhoisIpReportPdf(
  result: WhoisIpResult,
  isp: WhoisIspInfo | null,
  t?: Translate,
): ArrayBuffer {
  tr = t ?? ((text) => text);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = addReportHeader(doc, tr('Reporte WHOIS de Dirección IP'));

  y = addSectionTitle(doc, 'Consulta', y);
  y = addRow(doc, tr('Dirección IP'), result.query, y);
  y = addRow(doc, tr('Fecha de consulta'), formatDateWithUtcOffset(new Date(result.queriedAt)), y);
  y = addRow(doc, tr('Registro regional'), result.registry, y);
  y = addRow(doc, tr('Servidor WHOIS'), result.port43, y);
  y = addRow(doc, tr('Fuente RDAP'), result.rdapUrl, y);

  y += 6;
  y = addSectionTitle(doc, tr('Proveedor de Servicio de Internet (ISP)'), y);
  if (isp) {
    y = addRow(doc, 'ISP', isp.isp, y);
    y = addRow(doc, tr('Organización'), isp.organization, y);
    y = addRow(doc, 'ASN', isp.asn, y);
    y = addRow(doc, tr('Dominio del ISP'), isp.domain, y);
    y = addRow(doc, tr('Ubicación aprox.'), isp.location, y);
  } else {
    y = addParagraph(
      doc,
      tr('No se encontró información del ISP para esta dirección IP (por ejemplo, rangos privados o reservados).'),
      y,
    );
  }
  y = addRow(doc, tr('Titular del bloque'), getRegistrantName(result) || result.name, y);

  y += 6;
  y = addSectionTitle(doc, tr('Red asignada'), y);
  y = addRow(doc, tr('Identificador (handle)'), result.handle, y);
  y = addRow(doc, tr('Nombre de la red'), result.name, y);
  y = addRow(doc, tr('Rango'), `${result.startAddress} - ${result.endAddress}`, y);
  y = addRow(doc, 'CIDR', result.cidrs.join(', '), y);
  y = addRow(doc, tr('Versión IP'), result.ipVersion, y);
  y = addRow(doc, tr('Tipo de asignación'), result.type, y);
  y = addRow(doc, tr('Estado'), result.status.join(', '), y);
  y = addRow(doc, tr('País'), result.country, y);
  y = addRow(doc, tr('ASN de origen'), result.originAsns.join(', '), y);
  y = addRow(doc, tr('Red padre'), result.parentHandle, y);
  y = addRow(doc, tr('Fecha de registro'), formatRdapDate(result.registrationDate), y);
  y = addRow(doc, tr('Última modificación'), formatRdapDate(result.lastChangedDate), y);

  y = addContacts(doc, result.contacts, y);
  y = addRemarks(doc, result.remarks, y);

  addDisclaimer(
    doc,
    tr('La información WHOIS proviene del protocolo RDAP (sucesor de WHOIS) del registro regional de Internet ') +
      tr('responsable de la dirección IP; los datos son públicos y los mantiene el titular de la red. ') +
      tr('Los datos del ISP provienen de un servicio público de consulta por IP (ipwho.is) y la ubicación es aproximada. ') +
      tr('El PDF se generó en tu navegador.'),
    y,
  );

  return doc.output('arraybuffer');
}

export function buildWhoisDomainReportPdf(result: WhoisDomainResult, t?: Translate): ArrayBuffer {
  tr = t ?? ((text) => text);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = addReportHeader(doc, tr('Reporte WHOIS de Dominio'));

  y = addSectionTitle(doc, 'Consulta', y);
  y = addRow(doc, tr('Dominio consultado'), result.query, y);
  if (result.domain && result.domain !== result.query) {
    y = addRow(doc, tr('Dominio registrado'), result.domain, y);
  }
  y = addRow(doc, tr('Fecha de consulta'), formatDateWithUtcOffset(new Date(result.queriedAt)), y);
  y = addRow(doc, tr('Servidor RDAP'), result.registry, y);
  y = addRow(doc, tr('Servidor WHOIS'), result.port43, y);
  y = addRow(doc, tr('Fuente RDAP'), result.rdapUrl, y);

  y += 6;
  y = addSectionTitle(doc, tr('Registro del dominio'), y);
  y = addRow(doc, 'Dominio', result.domain, y);
  y = addRow(doc, tr('Identificador (handle)'), result.handle, y);
  y = addRow(doc, tr('Registrador'), result.registrar, y);
  y = addRow(doc, tr('IANA ID del registrador'), result.registrarIanaId, y);
  y = addRow(doc, tr('Fecha de registro'), formatRdapDate(result.registrationDate), y);
  y = addRow(doc, tr('Fecha de expiración'), formatRdapDate(result.expirationDate), y);
  y = addRow(doc, tr('Última modificación'), formatRdapDate(result.lastChangedDate), y);
  y = addRow(doc, tr('Estado'), formatDomainStatus(result.status), y);
  y = addRow(doc, 'DNSSEC', formatDnssec(result.dnssec), y);

  y += 6;
  y = addSectionTitle(doc, tr('Servidores de nombres (DNS)'), y);
  y = addRow(doc, 'Servidores', result.nameservers.join(', '), y);

  y = addContacts(doc, result.contacts, y);
  y = addRemarks(doc, result.remarks, y);

  addDisclaimer(
    doc,
    tr('La información WHOIS proviene del protocolo RDAP (sucesor de WHOIS) del registro de la extensión del dominio; ') +
      tr('los datos son públicos y los mantienen el registro y el registrador. Muchos registros ocultan los datos ') +
      tr('personales del titular por privacidad. El PDF se generó en tu navegador.'),
    y,
  );

  return doc.output('arraybuffer');
}
