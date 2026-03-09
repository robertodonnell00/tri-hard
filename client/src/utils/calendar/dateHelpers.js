export function getDayOffset(dayName) {
  const offsets = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  return offsets[dayName] ?? 0;
}

export function formatDateToYYYYMMDD(date) {
  return date.toISOString().split("T")[0];
}