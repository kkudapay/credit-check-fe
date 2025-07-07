//검색페이지 & 검색결과페이지 화면 렌더링 및 처리 함수를 담은 파일
'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { formatBusinessNumber, searchCompanies, type CompanySearchResult } from '@/lib/business-utils';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar'

export default function BizSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();

  //검색 처리 함수
  const handleSearch = async () => {
    //검색어 없을 경우 '검색하기' 버튼 비활성화
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(false);
    setNoResults(false);


    setTimeout(async () => {
      const results = await searchCompanies(searchQuery); //검색어에 해당하는 사업자 배열 반환받음
      setSearchResults(results);
      setShowResults(true);
      setNoResults(results.length === 0); //배열의 요소가 없으면 (=길이가 0이면) true
      setIsSearching(false);
    }, 800);
  };


  //엔터키 누르면 검색되게 설정
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  //원하는 회사 클릭시 처리 함수
  const handleCompanySelect = (businessNumber: string) => {
    router.push(`/biz/${businessNumber.replace(/-/g, '')}`);
  };

  const handleGoHome = () => {
    console.log('Clicked!');
    router.push('/biz');
     
  };


  //입력값이 10자리 숫자일 경우 사업자번호 형식으로 변환하고 변수값을 변환된 값으로 업데이트
  //(사용자가 입력할 때마다 실행됨)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (/^\d+$/.test(value.replace(/-/g, '')) && value.replace(/-/g, '').length <= 10) {
      const formatted = formatBusinessNumber(value);
      if (formatted !== value) {
        setSearchQuery(formatted);
      }
    }
  };

  return (

    <div className="min-h-screen bg-gray-50">
      <HamburgerWithSidebar />
    
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b mb-10">
        <div className="mobile-container py-4 flex justify-between items-center">
          <div onClick={handleGoHome} className="bg-orange-500 text-white px-3 py-2 rounded text-base font-medium mt-2 mb-2 cursor-pointer ">
            꾸다 외상체크
          </div>
        </div>
      </div>


      {/* Body */}
      <div className="mobile-container py-8 flex-1">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            사업자번호 연체정보 조회
          </h1>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="사업자번호 또는 상호명을 입력하세요"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
              disabled={isSearching}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-base mb-6"
          >
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>검색중...</span>
              </div>
            ) : (
              '검색하기'
            )}
          </Button>
            
          

          {!isSearching && noResults && (
            <div className="text-center text-gray-600 py-8">
              국세청에 등록되지 않은 사업자입니다
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((company) => (
                <div
                  key={company.businessNumber}
                  onClick={() => handleCompanySelect(company.businessNumber)}
                  className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:border-orange-300 transition-colors"
                >
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">{company.companyName}</h3>
                    <p className="text-sm text-gray-600">{company.businessNumber}</p>
                    {company.address && (
                      <p className="text-sm text-gray-500">{company.address}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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