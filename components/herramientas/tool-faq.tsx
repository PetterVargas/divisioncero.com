import { ChevronDown } from 'lucide-react';
import { toolFaqs } from '@/lib/herramientas/faqs';

/**
 * Preguntas frecuentes de una herramienta (`lib/herramientas/faqs.ts`), con su
 * JSON-LD `FAQPage`. Componente de servidor con `<details>` nativo: las respuestas
 * quedan en el HTML estático (legibles para buscadores y LLMs) y solo viaja a cada
 * página el texto de su herramienta.
 */
export function ToolFaq({ path }: { path: string }) {
  const faqs = toolFaqs[path];
  if (!faqs?.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <section aria-labelledby="preguntas-frecuentes" className="border-t border-border">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h2 id="preguntas-frecuentes" className="mb-6 text-xl font-semibold tracking-tight">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
          {faqs.map(({ question, answer }, index) => (
            <details key={question} className="group px-5 py-4" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{question}</h3>
                <ChevronDown
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
