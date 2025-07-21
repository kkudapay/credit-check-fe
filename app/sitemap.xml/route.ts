import sitemap from '@/lib/sitemap';


export const revalidate = 604800;

// app/sitemap.xml/route.ts
export async function GET() {
  const _sitemap = await sitemap();

  return new Response(_sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
