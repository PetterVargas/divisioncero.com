import { LegalPage } from '@/components/legal-page';

export default function TerminosDeServicioPage() {
  return (
    <LegalPage
      title="Términos de servicio"
      subtitle="Nuestros términos y condiciones"
      effectiveDate="1 de diciembre de 2025"
    >
      <h2>1. Uso de la plataforma</h2>
      <p>
        Debes tener al menos 18 años para usar nuestra plataforma. Eres responsable de mantener
        seguras tus credenciales de acceso y de todas las actividades que ocurran bajo tu cuenta.
      </p>

      <h2>2. Tu contenido</h2>
      <p>
        Conservas la propiedad de todo el material que subas a la plataforma. Al subirlo, nos
        otorgas una licencia para usarlo con fines de funcionalidad del servicio, como la
        realización de copias de seguridad. Está prohibido subir contenido ilegal, dañino o que
        infrinja derechos de terceros.
      </p>

      <h2>3. Nuestra plataforma</h2>
      <p>
        Buscamos ofrecer un 99.9% de disponibilidad, pero no garantizamos un servicio
        ininterrumpido. Las funcionalidades pueden evolucionar con el tiempo. No está permitido
        realizar ingeniería inversa, revender o hacer un uso indebido de la plataforma.
      </p>

      <h2>4. Pagos y suscripciones</h2>
      <p>
        Los cargos no son reembolsables salvo que se especifique lo contrario. Puedes modificar o
        cancelar tu plan en cualquier momento; los cambios entran en vigor en el siguiente ciclo de
        facturación.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        No somos responsables por daños indirectos ni por las consecuencias de accesos no
        autorizados a tu cuenta.
      </p>

      <h2>6. Gobernanza de datos</h2>
      <p>
        El tratamiento de tus datos se rige por nuestra <a href="/politica-de-privacidad">Política de Privacidad</a>.
      </p>

      <h2>7. Terminación de cuenta</h2>
      <p>
        Podemos suspender o finalizar tu cuenta en caso de incumplimiento de estos términos.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos periódicamente. Te notificaremos sobre cambios
        relevantes.
      </p>

      <h2>9. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes aplicables, sin perjuicio de los derechos que te
        correspondan en tu jurisdicción.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Si tienes preguntas sobre estos términos, puedes contactarnos a través de nuestros canales
        oficiales.
      </p>
    </LegalPage>
  );
}

export function generateMetadata() {
  return {
    title: 'Términos de servicio | DivisionCero',
    description: 'Términos y condiciones de uso de la plataforma DivisionCero.',
  };
}
