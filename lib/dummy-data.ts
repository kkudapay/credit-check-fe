// Dummy data for demonstration
export interface CompanyData {
  businessNumber: string;
  companyName: string;
  corporateNumber?: string;
  address: string;
  businessType: string;
  taxpayerStatus: '계속사업자' | '휴업자' | '폐업자';
  overdueInfo: {
    hasOverdue: boolean;
    totalAmount: number;
    overdueCount: number;
    firstOverdueDate?: string;
    lastOverdueDate?: string;
  };
  lastUpdated: string;
}

export const dummyCompanies: Record<string, CompanyData> = {
  '123-45-67890': {
    businessNumber: '123-45-67890',
    companyName: '(주)테크솔루션',
    corporateNumber: '110111-1234567',
    address: '서울특별시 강남구 테헤란로 123',
    businessType: '소프트웨어 개발업',
    taxpayerStatus: '계속사업자',
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 48000000,
      overdueCount: 3,
      firstOverdueDate: '2024-01-15',
      lastOverdueDate: '2024-02-28'
    },
    lastUpdated: '2024-03-15'
  },
  '234-56-78901': {
    businessNumber: '234-56-78901',
    companyName: '한국유통(주)',
    corporateNumber: '110111-2345678',
    address: '부산광역시 해운대구 센텀로 456',
    businessType: '도소매업',
    taxpayerStatus: '계속사업자',
    overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0
    },
    lastUpdated: '2024-03-14'
  },
  '345-67-89012': {
    businessNumber: '345-67-89012',
    companyName: '미래건설',
    address: '대구광역시 중구 중앙로 789',
    businessType: '건설업',
    taxpayerStatus: '휴업자',
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 120000000,
      overdueCount: 8,
      firstOverdueDate: '2023-11-20',
      lastOverdueDate: '2024-01-10'
    },
    lastUpdated: '2024-03-13'
  },
  '456-78-90123': {
    businessNumber: '456-78-90123',
    companyName: '글로벌무역(주)',
    corporateNumber: '110111-3456789',
    address: '인천광역시 연수구 송도로 321',
    businessType: '수출입업',
    taxpayerStatus: '계속사업자',
    overdueInfo: {
      hasOverdue: false,
      totalAmount: 0,
      overdueCount: 0
    },
    lastUpdated: '2024-03-16'
  },
  '567-89-01234': {
    businessNumber: '567-89-01234',
    companyName: '신성제조',
    address: '경기도 수원시 영통구 월드컵로 654',
    businessType: '제조업',
    taxpayerStatus: '폐업자',
    overdueInfo: {
      hasOverdue: true,
      totalAmount: 85000000,
      overdueCount: 12,
      firstOverdueDate: '2023-08-15',
      lastOverdueDate: '2023-12-20'
    },
    lastUpdated: '2024-03-12'
  }
};

export function getCompanyData(query: string): CompanyData | null {
  // Try to find by business number first
  const formattedQuery = query.replace(/\D/g, '');
  const businessNumberKey = Object.keys(dummyCompanies).find(key => 
    key.replace(/\D/g, '') === formattedQuery
  );
  
  if (businessNumberKey) {
    return dummyCompanies[businessNumberKey];
  }
  
  // Try to find by company name
  const companyByName = Object.values(dummyCompanies).find(company =>
    company.companyName.toLowerCase().includes(query.toLowerCase())
  );
  
  return companyByName || null;
}