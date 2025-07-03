'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HamburgerWithSidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
              href="/"
              className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              홈
            </Link>
            <Link 
              href="/login"
              className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              로그인
            </Link>
            <Link 
              href="/signup"
              className="block text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              회원가입
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}