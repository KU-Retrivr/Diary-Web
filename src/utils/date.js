export function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDiaryDate(dateString) {
  if (!dateString) {
    return '날짜 없음';
  }

  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) {
    return dateString;
  }

  return `${year}. ${month}. ${day}`;
}
