import { formatIsoWallClock } from "./dates";
import type { DayData, Lodging, Person, TripData } from "./schemas";

export type SimpleSlotKey = "morning" | "afternoon" | "evening";

export interface SimpleLine {
  time?: string;
  text: string;
}

export interface SimpleDay {
  date: string;
  weekday: string;
  md: string;
  headline: string;
  lodging: string;
  morning: SimpleLine[];
  afternoon: SimpleLine[];
  evening: SimpleLine[];
}

export interface SimpleFlight {
  label: string;
  when: string;
  route: string;
}

const PLAN2_RE = /【\s*2안\s*】/;
const SKIP_RE = /짐 정리|짐 싣기|짐 마감|생략 가능|\(TBD\)/;

function cleanTitle(title: string): string {
  return title
    .replace(/【[^】]+】\s*/g, "")
    .replace(/\s*[（(]공통[）)]\s*/g, " ")
    .replace(/\s*\(예약 필요\s*⚠️?\)\s*/g, " ")
    .replace(/\s*⚠️\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slotForTime(time?: string): SimpleSlotKey {
  if (!time) return "afternoon";
  const hour = Number.parseInt(time.slice(0, 2), 10);
  if (Number.isNaN(hour) || hour < 12) return "morning";
  if (hour < 16) return "afternoon";
  return "evening";
}

function score(title: string): number {
  if (/KE\d|출발|도착/.test(title)) return 10;
  if (/룩락|안토이|빈원더스|등불|불쇼|마사지|워터/.test(title)) return 9;
  if (/조식|점심|저녁/.test(title)) return 8;
  if (/체크인|체크아웃/.test(title)) return 7;
  if (/풀|산책/.test(title)) return 5;
  if (/이동/.test(title)) return 3;
  return 4;
}

function shortLodging(name: string): string {
  return name
    .replace(/\s*호텔 앤 레지던스.*$/, "")
    .replace(/\s*리조트.*$/, "")
    .replace(/\s*호텔.*$/, "")
    .trim();
}

function headline(title: string): string {
  return title.split("·").slice(0, 2).join("·").trim();
}

function whoLabel(
  peopleIds: string[] | undefined,
  peopleById: Map<string, Person>,
): string {
  if (!peopleIds?.length) return "";
  const names = peopleIds
    .map((id) => peopleById.get(id)?.nameShort)
    .filter((n): n is string => Boolean(n));
  if (!names.length) return "";
  return names.join("·");
}

function pickLines(lines: SimpleLine[], limit = 3): SimpleLine[] {
  if (lines.length <= limit) return lines;
  return [...lines]
    .sort((a, b) => score(b.text) - score(a.text))
    .slice(0, limit)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
}

export function buildSimpleSchedule(
  trip: TripData,
  days: DayData[],
  peopleById: Map<string, Person>,
): { days: SimpleDay[]; flights: SimpleFlight[] } {
  const lodgingById = new Map(trip.lodgings.map((l: Lodging) => [l.id, l]));

  const simpleDays: SimpleDay[] = days.map((day) => {
    const buckets: Record<SimpleSlotKey, SimpleLine[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    for (const a of day.activities) {
      if (PLAN2_RE.test(a.title)) continue;
      if (SKIP_RE.test(a.title) && !/조식|출발|도착/.test(a.title)) continue;
      const text = cleanTitle(a.title);
      if (!text) continue;
      const who = whoLabel(a.peopleIds, peopleById);
      buckets[slotForTime(a.time)].push({
        time: a.time,
        text: who ? `${text} (${who})` : text,
      });
    }

    const lodging = day.lodgingId
      ? lodgingById.get(day.lodgingId)
      : undefined;
    const sleep =
      day.date === trip.endDate
        ? "귀국"
        : lodging
          ? shortLodging(lodging.name)
          : "—";
    const [y, m, d] = day.date.split("-").map(Number);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][
      new Date(Date.UTC(y, m - 1, d)).getUTCDay()
    ];

    return {
      date: day.date,
      weekday,
      md: `${m}/${d}`,
      headline: headline(day.title),
      lodging: sleep,
      morning: pickLines(buckets.morning),
      afternoon: pickLines(buckets.afternoon),
      evening: pickLines(buckets.evening),
    };
  });

  const flights: SimpleFlight[] = trip.transports
    .filter((t) => t.type === "flight")
    .map((t) => {
      const dep = formatIsoWallClock(t.departAt);
      return {
        label: t.label,
        when: `${t.flightNumber ?? t.operator ?? ""} ${dep.time}`.trim(),
        route: `${t.from.name.replace(/\s*터미널.*$/, "")} → ${t.to.name.replace(/\s*터미널.*$/, "")}`,
      };
    });

  return { days: simpleDays, flights };
}
