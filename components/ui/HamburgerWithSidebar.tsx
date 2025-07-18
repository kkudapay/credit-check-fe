'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentSession, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';



export default function HamburgerWithSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 로그인 여부 확인
  useEffect(() => {
    
    const checkSession = async () => {
    const session = await getCurrentSession();
    setIsLoggedIn(!!session);
  };

    checkSession();
    
  }, []);



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
    setIsOpen(false);
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


  return (
    <>
    
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-white shadow-lg hover:bg-gray-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Menu */}
          <nav className="mt-12 space-y-6">
            <Link 
              href="/biz"
              className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              홈
            </Link>

            {/* {isLoggedIn ? (
              
              <button
                onClick={handleLogout}
                className="block text-left w-full text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              >
                로그아웃
              </button>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  로그인
                </Link>
                <Link 
                  href="/register"
                  className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )} */}
             {isLoggedIn && (
              
              <button
                onClick={handleLogout}
                className="block text-left w-full text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              >
                로그아웃
              </button>
            
            )}
 
            
            <Link 
              href="/blog"
              className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              블로그
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}