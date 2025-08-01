//동적 메타데이터 설정을 위한 함수를 담은 파일
import { Metadata } from 'next';
import { getTotalData } from '@/lib/business-utils';

//변수지정
interface Props {
  params: { businessNumber: string };
}

//동적 메타데이터 불러오는 함수, 사업자번호를 입력받음.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const businessNumber = params.businessNumber;
  const companyData = await getTotalData(businessNumber); //입력받은 사업자 번호에 해당하는 사업자 정보를 받아옴
  
  if (!companyData) {
    return {
      title: `${businessNumber} 사업자 정보를 찾을 수 없습니다 - 꾸다 외상체크`, 
      description: '입력하신 사업자번호로 등록된 정보를 찾을 수 없습니다.',
    };
  }

  const companyName = companyData.companyName;
  
  //동적 메타데이터 반환
  return {
    title: `${companyName} 조회 결과 - 꾸다 외상체크`,
    description: `${companyName} 사업자등록번호 조회. 연체 중인지 바로 확인하세요. 미수금 걱정을 줄이는 필수 확인 정보.`,
    openGraph: {
      title: `[꾸다 외상체크] ${companyName} 사업자등록번호 조회`,
      description: '연체 중인지 바로 확인하세요.',
      url: `https://credit.kkuda.kr/biz/${businessNumber}`,
      images: [
    {
      url: 'https://credit.kkuda.kr/image/og_image_2.png',
      width: 1200, 
      height: 630, 
      alt: '꾸다 외상체크 썸네일',
    },
  ],
    },
    alternates: {
      canonical: `https://credit.kkuda.kr/biz/${businessNumber}`,
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