//회사 상세 페이지 렌더링 함수를 담은 파일
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTotalData, formatBusinessNumber, getOverdueData, type BusinessData, type OverdueData, getBusinessData } from '@/lib/business-utils';
import { formatCurrency, calculateDaysAgo, format_date } from '@/lib/format-utils';

import { ChevronRight, ChevronLeft } from 'lucide-react';
import Timeline from '@/components/ui/timeline';

import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar'

import TagManager from "react-gtm-module";
import KkudaHeader from "@/components/ui/KkudaHeader";

type BusinessInfo = {
  businessNumber: string;
  taxpayerStatus?: string;
  taxType?: string;
  corporateNumber?: string;
  businessType?: string;
  companyName?: string;
  address?: string;
  closureDate?: string;
};

type SearchCache = {
  [keyword: string]: BusinessInfo[];
};

//회사 상세 페이지 렌더링 함수
export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<BusinessData & OverdueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showGraph, setShowGraph] = useState(false); // 🔹 그래프 토글 상태

  const businessNumber = params.businessNumber as string;

  //사용자 흐름에 따라 알맞은 요소를 화면에 렌더링함.
  //(리액트 컴포넌트가 렌더링될 때마다 반복 수행)
  useEffect(() => {
    const timer = setTimeout(() => {

      const searchTerm = sessionStorage.getItem('biz_search_current_term');
      const raw = window.sessionStorage.getItem('biz_search_map');
      const cache: SearchCache = raw ? JSON.parse(raw) : {};




      //sessionStorage에 사업자 정보 있을 경우
      if (searchTerm && cache[searchTerm]) {

        const match_biz_data = cache[searchTerm].find((item) => item.businessNumber.replace(/-/g, '') === businessNumber);
        if (match_biz_data) {


          //연체정보 조회 (현재는 더미데이터)
          const fetchData = async () => {
            try {
              const overdue_data = await getOverdueData(businessNumber);

              if (overdue_data) {

                setCompanyData({
                  ...match_biz_data,
                  ...overdue_data,
                });
                console.log("상세페이지 SessionStorage 사용");
              } else {
                setNotFound(true);
              }
            } catch (error) {
              console.error("캐시사용, 연체정보 조회 오류:", error);
              setNotFound(true);
            } finally {
              setIsLoading(false);
            }
          };

          fetchData();
          return () => clearTimeout(timer);
        } else {
          console.log("일치하는 값 없음");
        }
      }

      //sessionStorage에 사업자 정보 없을 경우
      const fetchData = async () => {
        try {
          console.log("상세페이지 api 호출");
          const data = await getTotalData(businessNumber); // 🔧 await 추가
          if (data) {
            setCompanyData(data);

          } else {
            setNotFound(true);
          }
        } catch (error) {
          console.error("getTotalData 오류:", error);
          setNotFound(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [businessNumber]);

  const handleClick_GTM = () => {
    const tagManagerArgs = {
      dataLayer: {
        event: "button_click",
        button_id: 'overdue_detail'
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  };

  //URL /biz로 이동하는 함수 (뒤로가기)
  const handleBack = () => {
    router.push('/biz');
  };

  //로딩중 화면
  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <HamburgerWithSidebar />


        <div className="flex items-center justify-center h-screen">
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
      <div >
        <HamburgerWithSidebar />
        <KkudaHeader />

        <div className="mobile-container min-h-[calc(150vh/2)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg ">
              국세청에 등록되지 않은 사업자입니다
            </p>
          </div>
        </div>
      </div>
    );
  }


  //해당하는 회사 정보가 있을 경우
  return (
    <div className="min-h-screen ">
      <HamburgerWithSidebar />
      {/* Header */}

      <KkudaHeader />


      {/* Content */}
      <div className="mobile-container py-6 space-y-6">
        {/* Company Name */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {companyData.companyName}
          </h1>
        </div>

        {!showGraph ? (<>
          {/* 연체정보 */}
          <div>
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900 mr-2">연체 정보</h2>
              {companyData.overdueInfo.hasOverdue && (<button
                onClick={() => { handleClick_GTM(); setShowGraph(!showGraph); }}
                className="text-gray-600 hover:text-gray-800"
                data-gtm-id="overdue_detail"
              >
                <ChevronRight className="w-5 h-5" />
              </button>)}
            </div>




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
                <span className="font-medium">{formatBusinessNumber(companyData.businessNumber)}</span>
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
                  {companyData.address
                    ? `${companyData.address}`
                    : '-'}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-gray-700">폐업일</span>
                <span className="font-medium">
                  {companyData.closureDate
                    ? `${format_date(companyData.closureDate)}`
                    : '-'}
                </span>
              </div>

            </div>
          </div>
        </>) : (<>

          <div className="flex items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mr-2">연체건 경과일</h2>
            {companyData.overdueInfo.hasOverdue && (<button
              onClick={() => setShowGraph(!showGraph)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>)}
          </div>

          <Timeline />
        </>
        )}
      </div>


      {/* Footer indicator */}
      <div className="pb-8">
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
      </div>
    </div>
  );
}