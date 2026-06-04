import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTooltip,
  MatTooltipModule,
  TooltipTouchGestures,
} from '@angular/material/tooltip';
import { BaseBd } from '../../../models/bd-model';
import { BaseBook } from '../../../models/book-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseGame } from '../../../models/game-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseMovie } from '../../../models/movie-model';
import { BaseSerie } from '../../../models/serie-model';
import {
  type BaseWorkOrbitSatellite,
  type AdaptationsBaseWorkOrbitPanel,
  type AdaptationsOrbitCoverInfo,
  buildAdaptationsBaseWorkOrbitPanelsSorted,
  buildAdaptationsBaseWorksBlocks,
  buildAdaptationsBaseWorkPanelSearchHaystack,
  buildUserBaseGalaxyConsumption,
  emptyUserBaseGalaxyConsumption,
  type UserBaseGalaxyConsumption,
  bookEntityKey,
  gameEntityKey,
  isCentralConsumed,
  isSatelliteConsumed,
  adaptationsOrbitCover,
  adaptationsOrbitEntityKindLabel,
  movieEntityKey,
  normalizeForAdaptationsBaseSearch,
  serieEntityKey,
  adaptationsBaseWorksCrossMediaScoreTooltip,
  dualRingInnerSlotCount,
  partitionOrbitSatellitesForDualRing,
} from './adaptations-base-works-galaxy.helpers';

/**
 * Vue « Galaxie des licences » des adaptations : galaxie orbite (hub par saga / œuvre isolée).
 */
@Component({
  selector: 'app-adaptations-base-works-galaxy',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './adaptations-base-works-galaxy.component.html',
  styleUrls: ['./adaptations-base-works-galaxy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdaptationsBaseWorksGalaxyComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);

  /**
   * Sur mobile tactile : désactive l’appui long Material ; l’infobulle s’ouvre au clic
   * (voir `onOrbitCoverTap`). Au pointeur fin (souris), comportement hover inchangé.
   */
  readonly orbitCoverTooltipTouchGestures =
    signal<TooltipTouchGestures>('auto');

  readonly orbitCoverTooltipShowDelay = computed(() =>
    this.orbitCoverTooltipTouchGestures() === 'off' ? 0 : 200
  );

  readonly baseBooks = input.required<BaseBook[]>();
  readonly baseBds = input.required<BaseBd[]>();
  readonly baseComics = input.required<BaseComic[]>();
  readonly baseGames = input.required<BaseGame[]>();
  readonly baseMangas = input.required<BaseManga[]>();
  readonly baseManwhas = input.required<BaseManwha[]>();
  readonly baseMovies = input.required<BaseMovie[]>();
  readonly baseSeries = input.required<BaseSerie[]>();
  /** Utilisateur pour les collections (vues / lues / jouées). */
  readonly effectiveUserIdLower = input.required<string>();

  readonly userBaseGalaxyConsumption = signal<UserBaseGalaxyConsumption>(
    emptyUserBaseGalaxyConsumption()
  );

  /**
   * Désactivé par défaut. Activé : atténue les vignettes non consommées
   * (mêmes règles que les fiches).
   */
  readonly emphasizeMyConsumedWorks = signal(false);

  constructor() {
    effect(() => {
      const uid = this.effectiveUserIdLower();
      void buildUserBaseGalaxyConsumption(uid).then((consumption) =>
        this.userBaseGalaxyConsumption.set(consumption)
      );
    });

    afterNextRender(
      () => {
        const mq = window.matchMedia('(max-width: 720px) and (hover: none)');
        const sync = (): void => {
          this.orbitCoverTooltipTouchGestures.set(mq.matches ? 'off' : 'auto');
        };
        sync();
        mq.addEventListener('change', sync);
        this._destroyRef.onDestroy(() =>
          mq.removeEventListener('change', sync)
        );
      },
      { injector: this._injector }
    );
  }

  readonly adaptationsBaseWorksBlocks = computed(() =>
    buildAdaptationsBaseWorksBlocks(
      this.baseBooks(),
      this.baseBds(),
      this.baseComics(),
      this.baseMangas(),
      this.baseManwhas(),
      this.baseGames(),
      this.baseSeries(),
      this.baseMovies()
    )
  );

  readonly adaptationsBaseWorkOrbitPanels = computed(() =>
    buildAdaptationsBaseWorkOrbitPanelsSorted(
      this.adaptationsBaseWorksBlocks(),
      this.baseBooks(),
      this.baseBds(),
      this.baseComics(),
      this.baseMovies(),
      this.baseSeries(),
      this.baseGames(),
      this.baseMangas()
    )
  );

  readonly baseWorksSearchQuery = signal('');

  readonly adaptationsBaseWorkOrbitPanelsFiltered = computed(() => {
    const panels = this.adaptationsBaseWorkOrbitPanels();
    const needle = normalizeForAdaptationsBaseSearch(this.baseWorksSearchQuery());
    if (!needle) {
      return panels;
    }
    return panels.filter((p) =>
      buildAdaptationsBaseWorkPanelSearchHaystack(p).includes(needle)
    );
  });

  readonly collapsedSections = signal<Record<string, boolean>>({});

  toggleSection(key: string): void {
    this.collapsedSections.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  isSectionCollapsed(key: string): boolean {
    return Boolean(this.collapsedSections()[key]);
  }

  /** Infobulle score (pondération transmédia) sur le titre de bloc ; vide si absent. */
  baseWorkBlockScoreTooltip(panel: AdaptationsBaseWorkOrbitPanel): string {
    const s = panel.crossMediaExportScore;
    return s != null ? adaptationsBaseWorksCrossMediaScoreTooltip(s) : '';
  }

  trackBaseWorkOrbitPanel(panel: AdaptationsBaseWorkOrbitPanel): string {
    return panel.orbitKey;
  }

  baseWorkOrbitCollapseKey(panel: AdaptationsBaseWorkOrbitPanel): string {
    return panel.orbitKey;
  }

  trackOrbitSatellite(sat: BaseWorkOrbitSatellite, index: number): string {
    switch (sat.kind) {
      case 'book':
        return `b-${bookEntityKey(sat.data)}-${index}`;
      case 'movie':
        return `m-${movieEntityKey(sat.data)}-${index}`;
      case 'serie':
        return `s-${serieEntityKey(sat.data)}-${index}`;
      case 'game':
        return `g-${gameEntityKey(sat.data)}-${index}`;
      case 'bd':
        return `bd-${sat.data.title}|${sat.data.writer}-${index}`;
      case 'comic':
        return `c-${sat.data.title}|${sat.data.writer}-${index}`;
      case 'manga':
        return `mg-${sat.data.title}|${sat.data.author}-${index}`;
      case 'manwha':
        return `mw-${sat.data.title}|${sat.data.author}-${index}`;
    }
  }

  orbitSatelliteCover(sat: BaseWorkOrbitSatellite): AdaptationsOrbitCoverInfo {
    switch (sat.kind) {
      case 'book':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'book'
        );
      case 'movie':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'movie'
        );
      case 'serie':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'serie'
        );
      case 'game':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.editor,
          'game'
        );
      case 'bd':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'bd'
        );
      case 'comic':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'comic'
        );
      case 'manga':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manga'
        );
      case 'manwha':
        return adaptationsOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manwha'
        );
    }
  }

  orbitCentralCover(
    central: AdaptationsBaseWorkOrbitPanel['central']
  ): AdaptationsOrbitCoverInfo {
    if (central.book) {
      return adaptationsOrbitCover(
        central.book.coverUrl,
        central.book.title,
        central.book.author,
        'book'
      );
    }
    if (central.bd) {
      return adaptationsOrbitCover(
        central.bd.coverUrl,
        central.bd.title,
        central.bd.writer,
        'bd'
      );
    }
    if (central.comic) {
      return adaptationsOrbitCover(
        central.comic.coverUrl,
        central.comic.title,
        central.comic.writer,
        'comic'
      );
    }
    if (central.manga) {
      return adaptationsOrbitCover(
        central.manga.coverUrl,
        central.manga.title,
        central.manga.author,
        'manga'
      );
    }
    if (central.manwha) {
      return adaptationsOrbitCover(
        central.manwha.coverUrl,
        central.manwha.title,
        central.manwha.author,
        'manwha'
      );
    }
    if (central.game) {
      return adaptationsOrbitCover(
        central.game.coverUrl,
        central.game.title,
        central.game.editor,
        'game'
      );
    }
    if (central.serie) {
      return adaptationsOrbitCover(
        central.serie.coverUrl,
        central.serie.title,
        central.serie.director,
        'serie'
      );
    }
    if (central.movie) {
      return adaptationsOrbitCover(
        central.movie.coverUrl,
        central.movie.title,
        central.movie.director,
        'movie'
      );
    }
    const base = [central.placeholderTitle, central.placeholderSecond]
      .filter((s): s is string => Boolean(s?.trim()))
      .join(' — ');
    const kindLabel = central.placeholderEntityType
      ? adaptationsOrbitEntityKindLabel(central.placeholderEntityType)
      : '';
    const suffix = kindLabel
      ? ` (${kindLabel}, absent du catalogue local)`
      : '';
    return {
      coverUrl: null,
      tooltip: (base + suffix).trim() || 'Œuvre de base',
    };
  }

  orbitCoverFallbackLetter(tooltip: string): string {
    const t = tooltip.trim();
    if (!t) {
      return '?';
    }
    return t.charAt(0).toLocaleUpperCase('fr');
  }

  /** Au-delà de ce seuil : deux anneaux (~⅓ intérieur, ~⅔ extérieur). */
  readonly orbitDualRingThreshold = 40;

  orbitUsesDualRing(satelliteCount: number): boolean {
    return satelliteCount > this.orbitDualRingThreshold;
  }

  /** Anneaux intérieur / extérieur (~1/3 – 2/3) avec répartition équilibrée des adaptations. */
  orbitDualRingPartition(sats: BaseWorkOrbitSatellite[]): {
    inner: BaseWorkOrbitSatellite[];
    outer: BaseWorkOrbitSatellite[];
  } {
    if (sats.length <= this.orbitDualRingThreshold) {
      return { inner: sats, outer: [] };
    }
    return partitionOrbitSatellitesForDualRing(sats);
  }

  orbitOuterCount(total: number): number {
    return total > this.orbitDualRingThreshold
      ? total - dualRingInnerSlotCount(total)
      : 0;
  }

  /** Rayon d’un anneau en fonction du nombre de satellites sur cet anneau. */
  orbitRadiusPx(satelliteCount: number): number {
    if (satelliteCount <= 0) return 0;
    return Math.min(300, Math.max(130, 95 + satelliteCount * 26));
  }

  orbitInnerRadiusPx(totalCount: number): number {
    const innerN =
      totalCount > this.orbitDualRingThreshold
        ? dualRingInnerSlotCount(totalCount)
        : totalCount;
    return this.orbitRadiusPx(innerN);
  }

  orbitOuterRadiusPx(totalCount: number): number {
    const outerN = this.orbitOuterCount(totalCount);
    if (outerN <= 0) {
      return 0;
    }
    const innerR = this.orbitRadiusPx(dualRingInnerSlotCount(totalCount));
    return Math.min(560, innerR + 150 + Math.min(200, outerN * 4));
  }

  /** Cercle guide (pointillés) : rayon de l’anneau le plus extérieur. */
  orbitGuideCircleRadiusPx(totalCount: number): number {
    if (totalCount <= 0) {
      return 0;
    }
    if (!this.orbitUsesDualRing(totalCount)) {
      return this.orbitRadiusPx(totalCount);
    }
    return this.orbitOuterRadiusPx(totalCount);
  }

  orbitContainerSizePx(satelliteCount: number): number {
    const r = this.orbitGuideCircleRadiusPx(satelliteCount);
    return Math.max(280, Math.min(1200, 2 * r + 240));
  }

  baseWorkEntityLabel(entityType: string): string {
    if (!entityType) {
      return 'œuvre';
    }
    return adaptationsOrbitEntityKindLabel(entityType);
  }

  onEmphasizeConsumedToggle(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }
    this.emphasizeMyConsumedWorks.set(input.checked);
  }

  onBaseWorksSearchInput(event: Event): void {
    const el = event.target as HTMLInputElement | null;
    this.baseWorksSearchQuery.set(el?.value ?? '');
  }

  /**
   * Mobile tactile : pas de hover ; un tap affiche ou masque l’infobulle (même contenu qu’au survol desktop).
   */
  onOrbitCoverTap(event: Event, tooltip: MatTooltip): void {
    if (this.orbitCoverTooltipTouchGestures() !== 'off') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    tooltip.toggle();
  }

  orbitCentralIsDimmed(central: AdaptationsBaseWorkOrbitPanel['central']): boolean {
    if (!this.emphasizeMyConsumedWorks()) {
      return false;
    }
    return !isCentralConsumed(central, this.userBaseGalaxyConsumption());
  }

  orbitSatelliteIsDimmed(sat: BaseWorkOrbitSatellite): boolean {
    if (!this.emphasizeMyConsumedWorks()) {
      return false;
    }
    return !isSatelliteConsumed(sat, this.userBaseGalaxyConsumption());
  }

  /** Centre + satellites effectivement vus / lus / joués (mêmes clés que le grisage). */
  orbitPanelConsumedWorksCount(panel: AdaptationsBaseWorkOrbitPanel): number {
    const c = this.userBaseGalaxyConsumption();
    let n = 0;
    if (isCentralConsumed(panel.central, c)) {
      n++;
    }
    for (const sat of panel.satellites) {
      if (isSatelliteConsumed(sat, c)) {
        n++;
      }
    }
    return n;
  }

  orbitPanelTotalWorksCount(panel: AdaptationsBaseWorkOrbitPanel): number {
    return panel.satelliteCount + 1;
  }
}
