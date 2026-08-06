import { getCollection } from "astro:content";
import {
  getTravelPhase,
  todayInTimeZone,
  type TravelPhase,
} from "./dates";
import { getAllPeople, getPeopleMap } from "./people";
import type { DayData, Lodging, Person, TripData } from "./schemas";
import { isPublishableTripPath } from "./trip-path";

export type { TravelPhase };

export interface TripBundle {
  trip: TripData;
  slug: string;
  body: string;
  days: Array<DayData & { body: string }>;
  people: Person[];
  phaseAtBuild: TravelPhase;
}

function assertPublishable(slug: string): void {
  if (!isPublishableTripPath(slug)) {
    throw new Error(`Non-publishable trip slug: ${slug}`);
  }
}

export async function getTripBundle(slug: string): Promise<TripBundle | null> {
  if (!isPublishableTripPath(slug)) return null;

  const trips = await getCollection("trips");
  const entry = trips.find((t) => t.id === slug);
  if (!entry) return null;

  assertPublishable(entry.id);
  const trip = entry.data as TripData;

  if (trip.slug !== slug) {
    console.warn(
      `[trip] frontmatter slug "${trip.slug}" !== folder id "${slug}"`,
    );
  }

  const allDays = await getCollection("days");
  const days = allDays
    .filter((d) => d.data.tripSlug === slug)
    .map((d) => {
      const data = d.data as DayData;
      return { ...data, body: d.body ?? "" };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Range coverage warn
  const cursor = new Date(`${trip.startDate}T00:00:00Z`);
  const end = new Date(`${trip.endDate}T00:00:00Z`);
  const have = new Set(days.map((d) => d.date));
  while (cursor <= end) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    const day = String(cursor.getUTCDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (!have.has(key)) {
      console.warn(`[trip] missing day file for ${slug} ${key}`);
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const map = getPeopleMap();
  const people = trip.participants
    .map((p) => map.get(p.personId))
    .filter((p): p is Person => Boolean(p));

  const today = todayInTimeZone(trip.timezone);
  const phaseAtBuild = getTravelPhase(trip.startDate, trip.endDate, today);

  return {
    trip,
    slug,
    body: entry.body ?? "",
    days,
    people,
    phaseAtBuild,
  };
}

export async function getAllTripBundles(): Promise<TripBundle[]> {
  const trips = await getCollection("trips");
  const bundles: TripBundle[] = [];

  for (const t of trips) {
    if (!isPublishableTripPath(t.id)) {
      console.error(`[trip] filtered non-publishable: ${t.id}`);
      continue;
    }
    const b = await getTripBundle(t.id);
    if (b) bundles.push(b);
  }

  // Assert no _template
  for (const b of bundles) {
    if (b.slug.startsWith("_")) {
      throw new Error(`Publishable list must not include ${b.slug}`);
    }
  }

  return bundles.sort((a, b) =>
    a.trip.startDate.localeCompare(b.trip.startDate),
  );
}

export function lodgingById(
  trip: TripData,
  id: string | undefined,
): Lodging | undefined {
  if (!id) return undefined;
  return trip.lodgings.find((l: Lodging) => l.id === id);
}

export function participantLabels(people: Person[]): string {
  return people.map((p) => p.nameShort).join(" · ");
}

// Ensure people module is referenced for build-side load
export { getAllPeople };
