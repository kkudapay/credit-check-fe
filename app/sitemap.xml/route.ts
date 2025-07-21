import sitemap from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

// app/sitemap.xml/route.ts
export async function GET() {
  const _sitemap = await sitemap();

  return new Response(_sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
