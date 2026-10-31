import { tools, type Tool } from '@/lib/herramientas/tools';
import type { Locale } from './config';

type ToolTranslation = Pick<Tool, 'title' | 'description'> & { href?: string };

/** Títulos y descripciones en inglés del catálogo, indexados por slug. */
const toolsEn: Record<string, ToolTranslation> = {
  conan: {
    title: 'Conan IT Tracking',
    description: 'IP address-based tracking for threat detection.',
  },
  'framework-kudo': {
    title: 'Kudo Framework',
    description: 'Open-source Cybersecurity framework for your company’s compliance.',
  },
  'grc-companias': {
    title: 'GRC for Companies',
    description: 'Manage your company’s cybersecurity governance, risk and compliance.',
  },
  cyberkit: {
    title: 'CyberKit',
    description: 'A kit of cybersecurity resources and tools to strengthen your organization.',
  },
  cybermap: {
    title: 'CyberMap',
    description: 'Visualize the threat and cyberattack landscape in real time.',
  },
  'tabla-periodica-ciberseguridad': {
    title: 'Cybersecurity Periodic Table',
    description: 'Explore the key elements of Cybersecurity visually.',
  },
  rompehielos: {
    title: 'Security Icebreakers',
    description: 'Icebreaker questions to open the conversation about security.',
  },
  'workflow-ciberseguridad': {
    title: 'Cybersecurity Workflow',
    description: 'Flowcharts for security processes and procedures.',
  },
  'calendario-ciberseguridad': {
    title: 'Cybersecurity Calendar',
    description: 'Key dates and relevant Cybersecurity events.',
  },
  'museo-cibercrimen': {
    title: 'Cybercrime Museum',
    description: 'A visual gallery of milestones, figures and iconic moments in cybercrime.',
  },
  'generador-contrasenas': {
    title: 'Password Generator',
    description: 'Create strong, random passwords instantly.',
  },
  'generador-qr': {
    title: 'QR Generator',
    description: 'Generate free QR codes for your links and campaigns.',
  },
  'generador-hash': {
    title: 'Hash Generator',
    description: 'Compute the hash of any text or file.',
  },
  'validador-spf': {
    title: 'SPF Validator',
    description: 'Check and validate your domain’s SPF records.',
  },
  'codificador-base64': {
    title: 'Base64 Encode/Decode',
    description: 'Encode and decode text in Base64.',
  },
  'codificador-url': {
    title: 'URL Encode/Decode',
    description: 'Encode and decode URLs easily.',
  },
  'codificador-hexadecimal': {
    title: 'Hex Encode/Decode',
    description: 'Encode and decode text in hexadecimal.',
  },
  'generador-uuid': {
    title: 'UUID Generator',
    description: 'Generate universally unique identifiers (UUID).',
  },
  totp: {
    title: 'TOTP Code Generator',
    description: 'Generate 2FA (TOTP) codes from a secret key, with a QR for authenticator apps.',
  },
  'conversion-de-fecha-y-hora': {
    title: 'Date & Time Converter',
    description: 'Convert dates and times between time zones (UTC, Bogotá and more).',
  },
  'triada-cia': {
    title: 'CIA Triad',
    description: 'Learn and identify Confidentiality, Integrity and Availability.',
  },
  'analizador-contrasenas': {
    title: 'Password Analyzer',
    description: 'Estimate how long it would take an attacker to crack your password.',
  },
  'deteccion-phishing': {
    title: 'Practice: Phishing Detection',
    description: 'Practice spotting phishing messages in emails and SMS.',
  },
  'suplantacion-marcas': {
    title: '10 Brand Impersonation Examples',
    description:
      'Illustrated examples of brand impersonation on Instagram, Facebook, WhatsApp, websites and more, with red flags and how to verify official accounts.',
  },
  'identificador-correos-seguros': {
    title: 'Safe vs. Unsafe Emails',
    description: 'Review a simulated inbox and tell safe emails apart from malicious ones.',
  },
  'verificar-sitio-seguro': {
    title: 'Is This Site Safe?',
    description: 'Step-by-step animation of the signs that confirm a site is safe.',
  },
  'malas-practicas-escritorio': {
    title: 'Workplace Best Practices',
    description: 'Find the 10 bad security practices on a simulated desk.',
  },
  'cual-es-mi-ip': {
    title: 'What Is My IP?',
    description: 'Check your public IP, approximate location, connection date and user agent.',
  },
  'whois-ip-y-dominio': {
    title: 'IP & Domain WHOIS',
    description:
      'Look up the owner, range and ASN of an IP, or the registrar, dates and DNS of a domain, and export a PDF.',
  },
  'identificador-id-red-social': {
    title: 'Social Media ID Finder',
    description: 'Get the ID and public data of a Facebook, Instagram, TikTok or X profile.',
  },
  'rompehielos-practicas-ciberseguridad': {
    title: 'Icebreaker: Good and Bad Practices',
    description: 'Team activity to discuss and learn good and bad cybersecurity practices.',
  },
  'checklist-buenas-practicas-equipo': {
    title: 'Team Best Practices Checklist',
    description:
      'As a leader, verify that your team and their computers meet basic cybersecurity protections.',
  },
  'checklist-incidente-seguridad': {
    title: 'Incident Mitigation Checklist',
    description: 'Immediate steps during a security incident, as a team member or as a team leader.',
  },
  'flujo-autenticacion-autorizacion': {
    title: 'Authentication, Authorization & Roles Flow',
    description:
      'See step by step how authentication, authorization and roles (fixed or custom) work for API and MCP access.',
  },
  'detector-codigo-vulnerable': {
    title: 'Vulnerable Code Detector',
    description:
      'Practice telling vulnerable from secure code: OWASP Top 10, AI/LLM Top 10, hardcoded secrets, SCA, SAST, DAST and pentesting.',
  },
  'cifrado-pgp': {
    title: 'PGP Encryption Explained',
    description:
      'How PGP encryption works step by step: public and private keys, hybrid encryption and digital signatures.',
  },
  'que-es-pii': {
    title: 'What Is PII?',
    description:
      'Learn what personally identifiable information (PII) is, its categories and how to protect it, with a practice quiz.',
  },
  'que-es-grooming': {
    title: 'What Is Grooming?',
    description:
      'An educational tool for parents, children and teens: grooming stages, warning signs and what to do, with a practice quiz.',
  },
  'que-es-sexting': {
    title: 'What Is Sexting?',
    description:
      'An educational tool on the risks of sexting: loss of control, digital permanence, legal consequences and pressure, with a practice quiz.',
  },
  'que-es-sextorsion': {
    title: 'What Is Sextortion?',
    description:
      'An educational tool on how sextortion works, its stages, warning signs and what to do if it happens, with a practice quiz.',
  },
  'generador-y-validador-hash-archivo': {
    title: 'File Hash Generator & Validator',
    description:
      'Compute the MD5, SHA-1, SHA-256 and SHA-512 of a file (PDF, ZIP, RAR, images or office files) without uploading it to any server.',
  },
  'analizador-metadatos': {
    title: 'Metadata Analyzer',
    description:
      'Uncover the hidden metadata of an image or office document (author, dates, GPS) and download a PDF report.',
  },
  'visor-hexadecimal': {
    title: 'Hex Viewer',
    description:
      'View the contents of any file byte by byte in hexadecimal and ASCII, with text or byte search.',
  },
  'endoflife-date': {
    title: 'endoflife.date',
    description: 'Check end-of-support and lifecycle dates for software, operating systems and languages.',
  },
  shodan: {
    title: 'Shodan',
    description: 'Search engine for devices and services exposed on the internet.',
  },
  'have-i-been-pwned': {
    title: 'Have I Been Pwned',
    description: 'Check whether your email or password has been exposed in a data breach.',
  },
  'fagan-finder': {
    title: 'Fagan Finder',
    description: 'A directory of hundreds of specialized search engines for online research.',
  },
  'wayback-machine': {
    title: 'Wayback Machine',
    description: 'Browse archived historical versions of any website.',
  },
  emailrep: {
    title: 'EmailRep',
    description: 'Check the reputation and risk associated with an email address.',
  },
  urlscan: {
    title: 'URLScan',
    description: 'Scan and analyze suspicious URLs to detect phishing and malicious content.',
  },
  'dominios-similares': {
    title: 'Lookalike Domains (DNSTwister)',
    description: 'Generate and detect lookalike or typosquatted domains from a given domain.',
  },
  'reputacion-ip': {
    title: 'IP Reputation (AbuseIPDB)',
    description: 'Check the abuse history and reputation of an IP address.',
  },
  maltego: {
    title: 'Maltego',
    description: 'Link analysis platform for OSINT investigations and relationship visualization.',
  },
  whatmyname: {
    title: 'WhatsMyName',
    description: 'Search for a username across hundreds of platforms and social networks.',
  },
  sherlock: {
    title: 'Sherlock',
    description: 'Command-line tool to find accounts by username across social networks.',
  },
  maigret: {
    title: 'Maigret',
    description: 'Collect information from public profiles starting from a username.',
  },
  theharvester: {
    title: 'theHarvester',
    description: 'Gather emails, subdomains, hosts and names from public sources.',
  },
  'recon-ng': {
    title: 'recon-ng',
    description: 'Modular web reconnaissance framework for OSINT investigations.',
  },
  mxtoolbox: {
    title: 'MXToolbox',
    description: 'Diagnose MX and DNS records, blacklists and the health of your email domain.',
  },
  'dns-dumpster': {
    title: 'DNS Dumpster',
    description: 'Map the subdomains and DNS infrastructure of a domain for free.',
  },
  'email-extractor': {
    title: 'Email Extractor',
    description: 'Browser extension to extract the email addresses visible on a web page.',
  },
  creepy: {
    title: 'Creepy',
    description: 'OSINT geolocation tool based on social media metadata.',
  },
  'github-dorking': {
    title: 'GitHub Dorking',
    description: 'Guide to GitHub’s advanced search syntax for finding exposed code and secrets.',
  },
  virustotal: {
    title: 'VirusTotal',
    description: 'Analyze suspicious files, URLs, domains and IPs with dozens of antivirus engines.',
  },
  'hybrid-analysis': {
    title: 'Hybrid Analysis (Sandbox)',
    description: 'Free sandbox to analyze the behavior of suspicious files and URLs for malware.',
  },
  fotoforensics: {
    title: 'FotoForensics',
    description: 'Detect image manipulation using error level analysis (ELA).',
  },
  'pdf-candy-metadata': {
    title: 'PDF Candy: Edit Metadata',
    description: 'Edit or remove a PDF’s metadata (author, dates, software) online.',
    href: 'https://pdfcandy.com/edit-pdf-meta.html',
  },
  'comprobar-correo': {
    title: 'Email Checker',
    description: 'Check whether an email address exists and is valid.',
  },
};

/** Catálogo de herramientas en el idioma indicado (si falta una traducción, queda en español). */
export function getTools(locale: Locale): Tool[] {
  if (locale === 'es') return tools;
  return tools.map((tool) => ({ ...tool, ...toolsEn[tool.slug] }));
}
