import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  type MixBaseWorkOrbitPanel,
  type MixOrbitCoverInfo,
  buildMixBaseWorkOrbitPanelsSorted,
  buildMixBaseWorksBlocks,
  buildMixBaseWorkPanelSearchHaystack,
  buildUserBaseGalaxyConsumption,
  bookEntityKey,
  gameEntityKey,
  isCentralConsumed,
  isSatelliteConsumed,
  manwhaEntityKey,
  mangaEntityKey,
  mixOrbitCover,
  mixOrbitEntityKindLabel,
  movieEntityKey,
  normalizeForMixBaseSearch,
  serieEntityKey,
  mixBaseWorksCrossMediaScoreTooltip,
  dualRingInnerSlotCount,
  partitionOrbitSatellitesForDualRing,
} from './mix-base-works-galaxy.helpers';

/**
 * Vue « Œuvres de base » du Mix : galaxie orbite (hub par saga / œuvre isolée).
 */
@Component({
  selector: 'app-mix-base-works-galaxy',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './mix-base-works-galaxy.component.html',
  styleUrls: ['./mix-base-works-galaxy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixBaseWorksGalaxyComponent {
  readonly baseBooks = input.required<BaseBook[]>();
  readonly baseBds = input.required<BaseBd[]>();
  readonly baseComics = input.required<BaseComic[]>();
  readonly baseGames = input.required<BaseGame[]>();
  readonly baseMangas = input.required<BaseManga[]>();
  readonly baseManwhas = input.required<BaseManwha[]>();
  readonly baseMovies = input.required<BaseMovie[]>();
  readonly baseSeries = input.required<BaseSerie[]>();
  /** Utilisateur pour les collections locales (vues / lues / jouées). */
  readonly effectiveUserIdLower = input.required<string>();

  /**
   * Désactivé par défaut. Activé : atténue les vignettes non consommées
   * (mêmes règles que les fiches).
   */
  readonly emphasizeMyConsumedWorks = signal(false);

  readonly userBaseGalaxyConsumption = computed(() =>
    buildUserBaseGalaxyConsumption(this.effectiveUserIdLower())
  );

  readonly mixBaseWorksBlocks = computed(() =>
    buildMixBaseWorksBlocks(
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

  readonly mixBaseWorkOrbitPanels = computed(() =>
    buildMixBaseWorkOrbitPanelsSorted(
      this.mixBaseWorksBlocks(),
      this.baseBooks(),
      this.baseMovies(),
      this.baseSeries(),
      this.baseGames()
    )
  );

  readonly baseWorksSearchQuery = signal('');

  readonly mixBaseWorkOrbitPanelsFiltered = computed(() => {
    const panels = this.mixBaseWorkOrbitPanels();
    const needle = normalizeForMixBaseSearch(this.baseWorksSearchQuery());
    if (!needle) {
      return panels;
    }
    return panels.filter((p) =>
      buildMixBaseWorkPanelSearchHaystack(p).includes(needle)
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
  baseWorkBlockScoreTooltip(panel: MixBaseWorkOrbitPanel): string {
    const s = panel.crossMediaExportScore;
    return s != null ? mixBaseWorksCrossMediaScoreTooltip(s) : '';
  }

  trackBaseWorkOrbitPanel(panel: MixBaseWorkOrbitPanel): string {
    return panel.orbitKey;
  }

  baseWorkOrbitCollapseKey(panel: MixBaseWorkOrbitPanel): string {
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

  orbitSatelliteCover(sat: BaseWorkOrbitSatellite): MixOrbitCoverInfo {
    switch (sat.kind) {
      case 'book':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'book'
        );
      case 'movie':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'movie'
        );
      case 'serie':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'serie'
        );
      case 'game':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.editor,
          'game'
        );
      case 'bd':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'bd'
        );
      case 'comic':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'comic'
        );
      case 'manga':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manga'
        );
      case 'manwha':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manwha'
        );
    }
  }

  orbitCentralCover(
    central: MixBaseWorkOrbitPanel['central']
  ): MixOrbitCoverInfo {
    if (central.book) {
      return mixOrbitCover(
        central.book.coverUrl,
        central.book.title,
        central.book.author,
        'book'
      );
    }
    if (central.bd) {
      return mixOrbitCover(
        central.bd.coverUrl,
        central.bd.title,
        central.bd.writer,
        'bd'
      );
    }
    if (central.comic) {
      return mixOrbitCover(
        central.comic.coverUrl,
        central.comic.title,
        central.comic.writer,
        'comic'
      );
    }
    if (central.manga) {
      return mixOrbitCover(
        central.manga.coverUrl,
        central.manga.title,
        central.manga.author,
        'manga'
      );
    }
    if (central.manwha) {
      return mixOrbitCover(
        central.manwha.coverUrl,
        central.manwha.title,
        central.manwha.author,
        'manwha'
      );
    }
    if (central.game) {
      return mixOrbitCover(
        central.game.coverUrl,
        central.game.title,
        central.game.editor,
        'game'
      );
    }
    if (central.serie) {
      return mixOrbitCover(
        central.serie.coverUrl,
        central.serie.title,
        central.serie.director,
        'serie'
      );
    }
    if (central.movie) {
      return mixOrbitCover(
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
      ? mixOrbitEntityKindLabel(central.placeholderEntityType)
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
  readonly orbitDualRingThreshold = 50;

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
    return mixOrbitEntityKindLabel(entityType);
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

  orbitCentralIsDimmed(central: MixBaseWorkOrbitPanel['central']): boolean {
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
}
