import { Component, computed, inject } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-select-entities',
  template: '',
})
export class SelectEntitiesComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  // Mode watchlist détecté depuis query params
  isWatchOrReadlistMode = computed<boolean>(() => {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    if (queryParams['watchlist'] === 'true') {
      return true;
    }

    if (queryParams['readlist'] === 'true') {
      return true;
    }

    return false;
  });

  // Mode cinema détecté depuis query params
  isCinemaMode = computed<boolean>(() => {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    return queryParams['cinema'] === 'true';
  });

  // Mode ajout détecté depuis query params
  isAddMode = computed<boolean>(() => {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    return queryParams['add'] === 'true';
  });

  // ID de l'utilisateur depuis les params
  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? params['id'] : 'guillaume';
  });

  username = computed<string>(() => {
    return this.userId().charAt(0).toUpperCase() + this.userId().slice(1);
  });

  protected getEntityListRoute(entity: string): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? ['/', params['id'], entity] : ['/', entity];
  }

  protected navigateToEntityList(entity: string): void {
    this.router.navigate(this.getEntityListRoute(entity));
  }
}
