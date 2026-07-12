import { LegalPage } from '@/components/legal-page';

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      subtitle="¡Bienvenido a DivisionCero!"
      effectiveDate="1 de diciembre de 2025"
    >
      <p>
        Tu privacidad nos importa mucho. Esta política explica cómo recopilamos, usamos y
        protegemos tu información al usar nuestra plataforma.
      </p>

      <h2>1. Información que recopilamos</h2>
      <p>
        <strong>Información personal:</strong> nombre, correo electrónico y datos de facturación,
        recopilados para crear tu cuenta, procesar transacciones y brindarte soporte.
      </p>
      <p>
        <strong>Datos de uso:</strong> direcciones IP, características del navegador y patrones de
        comportamiento, que usamos para mejorar el rendimiento de la plataforma y mantener la
        seguridad.
      </p>

      <h2>2. Cómo usamos tu información</h2>
      <p>
        Utilizamos la información recopilada para prestar y mejorar nuestros servicios, comunicarte
        actualizaciones y responder a solicitudes de soporte, y cumplir con obligaciones legales.
      </p>

      <h2>3. Compartir datos</h2>
      <p>
        Compartimos información con proveedores de servicios que gestionan pagos, analítica y
        hosting; con autoridades legales cuando la ley lo exige; y con colaboradores estratégicos
        que ayudan a mejorar nuestra oferta de servicios. <strong>Nunca vendemos tus datos a
        terceros.</strong>
      </p>

      <h2>4. Tus derechos</h2>
      <p>
        Tienes derecho a acceder a tus datos, corregir inexactitudes, eliminar tu cuenta y optar
        por no recibir comunicaciones de marketing.
      </p>

      <h2>5. Seguridad de los datos</h2>
      <p>
        Protegemos tu información con estándares de la industria, incluyendo cifrado, servidores
        seguros y auditorías periódicas.
      </p>

      <h2>6. Política de retención</h2>
      <p>
        Conservamos tus datos únicamente durante el tiempo necesario para prestar el servicio o
        cumplir obligaciones legales.
      </p>

      <h2>7. Política de cookies</h2>
      <p>
        Para más información sobre el uso de cookies, consulta nuestra{' '}
        <a href="/politica-de-cookies">Política de Cookies</a>.
      </p>

      <h2>8. Cambios en esta Política de Privacidad</h2>
      <p>
        Te notificaremos por correo electrónico o dentro de la plataforma sobre cualquier cambio
        significativo en esta política.
      </p>

      <h2>9. Contáctanos</h2>
      <p>
        Si tienes preguntas relacionadas con la privacidad, puedes contactarnos a través de
        nuestros canales oficiales.
      </p>
    </LegalPage>
  );
}

export function generateMetadata() {
  return {
    title: 'Política de privacidad | DivisionCero',
    description: 'Cómo DivisionCero recopila, usa y protege tu información personal.',
  };
}
