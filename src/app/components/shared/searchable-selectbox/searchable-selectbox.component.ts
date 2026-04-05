import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

/**
 * Liste déroulante filtrable (autocomplete) pour de grandes listes d’options.
 * Le parent fournit `options` et la valeur sélectionnée (`selectedValue`) ;
 * la recherche s’applique sur le libellé (et sur la valeur brute).
 */
@Component({
  selector: 'app-searchable-selectbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
  ],
  templateUrl: './searchable-selectbox.component.html',
  styleUrls: ['./searchable-selectbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableSelectboxComponent {
  /** Valeur sentinelle pour l’option « effacer » (évite les soucis avec ''). */
  protected readonly clearSentinel = '__makya_searchable_clear__';

  private readonly autoTrigger = viewChild(MatAutocompleteTrigger);

  readonly options = input<SearchableSelectOption[]>([]);
  /** Valeur de l’option (ex. titre|auteur), chaîne vide = aucune sélection. */
  readonly selectedValue = input<string>('');
  readonly disabled = input(false);
  readonly label = input<string>('');
  readonly placeholder = input<string>('Tapez pour filtrer…');
  readonly emptyOptionLabel = input<string>('Aucune');
  /** Afficher une entrée pour effacer la sélection. */
  readonly showEmptyOption = input(true);
  /** Nombre max d’options affichées (perfs DOM). */
  readonly maxResults = input(150);
  readonly inputId = input<string>('searchable-select');

  readonly selectedValueChange = output<string>();

  /** Texte dans le champ (saisie / libellé de la sélection). */
  protected readonly draft = signal('');

  /** Pendant la saisie, on n’écrase pas le brouillon depuis le parent. */
  protected readonly searchMode = signal(false);

  protected readonly filteredOptions = computed(() => {
    const opts = this.options();
    const raw = this.draft();
    const needle = this.normalize(raw).trim().toLowerCase();
    if (!needle) {
      return opts.slice(0, this.maxResults());
    }
    const filtered = opts.filter((o) => {
      const lab = this.normalize(o.label).toLowerCase();
      const val = o.value.toLowerCase();
      return lab.includes(needle) || val.includes(needle);
    });
    return filtered.slice(0, this.maxResults());
  });

  constructor() {
    effect(() => {
      if (this.searchMode()) {
        return;
      }
      const v = this.selectedValue();
      const opts = this.options();
      untracked(() => {
        if (!v) {
          this.draft.set('');
          return;
        }
        const found = opts.find((o) => o.value === v);
        this.draft.set(found?.label ?? '');
      });
    });
  }

  protected onFocus(ev: FocusEvent): void {
    this.searchMode.set(true);
    const el = ev.target as HTMLInputElement;
    queueMicrotask(() => {
      if (document.activeElement === el) {
        el.select();
      }
    });
  }

  protected onBlur(): void {
    // Le blur part souvent avant le clic sur l’overlay : ne pas resynchroniser tant que le panneau est ouvert.
    const tryExit = () => {
      const trigger = this.autoTrigger();
      if (trigger?.panelOpen) {
        return;
      }
      this.searchMode.set(false);
    };
    queueMicrotask(tryExit);
    setTimeout(tryExit, 0);
    setTimeout(tryExit, 100);
  }

  protected onDraftChange(text: string): void {
    this.draft.set(text);
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value ?? '') as string;
    this.searchMode.set(false);
    if (value === this.clearSentinel) {
      this.draft.set('');
      this.selectedValueChange.emit('');
      return;
    }
    const opts = this.options();
    const found = opts.find((o) => o.value === value);
    this.draft.set(found?.label ?? '');
    this.selectedValueChange.emit(value);
  }

  private normalize(s: string): string {
    return s.normalize('NFD').replace(/\p{M}/gu, '');
  }
}
