import { people } from "../content/data/people";
import type { Person } from "./schemas";

export function getAllPeople(): Person[] {
  return people;
}

export function getPeopleMap(): Map<string, Person> {
  return new Map(getAllPeople().map((p) => [p.id, p]));
}

export function getPerson(id: string): Person | undefined {
  return getPeopleMap().get(id);
}
