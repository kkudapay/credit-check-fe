//동적 메타데이터 설정을 위한 함수를 담은 파일
import { Metadata } from 'next';
import {getBlogTitle} from '@/lib/getBlogTitle';

//변수지정
interface Props {
  params: { urlPath: string };
}




//동적 메타데이터 불러오는 함수, 사업자번호를 입력받음.
export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const urlPath = params.urlPath;
const safeUrlPath = Array.isArray(urlPath) ? urlPath[0] : urlPath;
  const title = await getBlogTitle(safeUrlPath);

  
  if (title) {
   
      return {
    title: `${title} - 꾸다 외상체크 블로그`,
    description: `${title} 사업자등록번호 조회. 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.`,
    openGraph: {
      title: `${title} - 꾸다 외상체크 블로그`,
      description: `${title} 사업자등록번호 조회. 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.`,
      url: `https://credit.kkuda.kr/blog/${safeUrlPath}`,
    },
    alternates: {
      canonical: `https://credit.kkuda.kr/blog/${safeUrlPath}`,
    },
  };
  } else {
    return {
      title: '요청하신 게시글을 찾을 수 없습니다. - 꾸다 외상체크', 
      description: '요청하신 게시글을 찾을 수 없습니다.',
    };
  }

  
  
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}