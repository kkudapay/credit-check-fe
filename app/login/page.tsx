//로그인 페이지
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';

import supabase from '@/lib/supabaseClient'
import { login, logout } from '@/lib/auth-utils';

import { toast } from 'sonner';

import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';

import { getCurrentSession } from '@/lib/auth-utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);


  useEffect(() => {
  
      const checkSession = async () => {
        const session = await getCurrentSession();
        setIsLoggedIn(!!session);
      };
  
      checkSession();
    }, []);
  
    useEffect(() => {
  
      if (isLoggedIn === null) return; // 세션 확인 아직 안 끝났으면 아무것도 안함
  
      if (isLoggedIn) {
        setIsLoading(false);
        return;
      }

      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }
  
  
    }, [isLoggedIn]);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    // 기본 유효성 검사
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setIsLoading(true)

    // 로그인 처리
    const { data, error } = await login(email, password);

    setIsLoading(false)

    if (error) {
      setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다' })
      setIsLoading(false)
      return
    }

    toast.success('로그인되었습니다. 어서오세요!', {
      duration: 2000,
    });

    // 로그인 성공
    router.refresh() // 세션 갱신
    router.push('/biz')
  };

  // 로그아웃 처리
    const handleLogout = async () => {
    try {
      const { error } = await logout();
  
      if (error) {
        toast.error('로그아웃 중 오류가 발생했습니다.');
        console.error('Logout Error:', error.message);
        return;
      }
  
      setIsLoggedIn(false);
      
      toast.info('정상적으로 로그아웃 되었습니다.', {
        duration: 2000,
      });
  
      router.push('/biz');
      router.refresh();
    } catch (err) {
      console.error('Unexpected Logout Error:', err);
      toast.error('예상치 못한 오류가 발생했습니다.');
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleGoHome = () => {
    router.push('/biz');
  };


  if (isLoggedIn) {
      return (
        <div>
          <HamburgerWithSidebar />
          <div className="min-h-screen">
          <KkudaHeader />
  
          <div className="mobile-container min-h-[calc(150vh/2)] flex flex-col items-center justify-center">
            <div className="text-center py-5">
              <p className="text-gray-600 text-lg">
                이미 로그인되어 있습니다.
              </p>
            </div>
            <div className="text-center">
                <p className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer" onClick={handleLogout}>
                   로그아웃 할까요?
                  
                </p>
              </div>
          </div>
          </div>
          
          <KkudaFooter/>
        </div>
      );
    }

    if (isLoading) {
        return (
          <div>
            <HamburgerWithSidebar />
    
    
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">로딩중...</p>
              </div>
            </div>
          </div>
        );
      }


  return (

    <div>
      <HamburgerWithSidebar />
      <KkudaHeader />
      <div className="min-h-screen flex flex-col">
        {/* Header */}




        {/* Body */}
        <div className="mobile-container py-8 flex-1">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              로그인
            </h1>

            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={isLoading || !email.trim() || !password.trim()}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-base"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  '로그인'
                )}
              </Button>

              {/* <div className="text-center">
                <p className="text-gray-600">
                  아직 계정이 없으신가요?{' '}
                  <Link href="/biz/register" className="text-orange-500 hover:text-orange-600 font-medium">
                    회원가입
                  </Link>
                </p>
              </div> */}

            </div>
          </div>
        </div>

        
      </div>
      <KkudaFooter/>
    </div>
  );
}