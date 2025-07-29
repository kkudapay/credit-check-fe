export async function getBlogTitle(urlPath: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_titles?urlPath=eq.${urlPath}&select=title`;

  const res = await fetch(url, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch:', await res.text());
    return null;
  }

  const data = await res.json();
  if (data.length > 0) {
    return data[0].title;
  }

  return null;
}