'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cookieConsentKey } from '@/lib/shared';

type Consent = 'accepted' | 'rejected';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(cookieConsentKey);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Aviso flotante de cookies (abajo a la izquierda).
 * Guarda la elección en localStorage y actualiza el Consent Mode de Google Analytics.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  // Se decide en el cliente para no desajustar la hidratación del HTML estático.
  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  function choose(consent: Consent) {
    try {
      localStorage.setItem(cookieConsentKey, consent);
    } catch {
      // Sin almacenamiento la elección solo dura esta visita.
    }
    window.gtag?.('consent', 'update', {
      analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
    });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-5 left-5 z-50 w-[calc(100vw-7rem)] max-w-xs rounded-xl border bg-fd-popover p-4 text-fd-popover-foreground shadow-lg"
    >
      <p className="text-sm">
        Nosotros usamos{' '}
        <Link
          href="/legal/politica-de-cookies"
          className="font-medium underline underline-offset-4 hover:text-fd-primary"
        >
          cookies
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose('rejected')}
          className="flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="flex-1 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
