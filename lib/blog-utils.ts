import { createClient as createClient_cl } from '@/lib/supabaseClient';


export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

//DB에 이미지 업로드
export async function uploadImageToSupabase(file: File): Promise<string> {
  const supabase = createClient_cl();

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
  console.log('index + marker.length: ', publicUrl.substring(index + marker.length));

  // 'images/...' 경로 추출
  return publicUrl.substring(index + marker.length);
}

//DB에 이미지 삭제
export async function deleteImageFromSupabase(url: string): Promise<void> {
  console.log('안쓴 이미지 삭제, url: ', url);
  const supabase = createClient_cl();
  const filePath = extractFilePathFromUrl(url);
  console.log('filePath: ', filePath);
  /*
  const { data, error } = await supabase.storage.from('images').list('blog-images');
console.log(data);
*/
  const { data, error } = await supabase.storage.from('images').remove([filePath]);
  console.log('삭제 요청 후 data: ', data);
  
  if (error) {
    console.error('삭제 오류:', error.message);
    throw new Error('이미지 삭제 실패');
  }
}



// 모든 블로그 포스트 가져오기
export async function getBlogPosts() {
  const supabase = createClient_cl();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

// 특정 블로그 포스트 가져오기
export async function getBlogPost(id: number) {
  const supabase = createClient_cl();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}



export async function checkAdminOrThrow() {
  const supabase = createClient_cl();
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error || !session?.user) throw error ?? new Error("로그인 필요");

  const role = session.user.app_metadata?.role;

  if (role !== 'admin') throw new Error("관리자 권한이 없습니다.");
  console.log(session.user.app_metadata)
  return session.user.id;

}


// 블로그 포스트 생성
export async function createBlogPost({ title, content }: { title: string; content: string }) {
  const supabase = createClient_cl();
  const userId = await checkAdminOrThrow();

  const { data, error: insertError } = await supabase
    .from('blog_posts')
    .insert([{ title, content, userId }]);

  if (insertError) throw insertError;
  return data;
}



// 블로그 포스트 업데이트
export async function updateBlogPost(id: number, { title, content }: { title: string; content: string }) {
  const supabase = createClient_cl();
  await checkAdminOrThrow();

  const { data, error: updateError } = await supabase
    .from('blog_posts')
    .update({
      title,
      content,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) throw updateError;
  return data;
}


// 블로그 포스트 삭제
export async function deleteBlogPost(id: number) {
  const supabase = createClient_cl();
  await checkAdminOrThrow();

  const { error: deleteError } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;
}
