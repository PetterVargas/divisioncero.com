import Link from 'next/link';
import { legal } from '@/lib/source';
import { ScrollText } from 'lucide-react';
import { pageMetadata } from '@/lib/shared';

export default function LegalIndexPage() {
  const posts = legal.getPages();

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-fd-primary/10 rounded-lg flex items-center justify-center">
            <ScrollText className="h-7 w-7 text-fd-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Legal</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          Términos, políticas y compromisos de DivisionCero.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col gap-2 p-6 rounded-xl border border-fd-border/60 bg-fd-card/40 hover:border-fd-foreground/40 hover:bg-fd-card/70 transition-all duration-200 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{post.data.title}</h2>
            <p className="text-fd-muted-foreground text-sm">{post.data.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function generateMetadata() {
  return pageMetadata({
    path: '/legal',
    title: 'Legal',
    description: 'Términos de servicio, política de privacidad, política de cookies y centro de confianza de DivisionCero.',
  });
}
