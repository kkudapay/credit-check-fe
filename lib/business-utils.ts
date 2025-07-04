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
/*
//사업자 번호가 10자리인지 확인하는 함수
export function validateBusinessNumber(businessNumber: string): boolean {
  const numbers = businessNumber.replace(/\D/g, '');
  
  if (numbers.length !== 10) {
    return false;
  }

  return /^\d{10}$/.test(numbers);
}
*/

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
  taxpayerStatus: string;
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
  
};



//검색어에 해당하는 사업자 배열을 반환하는 함수 => 데이터 어떻게 비교할지 수정 필요
export async function searchCompanies(input: string) {
  const cleaned = input.replace(/-/g, '');
  const isBusinessNumber = /^\d{10}$/.test(cleaned);

  const findType = isBusinessNumber ? 1 : 3;
  const value = isBusinessNumber ? cleaned : input;
  const page = 1;
  

  const queryParams = new URLSearchParams({
    findType: findType.toString(),
    value,
    page: page.toString(),
  });

  const url = `http://52.79.99.159:8080/api/v1/company?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`요청 실패: ${response.status}`);
    }

    const json = await response.json();
    const rawCompanies = json.data.companyresponse;
    

    
    const mappedResults: CompanySearchResult[] = rawCompanies.map((item: any) => ({
      businessNumber: item.bno,
      companyName: item.name,
      address: item.address ?? '', // 주소 없으면 빈 문자열 또는 undefined
    }));

    return mappedResults;
  } catch (error) {
    console.error('회사 검색 중 오류:', error);
    return [];
  }
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