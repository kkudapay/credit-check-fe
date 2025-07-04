'use client';

import { createClient } from './supabaseClient';

const supabase = createClient();

// 로그인 함수
export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// 로그아웃 함수
export async function logout() {
  return await supabase.auth.signOut();
}

// 현재 세션 확인 함수
export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

//회원가입 함수
export async function register(email: string, password: string, name?: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name, // user_metadata.name
      },
    },
  });
}