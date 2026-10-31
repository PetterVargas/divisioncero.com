import { getRSS } from '@/lib/cyberacademy/rss';

export const revalidate = false;

export function GET() {
  return new Response(getRSS());
}
