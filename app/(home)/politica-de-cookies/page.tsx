import { LegalPage } from '@/components/legal-page';

export default function PoliticaDeCookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      subtitle="Cómo usamos las cookies en DivisionCero"
      effectiveDate="1 de diciembre de 2025"
    >
      <p>
        En DivisionCero, utilizamos cookies para mejorar tu experiencia, garantizar la seguridad
        de la plataforma y ofrecerte funciones relevantes.
      </p>

      <h2>Tipos de cookies que utilizamos</h2>

      <h3>Cookies esenciales</h3>
      <p>
        Habilitan funciones básicas como el inicio de sesión y la seguridad de la sesión. Por
        ejemplo, las cookies de autenticación que mantienen tu sesión iniciada.
      </p>

      <h3>Cookies de rendimiento</h3>
      <p>
        Analizan patrones de uso para mejorar la plataforma, como el seguimiento de las páginas
        visitadas para optimizar funcionalidades.
      </p>

      <h3>Cookies de funcionalidad</h3>
      <p>
        Almacenan preferencias para personalizar tu experiencia, como el idioma seleccionado.
      </p>

      <h3>Cookies de marketing (opcionales)</h3>
      <p>
        Ofrecen contenido relevante y miden la efectividad de campañas mediante publicidad
        dirigida a usuarios recurrentes.
      </p>

      <h2>Gestión de cookies</h2>
      <p>
        Puedes administrar o deshabilitar las cookies desde la configuración de tu navegador,
        aunque deshabilitar las cookies esenciales puede limitar la funcionalidad de la
        plataforma.
      </p>

      <h2>Cookies de terceros</h2>
      <p>
        Podemos colaborar con socios de confianza para ofrecer servicios de analítica y marketing.
      </p>

      <h2>Tu consentimiento</h2>
      <p>
        El uso de la plataforma implica la aceptación de nuestras prácticas de cookies. Puedes
        retirar o modificar tu consentimiento en cualquier momento.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes dudas sobre nuestra política de cookies, contáctanos a través de nuestros
        canales oficiales.
      </p>
    </LegalPage>
  );
}

export function generateMetadata() {
  return {
    title: 'Política de cookies | DivisionCero',
    description: 'Cómo y para qué DivisionCero utiliza cookies en su plataforma.',
  };
}
