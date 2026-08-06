import { z } from "zod";

/** YAML may parse bare dates as Date; normalize to YYYY-MM-DD. */
const isoDate = z.preprocess((val) => {
  if (val instanceof Date) {
    const y = val.getUTCFullYear();
    const m = String(val.getUTCMonth() + 1).padStart(2, "0");
    const d = String(val.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof val === "string") return val.slice(0, 10);
  return val;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const personSideSchema = z.enum([
  "nuclear",
  "maternal",
  "paternal",
  "other",
]);
export const personGenerationSchema = z.enum([
  "child",
  "parent",
  "grandparent",
  "other",
]);

export const personSchema = z.object({
  id: z.string().min(1),
  nameKo: z.string().min(1),
  nameShort: z.string().min(1),
  side: personSideSchema,
  generation: personGenerationSchema,
  isFocus: z.boolean().optional().default(false),
});

export const peopleFileSchema = z.object({
  people: z.array(personSchema).min(1),
});

export const activitySchema = z.object({
  time: z.string().optional(),
  title: z.string().min(1),
  place: z.string().optional(),
  notes: z.string().optional(),
  /** omit or [] = all; non-empty = subset */
  peopleIds: z.array(z.string()).optional(),
});

export const daySchema = z.object({
  tripSlug: z.string().min(1),
  date: isoDate,
  dayIndex: z.number().int().positive().optional(),
  title: z.string().min(1),
  summary: z.string().optional(),
  lodgingId: z.string().optional(),
  mood: z.string().optional(),
  activities: z.array(activitySchema).default([]),
});

const placeSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
});

export const lodgingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameLocal: z.string().optional(),
  area: z.string().optional(),
  room: z.string().optional(),
  address: z.string().optional(),
  mapUrl: z.string().url().optional(),
  checkInDate: isoDate,
  checkInTime: z.string().optional(),
  checkOutDate: isoDate,
  checkOutTime: z.string().optional(),
  phone: z.string().optional(),
  notesPublic: z.string().optional(),
});

export const transportSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["flight", "train", "bus", "car", "other"]),
  label: z.string().min(1),
  operator: z.string().optional(),
  flightNumber: z.string().optional(),
  cabin: z.string().optional(),
  from: placeSchema,
  to: placeSchema,
  departAt: z.string().min(1),
  arriveAt: z.string().min(1),
  notesPublic: z.string().optional(),
});

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  kind: z.enum(["emergency", "reference", "booking", "map", "other"]).optional(),
});

export const packingItemSchema = z.object({
  item: z.string().min(1),
  for: z.union([z.literal("all"), z.array(z.string())]).optional(),
  essential: z.boolean().optional(),
});

export const participantSchema = z.object({
  personId: z.string().min(1),
  role: z.enum(["child", "organizer", "guest", "other"]).optional(),
});

export const tripSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  titleShort: z.string().optional(),
  destination: z.object({
    countryKo: z.string().min(1),
    cityKo: z.string().min(1),
    countryCode: z.string().optional(),
    airport: z.string().optional(),
  }),
  startDate: isoDate,
  endDate: isoDate,
  timezone: z.string().min(1),
  status: z.enum(["idea", "planned", "done", "cancelled"]),
  focusPersonId: z.string().optional(),
  updatedAt: isoDate.optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  participants: z.array(participantSchema).default([]),
  lodgings: z.array(lodgingSchema).default([]),
  transports: z.array(transportSchema).default([]),
  links: z.array(linkSchema).default([]),
  packing: z.array(packingItemSchema).default([]),
  notesPublic: z.array(z.string()).default([]),
});

export type Person = z.infer<typeof personSchema>;
export type DayData = z.infer<typeof daySchema>;
export type TripData = z.infer<typeof tripSchema>;
export type Lodging = z.infer<typeof lodgingSchema>;
export type Transport = z.infer<typeof transportSchema>;
export type Activity = z.infer<typeof activitySchema>;
