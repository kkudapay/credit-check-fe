//동적 메타데이터 설정을 위한 함수를 담은 파일
import { Metadata } from 'next';
import {getBlogTitle} from '@/lib/getBlogTitle';

//변수지정
interface Props {
  params: { urlPath: string };
}

interface getBlogResponse {
  params: { title:string, firstSentence:string };
}




//동적 메타데이터 불러오는 함수, 사업자번호를 입력받음.
export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const urlPath = params.urlPath;
const safeUrlPath = Array.isArray(urlPath) ? urlPath[0] : urlPath;
  const getBlogResponse = await getBlogTitle(safeUrlPath);

  

  
  if (getBlogResponse) {
   
      return {
    title: `${getBlogResponse.title} - 꾸다 외상체크`,
    description: `${getBlogResponse.firstSentence ? `${getBlogResponse.firstSentence} ` : ''}`,
    openGraph: {
      title: `[꾸다 외상체크] ${getBlogResponse.title}`,
      url: `https://credit.kkuda.kr/blog/${safeUrlPath}`,
      images: [
    {
      url: 'https://credit.kkuda.kr/image/og_image_1.png', 
      width: 1200, 
      height: 630, 
      alt: '꾸다 외상체크 썸네일',
    },
  ],
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