import supabase from '@/lib/supabaseClient';


export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  urlPath: string;
}

//DB에 이미지 업로드
export async function uploadImageToSupabase(file: File): Promise<string> {
  

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `blog-images/${fileName}`;

  const { error } = await supabase.storage.from('images').upload(filePath, file);
  if (error) {
    console.error('업로드 오류:', error.message);
    throw new Error('이미지 업로드 실패');
  }

  // 공개 URL 반환
  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
}

function extractFilePathFromUrl(publicUrl: string): string {
  const marker = '/object/public/images/';
  const index = publicUrl.indexOf(marker);
  if (index === -1) {
    throw new Error('유효하지 않은 Supabase public URL');
  }
  

  // 'images/...' 경로 추출
  return publicUrl.substring(index + marker.length);
}

//DB에 이미지 삭제
export async function deleteImageFromSupabase(url: string): Promise<void> {
  
  const filePath = extractFilePathFromUrl(url);
  
  
  const { data, error } = await supabase.storage.from('images').remove([filePath]);
  
  
  if (error) {
    console.error('삭제 오류:', error.message);
    throw new Error('이미지 삭제 실패');
  }
}



// 모든 블로그 포스트 가져오기
export async function getBlogPosts() {

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

// 특정 블로그 포스트 가져오기
export async function getBlogPost(id: number) {

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getBlogPostByUrl(urlPath: string) {

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('urlPath', urlPath)
    .single();

  if (error) throw error;
  return data ?? null;
}



export async function checkAdminOrThrow() {

  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error || !session?.user) throw error ?? new Error("로그인 필요");

  const role = session.user.app_metadata?.role;

  if (role !== 'admin') throw new Error("관리자 권한이 없습니다.");
  
  return session.user.id;

}


function extractFirstSentence(html: string) {
  // 1. 태그 제거
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // 2. 첫 문장 찾기 (마침표, 물음표, 느낌표 중 하나를 기준)
  const match = text.match(/.*?[.?!]/);

  if (match) return match[0].trim();

  // 만약 구두점이 없으면 null 반환
  return null;
}



// 블로그 포스트 생성
export async function createBlogPost({ title, content, thumbnail, urlPath }: { title: string; content: string; thumbnail:string; urlPath:string }) {
 
  const userId = await checkAdminOrThrow();
  const firstSentence = extractFirstSentence(content);

  if (thumbnail!= null){
    const { data, error: insertError } = await supabase
    .from('blog_posts')
    .insert([{ title, content, userId, thumbnail, urlPath, firstSentence }]);

  if (insertError) throw insertError;
  return data;
  } else{
    const { data, error: insertError } = await supabase
    .from('blog_posts')
    .insert([{ title, content, userId, urlPath, firstSentence }]);

  if (insertError) throw insertError;
  return data;
  }
}



// 블로그 포스트 업데이트
export async function updateBlogPost(id: number, { title, content, thumbnail, urlPath }: { title: string; content: string; thumbnail:string; urlPath:string  }) {

  await checkAdminOrThrow();
  const firstSentence = extractFirstSentence(content);
  const { data, error: updateError } = await supabase
    .from('blog_posts')
    .update({
      title,
      content,
      thumbnail,
      updatedAt: new Date().toISOString(),
      urlPath,
      firstSentence
    })
    .eq('id', id);

  if (updateError) throw updateError;
  return data;
}



// 블로그 포스트 삭제
export async function deleteBlogPost(id: number) {

  await checkAdminOrThrow();

  const { error: deleteError } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;
}


export async function showSearchedUrlPath(query: string) {
const { data, error } = await supabase
  .from('blog_posts')
  .select('urlPath')
  .ilike('urlPath', `%${query}%`)
  .order('createdAt', { ascending: false });

if (error) throw error;

return data?.map((item) => item.urlPath) ?? [];
}

export async function showAllUrlPath() {

  const { data, error } = await supabase
    .from('blog_posts')
    .select('urlPath')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data.map((item) => item.urlPath) ?? [];

}