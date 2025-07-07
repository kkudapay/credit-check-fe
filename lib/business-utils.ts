// 입력된 사업자 번호에 '-'를 추가하는 함수
export function formatBusinessNumber(input: string): string {

  const numbers = input.replace(/\D/g, '');

  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  }

  return input;
}


export interface CompanySearchResult {
  businessNumber: string;
  companyName: string;
  address?: string;
}


export interface BusinessData {
  businessNumber: string;
  taxpayerStatus?: string;
  taxType?: string;
  corporateNumber?: string;
  businessType?: string;
  companyName?: string;
  address?: string;
  closureDate?: string;
}

export interface OverdueData {
  overdueInfo: {
    hasOverdue: boolean;
    totalAmount: number;
    overdueCount: number;
    firstOverdueDate?: string;
    lastOverdueDate?: string;
  };
  lastUpdated: string;
}


//검색어에 해당하는 사업자 배열을 반환 함수
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


//사업자 및 연체정보 반환함수
export async function getTotalData(bizNumber: string): Promise<BusinessData & OverdueData> {

  if (bizNumber.length !== 10) {
    throw new Error(`잘못된 사업자 정보가 입력됐습니다. ${bizNumber}`);
  }

  const [businessData, overdueData] = await Promise.all([
    getBusinessData(bizNumber),
    getOverdueData(bizNumber),
  ]);

  if (!businessData || !overdueData) {
    throw new Error(`사업자 정보 및 연체 정보를 찾을 수 없습니다. ${bizNumber}`);
  }


  return {
    ...businessData,
    ...overdueData,
  };
}



//사업자정보 반환함수
export async function getBusinessData(bizNumber: string): Promise<BusinessData | null> {
  try {
    const response = await fetch(
      `http://52.79.99.159:8080/api/v1/company?findType=1&value=${bizNumber}&page=1`
    );

    if (!response.ok) {
      console.error("API 요청 실패:", response.status);
      return null;
    }

    const json = await response.json();

    const company = json?.data?.companyresponse?.[0];
    if (!company) return null;



    const mappedData: BusinessData = {
      businessNumber: company.bno ?? "",
      taxpayerStatus: company.b_stt ?? "",
      taxType: company.tax_type ?? "",
      corporateNumber: company.cno ?? "",
      businessType: company.companyTpye ?? "", // 오타 주의
      companyName: company.name ?? "",
      address: company.address ?? "",
      closureDate: company.closureDate ?? ""
    };

    return mappedData;
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
}

//연체 정보 반환 함수
export async function getOverdueData(bizNumber: string): Promise<OverdueData | null> {
  // 실제 API가 만들어지기 전까지는 임시값 반환
  return {
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 1500000,
      overdueCount: 2,
      firstOverdueDate: '2023-01-15',
      lastOverdueDate: '2023-06-30',
    },
    lastUpdated: new Date().toISOString(),
  };
}