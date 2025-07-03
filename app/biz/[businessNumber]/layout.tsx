//동적 메타데이터 설정을 위한 함수를 담은 파일
import { Metadata } from 'next';
import { getCompanyData } from '@/lib/business-utils';

//변수지정
interface Props {
  params: { businessNumber: string };
}

//동적 메타데이터 불러오는 함수, 사업자번호를 입력받음.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const businessNumber = params.businessNumber;
  const companyData = getCompanyData(businessNumber); //입력받은 사업자 번호에 해당하는 사업자 정보를 받아옴
  
  if (!companyData) {
    return {
      title: `${businessNumber} 사업자 정보를 찾을 수 없습니다 - 꾸다 외상체크`, 
      description: '입력하신 사업자번호로 등록된 정보를 찾을 수 없습니다.',
    };
  }

  const companyName = companyData.companyName;
  
  //동적 메타데이터 반환
  return {
    title: `${companyName} 사업자번호 연체내역 - 꾸다 외상체크`,
    description: `${companyName} 사업자등록번호 조회. 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.`,
    openGraph: {
      title: `${companyName} 사업자번호 연체내역 - 꾸다 외상체크`,
      description: `${companyName} 사업자등록번호 조회. 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.`,
      url: `https://kkudacheck.kr/biz/${businessNumber}`,
    },
    alternates: {
      canonical: `https://kkudacheck.kr/biz/${businessNumber}`,
    },
  };
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}