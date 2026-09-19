import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../components/shared/view-toggle/view-toggle.component';
import {
  PersonBadgeComponent,
  personBadgeVariantForCategory,
  type PersonBadgeVariant,
} from '../../components/shared/person-badge/person-badge.component';
import type {
  CancelledPeopleFile,
  CancelledPerson,
} from './cancelled-people.model';
import cancelledPeopleJson from './cancelled-people.data.json';

const ALL_CATEGORIES = 'all';

const cancelledPeopleData = cancelledPeopleJson as CancelledPeopleFile;

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function personMatchesQuery(person: CancelledPerson, needle: string): boolean {
  if (!needle) return true;
  const haystack = normalizeSearch(
    `${person.name} ${person.reason ?? ''} ${(person.sources ?? []).join(' ')}`
  );
  return haystack.includes(needle);
}

@Component({
  selector: 'app-cancelled-people',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    PersonBadgeComponent,
  ],
  templateUrl: './cancelled-people.component.html',
  styleUrls: ['./cancelled-people.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledPeopleComponent {
  readonly searchQuery = signal('');
  readonly selectedCategoryId = signal(ALL_CATEGORIES);

  readonly categoryTabOptions: ViewToggleOption[] = [
    { value: ALL_CATEGORIES, label: 'Toutes' },
    ...cancelledPeopleData.categories.map((category) => ({
      value: category.id,
      label: category.label,
    })),
  ];

  readonly visibleCategories = computed(() => {
    const needle = normalizeSearch(this.searchQuery());
    const selectedId = this.selectedCategoryId();

    return cancelledPeopleData.categories
      .filter((category) =>
        selectedId === ALL_CATEGORIES ? true : category.id === selectedId
      )
      .map((category) => ({
        ...category,
        people: [...category.people]
          .filter((person) => personMatchesQuery(person, needle))
          .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
      }))
      .filter((category) => {
        if (needle) return category.people.length > 0;
        return true;
      });
  });

  readonly totalPeopleCount = computed(() =>
    cancelledPeopleData.categories.reduce(
      (sum, category) => sum + category.people.length,
      0
    )
  );

  badgeVariantForCategory(categoryId: string): PersonBadgeVariant {
    return personBadgeVariantForCategory(categoryId);
  }

  onCategoryTabChange(value: string): void {
    this.selectedCategoryId.set(value);
  }

  onSearchInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }
}
