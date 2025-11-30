import { Component, computed, inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-select-entities',
  template: '',
})
export class SelectEntitiesComponent {
  activatedRoute = inject(ActivatedRoute);

  // Mode watchlist détecté depuis query params
  isWatchOrReadlistMode = computed<boolean>(() => {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    return queryParams['watchlist'] === 'true';
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
}
