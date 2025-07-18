import { getBizNumForUrls } from '@/lib/getBizNumForUrls';


export default async function sitemap() {
  const dynamicUrls = await getBizNumForUrls();


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://credit.kkuda.kr/biz</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://credit.kkuda.kr/blog</loc>
    <priority>0.8</priority>
  </url>
${dynamicUrls
      .map((bno) => `
  <url>
    <loc>https://credit.kkuda.kr/biz/${bno}</loc>
    <priority>0.9</priority>
  </url>
`)
      .join('')}
</urlset>`;

  return sitemap;
}
