'use client'

import { useState } from 'react'
import { Sling as Hamburger } from 'hamburger-react'
import { X } from 'lucide-react'

export default function HamburgerWithSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 햄버거 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <Hamburger toggled={isOpen} toggle={setIsOpen} />
      </div>

      {/* 오버레이 배경 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-lg font-semibold">메뉴</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <ul className="p-4 space-y-4 text-gray-800">
          <li className="hover:text-orange-500 cursor-pointer">홈</li>
          <li className="hover:text-orange-500 cursor-pointer">마이페이지</li>
          <li className="hover:text-orange-500 cursor-pointer">설정</li>
          <li className="hover:text-orange-500 cursor-pointer">로그아웃</li>
        </ul>
      </div>
    </>
  )
}
