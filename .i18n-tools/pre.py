"""Crea <archivo>.en.mdx con reemplazos automáticos (títulos de políticas SGX y enlaces /kudo → /en/kudo)."""
import re, sys
P = {
'Política de Seguridad de la Información':'Information Security Policy','Política de Documentos y Registros':'Documents and Records Policy',
'Política de Gestión de Riesgos':'Risk Management Policy','Política de Gestión de Cumplimiento':'Compliance Management Policy',
'Política de Desarrollo Seguro':'Secure Development Policy','Política de Gestión de Accesos':'Access Management Policy','Política de Hardening':'Hardening Policy',
'Política de Seguridad Física':'Physical Security Policy','Política de Seguridad de TI':'IT Security Policy','Política de Seguridad de Comunicaciones':'Communications Security Policy',
'Política de Seguridad ICS/OT':'ICS/OT Security Policy','Política de Servicios en la Nube':'Cloud Services Policy','Políticas de Backups y Recuperación':'Backup and Recovery Policies',
'Política de Backups y Recuperación':'Backup and Recovery Policy','Política de Registro y Monitoreo':'Logging and Monitoring Policy',
'Política de Seguridad de Recursos Humanos':'Human Resources Security Policy','Política de Gestión de Concienciación':'Awareness Management Policy',
'Política de Gestión de Proveedores':'Vendor Management Policy','Política de Continuidad del Negocio':'Business Continuity Policy','Plan de Continuidad de Negocio':'Business Continuity Plan',
'Plan de Continuidad del Negocio':'Business Continuity Plan','Política de Gestión de Cambios y Configuraciones':'Change and Configuration Management Policy',
'Política de Gestión de Cambios y Configuración':'Change and Configuration Management Policy','Política de Gestión de Crisis':'Crisis Management Policy',
'Procedimiento de Análisis de Impacto en el Negocio (BIA)':'Business Impact Analysis (BIA) Procedure','Procedimiento de Análisis de Impacto en el Negocio':'Business Impact Analysis Procedure',
'Procedimiento y Plan de Comunicación':'Communication Procedure and Plan','Política de Gestión de Incidentes':'Incident Management Policy','Política de Privacidad':'Privacy Policy',
'Política de Gestión de Activos':'Asset Management Policy','Procedimiento de Atracción de Talento':'Talent Acquisition Procedure','Cláusulas para Colaboradores':'Employee Clauses',
'Términos y Condiciones para Colaboradores':'Terms and Conditions for Employees','Procedimiento de Concientización':'Awareness Procedure',
'Procedimiento de Gestión de Proveedores':'Vendor Management Procedure','Solicitud de Compras':'Purchase Request','Términos y Condiciones para Proveedores':'Terms and Conditions for Vendors',
'Cláusulas para Proveedores':'Vendor Clauses','Plantilla de Contrato de Proveedores':'Vendor Contract Template',
}
for src in sys.argv[1:]:
    s = open(src).read()
    for a, b in sorted(P.items(), key=lambda x: -len(x[0])):
        s = s.replace(f'title="{a}"', f'title="{b}"').replace(f' {a}"', f' {b}"').replace(f'[{a}]', f'[{b}]')
    s = re.sub(r'(href=["\(]|\]\()/kudo/', r'\1/en/kudo/', s)
    s = re.sub(r'(href=["\(]|\]\()/cyberacademy', r'\1/en/cyberacademy', s)
    open(src[:-4] + '.en.mdx', 'w').write(s)
    print('draft', src[:-4] + '.en.mdx')
