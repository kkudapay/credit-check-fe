import { supabase } from '@/lib/supabaseClient';

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

//로그인 상태 확인
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user || null;
}

export async function logout() {
  await supabase.auth.signOut();
}