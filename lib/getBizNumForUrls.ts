


// 모든 블로그 포스트 가져오기
async function getBusinessNumber() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/bizno_company?select=bno`;

  const res = await fetch(url, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  });

  if (!res.ok) {
    console.error('Failed to fetch:', await res.text());
    return null;
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getBizNumForUrls(): Promise<{ url: string }[]> {
    const data = await getBusinessNumber();
  
    const businessNumbers = data.map((item: {bno:string}) => item.bno);
  return businessNumbers;
}