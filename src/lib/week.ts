import { getISOWeek, getISOWeekYear, startOfISOWeek, addDays, format, parseISO, isToday as dfIsToday } from "date-fns";
import { cs } from "date-fns/locale";

const DAY_NAMES = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
const DAY_NAMES_SHORT = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

export function getWeekId(date: Date): string {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getWeekDates(weekId: string): Date[] {
  const [yearStr, weekStr] = weekId.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // Create a date in January of the given year, then find the correct week
  const jan4 = new Date(year, 0, 4); // Jan 4 is always in ISO week 1
  const startOfWeek1 = startOfISOWeek(jan4);
  const startOfTargetWeek = addDays(startOfWeek1, (week - 1) * 7);

  return Array.from({ length: 7 }, (_, i) => addDays(startOfTargetWeek, i));
}

export function navigateWeek(weekId: string, delta: number): string {
  const dates = getWeekDates(weekId);
  const newDate = addDays(dates[0], delta * 7);
  return getWeekId(newDate);
}

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateShort(date: Date): string {
  return format(date, "d.M.", { locale: cs });
}

export function getDayName(dayIndex: number): string {
  return DAY_NAMES[dayIndex] || "";
}

export function getDayNameShort(dayIndex: number): string {
  return DAY_NAMES_SHORT[dayIndex] || "";
}

export function getDayOfWeek(date: Date): number {
  // 1 = Monday, 7 = Sunday (ISO)
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

export function isToday(date: Date): boolean {
  return dfIsToday(date);
}

export function parseDate(dateStr: string): Date {
  return parseISO(dateStr);
}

export function formatWeekRange(weekId: string): string {
  const dates = getWeekDates(weekId);
  const start = format(dates[0], "d.M.", { locale: cs });
  const end = format(dates[6], "d.M.yyyy", { locale: cs });
  return `${start} - ${end}`;
}
