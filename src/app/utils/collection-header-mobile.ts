import { afterNextRender, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function createCollectionHeaderMobileAccordion() {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);
  const isMobileViewport = signal(false);
  const toolsPanelExpanded = signal(false);

  afterNextRender(() => {
    if (!isPlatformBrowser(platformId)) return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const syncViewport = () => {
      isMobileViewport.set(mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);
    destroyRef.onDestroy(() =>
      mediaQuery.removeEventListener('change', syncViewport)
    );
  });

  return {
    isMobileViewport,
    toolsPanelExpanded,
    toggleToolsPanel: () =>
      toolsPanelExpanded.update((expanded) => !expanded),
  };
}
