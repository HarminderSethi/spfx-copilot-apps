export const calculateBusinessDays = (startDate: string, endDate: string): number => {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 0;
  }
  let count = 0;
  const endTime = end.getTime();
  for (let cursorTime = start.getTime(); cursorTime <= endTime; cursorTime += 24 * 60 * 60 * 1000) {
    const cursor = new Date(cursorTime);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
  }
  return count;
};