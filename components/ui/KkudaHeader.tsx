'use client' // Next.js에서 클라이언트 컴포넌트라면 필요

import { useRouter } from "next/navigation";

type HeaderProps = {
  onClick?: () => void; // optional, 필요 없다면 제거해도 됨
};

export default function KkudaHeader({ onClick }: HeaderProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick?.(); // prop으로 받은 onClick 실행 (있다면)
    router.push("/biz"); // /biz로 이동
  };

  return (




    <div className="bg-white border-b mb-6">
      <div className="mobile-container py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={handleClick}
            className="text-orange-500 text-xl font-bold mt-2 mb-2 cursor-pointer select-none"
          >
            꾸다 외상체크
          </div>
        </div>
      </div>
    </div>
  );
}
