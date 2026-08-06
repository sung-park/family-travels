/** Trip-local calendar and phase helpers (shared by home + trip detail). */

export type TravelPhase = "pre" | "during" | "post";

/** Calendar YYYY-MM-DD in the given IANA timezone. */
export function todayInTimeZone(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function getTravelPhase(
  startDate: string,
  endDate: string,
  today: string,
): TravelPhase {
  if (today < startDate) return "pre";
  if (today > endDate) return "post";
  return "during";
}

/** 1-based trip day index; null if outside range. */
export function tripDayIndex(
  startDate: string,
  endDate: string,
  today: string,
): number | null {
  if (today < startDate || today > endDate) return null;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const cur = Date.parse(`${today}T00:00:00Z`);
  return Math.floor((cur - start) / 86_400_000) + 1;
}

/** D-day: negative before trip, 0 on startDate, positive after start. */
export function daysUntilStart(startDate: string, today: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const cur = Date.parse(`${today}T00:00:00Z`);
  return Math.round((start - cur) / 86_400_000);
}

export function formatDateRangeKo(startDate: string, endDate: string): string {
  const start = formatDateKo(startDate);
  const end = formatDateKo(endDate, { omitYearIfSame: startDate.slice(0, 4) });
  return `${start} ~ ${end}`;
}

export function formatDateKo(
  isoDate: string,
  opts?: { omitYearIfSame?: string },
): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][dt.getUTCDay()];
  if (opts?.omitYearIfSame && String(y) === opts.omitYearIfSame) {
    return `${m}월 ${d}일 (${weekday})`;
  }
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

/** Format ISO datetime for display in a target TZ (or as stored wall clock). */
export function formatDateTimeKo(
  iso: string,
  timeZone?: string,
): { date: string; time: string } {
  const d = new Date(iso);
  const dateFmt = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeFmt = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { date: dateFmt.format(d), time: timeFmt.format(d) };
}

export function phaseLabelKo(phase: TravelPhase): string {
  switch (phase) {
    case "pre":
      return "출발 전";
    case "during":
      return "여행 중";
    case "post":
      return "여행 끝";
  }
}
