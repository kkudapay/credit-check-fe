//연체 정보 포맷하는 함수 담은 파일. 나중에 백엔드로 넘길것.

export function formatCurrency(value: number): string {
  
  if (value === 0) return "0원"

  const units = ["천", "만", "0만", "00만", "000만", "억", "0억", "00억", "000억", "조"]
  const str = value.toString()
  const len = str.length
  

  let unitIndex = len - 1 // 자릿수에 따라 단위 결정
  if (unitIndex < 0) return "0원"

  const firstDigit = str[0]
  const unit = units[unitIndex] ?? ""
 

  return `${firstDigit}${unit}원`
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
