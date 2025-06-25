//회사 상세 페이지 렌더링 함수를 담은 파일
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanyData, type CompanyData } from '@/lib/business-utils';
import { formatCurrency, calculateDaysAgo } from '@/lib/format-utils';

//회사 상세 페이지 렌더링 함수
export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const businessNumber = params.businessNumber as string;

  //사용자 흐름에 따라 알맞은 요소를 화면에 렌더링함.
  //(리액트 컴포넌트가 렌더링될 때마다 반복 수행)
  useEffect(() => {

    const timer = setTimeout(() => {
      const data = getCompanyData(businessNumber);
      if (data) {
        setCompanyData(data);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [businessNumber]);

  //URL /biz로 이동하는 함수 (뒤로가기)
  const handleBack = () => {
    router.push('/biz');
  };

  //로딩중 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b mb-20">
          <div className="mobile-container py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-1 text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>뒤로</span>
              </Button>
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                꾸다 외상체크
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh/2)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }


  //알맞은 회사 정보가 없을 경우
  if (notFound || !companyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="mobile-container py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-1 text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>뒤로</span>
              </Button>
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                꾸다 외상체크
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-container py-8">
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              국세청에 등록되지 않은 사업자입니다
            </p>
          </div>
        </div>
      </div>
    );
  }


  //해당하는 회사 정보가 있을 경우
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b mb-6">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-1 text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로</span>
            </Button>
            <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
              꾸다 외상체크
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mobile-container py-6 space-y-6">
        {/* Company Name */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {companyData.companyName}
          </h1>
        </div>
        {/* 연체정보 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">연체 정보</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              {/*연체 유무*/}
              <span className="text-gray-700">연체 유무</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${companyData.overdueInfo.hasOverdue
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
                }`}>
                {companyData.overdueInfo.hasOverdue ? '연체 있음' : '연체 없음'}
              </span>
            </div>
            {/*상세 연체 정보*/}

            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">연체 금액</span>
                <span className="font-semibold text-red-600">
                  {companyData.overdueInfo.hasOverdue
                    ? `${formatCurrency(companyData.overdueInfo.totalAmount)} 이상`
                    : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">연체 건수</span>
                <span className="font-semibold">
                  {companyData.overdueInfo.hasOverdue
                    ? `${companyData.overdueInfo.overdueCount}건`
                    : '-'}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-gray-700">마지막 연체건 경과일</span>
                <span className="font-semibold">
                  {companyData.overdueInfo.hasOverdue &&
                    companyData.overdueInfo.lastOverdueDate
                    ? `${calculateDaysAgo(companyData.overdueInfo.lastOverdueDate)}일`
                    : '-'}
                </span>
              </div>



              <div className="flex items-center justify-between">
                <span className="text-gray-700">처음 연체건 경과일</span>
                <span className="font-semibold">
                  {companyData.overdueInfo.hasOverdue &&
                    companyData.overdueInfo.firstOverdueDate
                    ? `${calculateDaysAgo(companyData.overdueInfo.firstOverdueDate)}일`
                    : '-'}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* 사업자 정보 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">사업자 정보</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">사업자등록번호</span>
              <span className="font-medium">{companyData.businessNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">납세자상태</span>
              <span className="font-medium">{companyData.taxpayerStatus}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">과세유형</span>
              <span className="font-medium">{companyData.taxType || '일반과세자'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">사업유형</span>
              <span className="font-medium">{companyData.businessType}</span>
            </div>

            
              <div className="flex items-center justify-between">
                <span className="text-gray-700">법인등록번호</span>
                <span className="font-medium">
                  {companyData.corporateNumber
                  ? `${companyData.corporateNumber}`
                  : '-'}
                  </span>
              </div>
            

            <div className="flex items-start justify-between">
              <span className="text-gray-700">주소</span>
              <span className="font-medium text-right max-w-[200px]">
                {companyData.address}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-700">폐업일</span>
              <span className="font-medium">
                {companyData.closureDate
                  ? `${companyData.closureDate}`
                  : '-'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Footer indicator */}
      <div className="pb-8">
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
      </div>
    </div>
  );
}