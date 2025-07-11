//연체 정보 포맷하는 함수 담은 파일. 나중에 백엔드로 넘길것.

export function formatCurrency(amount: number): string {
  if (amount >= 100000000) {
    const billions = Math.floor(amount / 100000000);
    const remainder = amount % 100000000;
    if (remainder === 0) {
      return `${billions}억원`;
    } else {
      const millions = Math.floor(remainder / 10000);
      return `${billions}억 ${millions}만원`;
    }
  } else if (amount >= 10000) {
    return `${Math.floor(amount / 10000)}만원`;
  } else {
    return `${amount.toLocaleString()}원`;
  }
}

export function calculateDaysAgo(date: string): number {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

export function formatDate(date: string): string {
  const targetDate = new Date(date);
  return targetDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function format_date (dateString: string): string {
  if (!/^\d{8}$/.test(dateString)) {
    throw new Error("올바르지 않은 날짜 형식입니다. (예: '20240502')");
  }

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return `${year}-${month}-${day}`;
}


// 새 게시글 여부 확인 (4일 이내)
export const isNewPost = (dateString: string): boolean => {
  const daysAgo = calculateDaysAgo(dateString);
  return daysAgo <= 4;
};
