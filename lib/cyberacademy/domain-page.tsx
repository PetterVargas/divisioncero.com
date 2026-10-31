import {
  DocsBody, DocsDescription, DocsPage, DocsTitle,
  MarkdownCopyButton, ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig, baseUrl, academyRoute, contentDir } from '@/lib/cyberacademy/shared';
import { getContentFlowNeighbours, allDomainSources, cyberusuarioSource, cyberguardianSource } from '@/lib/cyberacademy/source';
import { findDuplicateTitles, getSeoTitleAndDescription } from '@/lib/cyberacademy/seo-context';
import { buildPageMetadata } from '@/lib/cyberacademy/metadata';
import { JsonLd, courseJsonLd, learningResourceJsonLd, breadcrumbJsonLd } from '@/lib/cyberacademy/json-ld';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import type { Metadata } from 'next';
import { canonicalUrl, defaultLocale, localizeUrl } from '@/lib/i18n';
import { getT } from '@/lib/site-translations';

type AnySource = {
  getPage: (slug?: string[], lang?: string) => any;
  generateParams: () => any;
  getPageTree: (lang?: string) => any;
};

let duplicateTitles: Set<string> | undefined;
function getDuplicateTitles() {
  duplicateTitles ??= findDuplicateTitles(
    [cyberusuarioSource, cyberguardianSource, ...allDomainSources].flatMap(
      (source) => source.getPages(defaultLocale) as { data: { title: string } }[],
    ),
  );
  return duplicateTitles;
}

function getSeo(source: AnySource, page: any, lang: string) {
  return getSeoTitleAndDescription(page, source.getPageTree(lang), getDuplicateTitles());
}

type PageFns = {
  getPageImage: (page: any) => { url: string };
  getPageMarkdownUrl: (page: any) => { url: string; segments: string[] };
};

export async function renderDomainPage(
  source: AnySource,
  fns: PageFns,
  contentSlug: string,
  slug: string[] | undefined,
  lang: string,
) {
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const t = getT(lang);
  const MDX = page.data.body;
  const markdownUrl = fns.getPageMarkdownUrl(page).url;
  const neighbours = getContentFlowNeighbours(page.url, lang);
  const seo = getSeo(source, page, lang);
  const domainRootUrl = source.getPage([], lang)?.url;
  const breadcrumbItems = [
    { name: t('Inicio'), url: `${baseUrl}${localizeUrl('/', lang)}` },
    { name: 'CyberAcademy', url: `${baseUrl}${localizeUrl(academyRoute, lang)}` },
    ...getBreadcrumbItems(page.url, source.getPageTree(lang), {
      includeRoot: { url: domainRootUrl },
      includePage: true,
    }),
  ];

  return (
    <>
      <JsonLd
        data={
          seo.isCourseRoot || !seo.course
            ? courseJsonLd({ name: seo.title, description: seo.description, url: `${baseUrl}${page.url}` })
            : learningResourceJsonLd({
                name: seo.title,
                description: seo.description,
                url: `${baseUrl}${page.url}`,
                courseName: seo.course,
              })
        }
      />
      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumbItems.map((item) => ({ name: String(item.name), url: item.url })),
        )}
      />
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        footer={{ items: neighbours }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${contentDir}/${contentSlug}/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX components={getMDXComponents({ a: createRelativeLink(source as any, page) })} />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateDomainMetadata(
  source: AnySource,
  fns: PageFns,
  slug: string[] | undefined,
  lang: string,
): Promise<Metadata> {
  const page = source.getPage(slug, lang);
  if (!page) notFound();
  const seo = getSeo(source, page, lang);
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: canonicalUrl(page),
    image: fns.getPageImage(page).url,
  });
}
