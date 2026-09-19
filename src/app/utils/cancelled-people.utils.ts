import type { CancelledPeopleFile } from '../containers/cancelled-people/cancelled-people.model';
import cancelledPeopleJson from '../containers/cancelled-people/cancelled-people.data.json';

const cancelledPeopleData = cancelledPeopleJson as CancelledPeopleFile;

function normalizePersonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ');
}

const CANCELLED_NAMES = new Set(
  cancelledPeopleData.categories.flatMap((category) =>
    category.people.map((person) => normalizePersonName(person.name))
  )
);

/** Découpe une chaîne « Nom1, Nom2 » en noms individuels. */
export function splitPersonNames(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isCancelledPerson(name: string | null | undefined): boolean {
  if (!name?.trim()) return false;
  return CANCELLED_NAMES.has(normalizePersonName(name));
}
