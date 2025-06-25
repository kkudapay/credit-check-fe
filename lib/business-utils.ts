//더미데이터와 검색된 사업자에 해당하는 사업자 정보를 반환하는 함수를 담은 파일

// 입력된 사업자 번호에 '-'를 추가하는 함수
export function formatBusinessNumber(input: string): string {
  
  const numbers = input.replace(/\D/g, '');
  
  //만약 10자리가 정상 입력됐으면 사업자 번호 형식으로 변환해 보여줌
  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  }
  
  //사업자 번호가 아닐 경우 원래값 return
  return input;
}

//사업자 번호가 10자리인지 확인하는 함수
export function validateBusinessNumber(businessNumber: string): boolean {
  const numbers = businessNumber.replace(/\D/g, '');
  
  if (numbers.length !== 10) {
    return false;
  }

  return /^\d{10}$/.test(numbers);
}

//검색결과 인터페이스
export interface CompanySearchResult {
  businessNumber: string;
  companyName: string;
  address?: string;
}

//회사 정보 인터페이스(데이터베이스)
export interface CompanyData {
  businessNumber: string;
  companyName: string;
  corporateNumber?: string;
  address: string;
  businessType: string;
  taxpayerStatus: '계속사업자' | '휴업자' | '폐업자';
  taxType?: string;
  overdueInfo: {
    hasOverdue: boolean;
    totalAmount: number;
    overdueCount: number;
    firstOverdueDate?: string;
    lastOverdueDate?: string;
  };
  lastUpdated: string;
  closureDate?: string;
}

// 더미 데이터
const dummyCompanies: Record<string, CompanyData> = {
  '4798101276': {
    businessNumber: '479-81-01276',
    companyName: '동그라미 주식회사',
    address: '서울시 마포구 양화로 122, 11층(서교동 프론트원)',
    businessType: '소프트웨어 개발업',
    taxpayerStatus: '계속사업자',
    taxType: '일반과세자',
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 50000000,
      overdueCount: 3,
      firstOverdueDate: '2024-01-15',
      lastOverdueDate: '2024-02-28'
    },
    lastUpdated: '2024-03-15'
  },
  '1234567890': {
    businessNumber: '123-45-67890',
    companyName: '테스트컴퍼니',
    corporateNumber: '111111-5678952',
    address: '서울특별시 강남구 테헤란로 123',
    businessType: '도소매업',
    taxpayerStatus: '계속사업자',
    taxType: '일반과세자',
    overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0
    },
    lastUpdated: '2024-03-16'
  },
  '2345678901': {
    businessNumber: '234-56-78901',
    companyName: '한국유통(주)',
    corporateNumber: '110111-2345678',
    address: '부산광역시 해운대구 센텀로 456',
    businessType: '도소매업',
    taxpayerStatus: '계속사업자',
    taxType: '일반과세자',
    overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0
    },
    lastUpdated: '2024-03-14'
  },
  '3456789012': {
    businessNumber: '345-67-89012',
    companyName: '미래건설',
    address: '대구광역시 중구 중앙로 789',
    businessType: '건설업',
    taxpayerStatus: '휴업자',
    taxType: '일반과세자',
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 120000000,
      overdueCount: 8,
      firstOverdueDate: '2023-11-20',
      lastOverdueDate: '2024-01-10'
    },
    lastUpdated: '2024-03-13'
  },
  '5641891233': {
    businessNumber: '564-18-91233',
    companyName: '주식회사 베이어이',
    address: '서울시 강남구 테헤란로 321',
    businessType: '정보통신업',
    taxpayerStatus: '계속사업자',
    taxType: '일반과세자',
    overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0
    },
    lastUpdated: '2024-03-16'
  }
};



//검색어에 해당하는 사업자 배열을 반환하는 함수 => 데이터 어떻게 비교할지 수정 필요
export function searchCompanies(query: string): CompanySearchResult[] {
  const results: CompanySearchResult[] = [];
  
  //인자값에서 '-'를 제거한 복제값
  const formattedQuery = query.replace(/\D/g, '');
  
  //더미데이터의 모든 값과 비교 -> 수정 필요 (디비값 읽기)
  Object.values(dummyCompanies).forEach(company => {
    const companyNumber = company.businessNumber.replace(/\D/g, '');
    
    // 검색한 사업자 번호를 포함하는 사업자 찾기
    if (companyNumber.includes(formattedQuery) && formattedQuery.length >= 1) {
      results.push({
        businessNumber: company.businessNumber,
        companyName: company.companyName,
        address: company.address
      });
    }
    
    // 검색한 사업자명을 포함하는 사업자 찾기
    if (company.companyName.toLowerCase().includes(query.toLowerCase()) && query.length >= 1) {
      // 이미 위의 if문에서 결과 배열에 추가됐을 경우 중복 추가 방지
      if (!results.find(r => r.businessNumber === company.businessNumber)) {
        results.push({
          businessNumber: company.businessNumber,
          companyName: company.companyName,
          address: company.address
        });
      }
    }
  });
  
  return results.slice(0, 10); //결과 배열에서 최대 10개 반환
}


//사업자 번호에 해당하는 사업자 정보를 반환하는 함수
export function getCompanyData(businessNumber: string): CompanyData | null {
  //입력된 사업자 번호 중 숫자가 아닌 것을 공백으로 전환
  const cleanNumber = businessNumber.replace(/\D/g, ''); 
  //사업자 번호가 더미데이터에 있는지 확인 -> 나중에 수정 필요 (디비값에서 조회)
  const company = Object.values(dummyCompanies).find(company => 
    company.businessNumber.replace(/\D/g, '') === cleanNumber
  );
  
  return company || null;
}