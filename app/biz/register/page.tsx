//회원가입 페이지
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import { register } from '@/lib/auth-utils';
import { toast } from 'sonner';
import KkudaHeader from "@/components/ui/KkudaHeader";
import { getCurrentSession } from '@/lib/auth-utils';


export default function registerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();

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


  }, [isLoggedIn]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));



    // 에러 메시지 초기화
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrors({});

    // 유효성 검사
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // 회원가입 처리 시뮬레이션
    const { data, error } = await register(formData.email, formData.password, formData.name);

    setIsLoading(false);

    if (error) {
      setErrors({ email: error.message });
      return;
    }
    toast.success('회원가입이 완료되었습니다!', {
      duration: 2000,
    });

    router.push('/biz/login');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  const handleGoHome = () => {
    router.push('/biz');
  };

  const isFormValid = () => {
    return formData.name.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword;
  };


  if (!isLoggedIn) {
    return (
      <div>
        <HamburgerWithSidebar />
        <KkudaHeader />

        <div className="mobile-container min-h-[calc(150vh/2)] flex items-center justify-center">
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              회원가입 페이지에 접근할 권한이 없습니다.
            </p>
          </div>
        </div>
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
    <div >
      <HamburgerWithSidebar />
      <KkudaHeader />
      <div className="min-h-screen  flex flex-col">


        {/* Body */}
        <div className="mobile-container py-8 flex-1">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              회원가입
            </h1>

            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <Button
                onClick={handleSignUp}
                disabled={isLoading || !isFormValid()}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-base"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>회원가입 중...</span>
                  </div>
                ) : (
                  '회원가입'
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/biz/login" className="text-orange-500 hover:text-orange-600 font-medium">
                    로그인
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8">
          <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}