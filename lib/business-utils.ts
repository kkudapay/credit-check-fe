// 입력된 사업자 번호에 '-'를 추가하는 함수
export function formatBusinessNumber(input: string): string {

  const numbers = input.replace(/\D/g, '');

  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  }

  return input;
}

/*
export interface CompanySearchResult {
  businessNumber: string;
  companyName: string;
  address?: string;
}
  */


export interface BusinessData {
  businessNumber: string;
  representName?: string; //사업자명
  taxpayerStatus?: string;
  taxType?: string;
  corporateNumber?: string;
  businessType?: string;
  companyName?: string;
  address?: string;
  ftcNum?: string; //통신판매번호
  homePg?: string; //홈페이지
  closureDate?: string;
}

export interface OverdueData {
  isOverdueData: boolean;
  overdueInfo: {
    hasOverdue: boolean;
    totalAmount: number;
    overdueCount: number;
    firstOverdueDate: number;
    lastOverdueDate: number;
  };
  lastUpdated: string;
}

interface Seg850Item {
  profCd: string;
  segId: string;
  profRsltVal: string;
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

  const url = `https://api-credit.kkuda.kr/api/v1/company?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`요청 실패: ${response.status}`);
    }

    const json = await response.json();
    const rawCompanies = json.data.companyresponse;



    const mappedResults: BusinessData[] = rawCompanies.map((item: any) => ({
      businessNumber: item.bno ?? "",
      representName: item.representName ?? "",
      taxpayerStatus: item.b_stt ?? "",
      taxType: item.tax_type ?? "",
      corporateNumber: item.cno ?? "",
      businessType: item.companyTpye ?? "", // 오타 주의
      companyName: item.name ?? "",
      address: item.address ?? "",
      ftcNum: item.ftcNum ?? "",
      homePg: item.homePage ?? "",
      closureDate: item.EndDt ?? ""
    }));

    return mappedResults;
  } catch (error) {
    console.error('회사 검색 중 오류:', error);
    return [];
  }
}


//사업자 및 연체정보 반환함수
export async function getTotalData(bizNumber: string): Promise<(BusinessData & OverdueData) | null> {

  try {
    
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
        } catch (error) {
          console.error("getTotalData 오류:", error);
          return null;
        }
  
}



//사업자정보 반환함수
export async function getBusinessData(bizNumber: string): Promise<BusinessData | null> {
  try {
    const response = await fetch(
      `https://api-credit.kkuda.kr/api/v1/company?findType=1&value=${bizNumber}&page=1`
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
      representName: company.representName ?? "",
      taxpayerStatus: company.b_stt ?? "",
      taxType: company.tax_type ?? "",
      corporateNumber: company.cno ?? "",
      businessType: company.companyTpye ?? "", // 오타 주의
      companyName: company.name ?? "",
      address: company.address ?? "",
      ftcNum: company.ftcNum ?? "",
      homePg: company.homePage ?? "",
      closureDate: company.EndDt ?? ""
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
  
  
  try {
    const res = await fetch('https://api-credit.kkuda.kr/api/v1/client/kcb/credit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bsn:bizNumber,
      }),
    })

    const json = await res.json()
console.log('전체 json: ', json)
    //const seg850 = undefined;
    const seg850 = json?.data?.seg850RspLst as Seg850Item[] | undefined;

    if (!seg850) {
      const mappedData: OverdueData = {
      isOverdueData: false,
      overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0,
      lastOverdueDate: 0,
      firstOverdueDate: 0, // 오타 주의
      }, lastUpdated: '',
    };
    console.log("null kcb반환: ", mappedData);

    return mappedData;
      
    }
    /*

    const hasOverdue = Number(seg850[0].profRsltVal);
    const totalAmount = Number(seg850[0].profRsltVal);
    const overdueCount = Number(seg850[1].profRsltVal);
    const lastOverdueDate = Number(seg850[2].profRsltVal);
    const firstOverdueDate = Number(seg850[3].profRsltVal);
    */


   const getVal = (code: string) =>
       Number(seg850.find((item: Seg850Item) => item.profCd === code)?.profRsltVal ?? null);

const hasOverdue       = getVal('D2C000065');
const totalAmount      = getVal('D2C000065');
const overdueCount     = getVal('D2C000059');
const lastOverdueDate  = getVal('D2C000067');
const firstOverdueDate = getVal('D2C000066');

    const mappedData: OverdueData = {
      isOverdueData: true,
      overdueInfo: {
      hasOverdue: hasOverdue == 0 ? false : true,
      totalAmount: totalAmount ?? "",
      overdueCount: overdueCount ?? "",
      lastOverdueDate: lastOverdueDate ?? "",
      firstOverdueDate: firstOverdueDate ?? "", // 오타 주의
      }, lastUpdated: new Date().toISOString(),
    };
    console.log("kcd 응답: ", mappedData);

    return mappedData;
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
  
 
}