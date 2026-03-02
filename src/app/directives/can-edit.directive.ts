import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';

/**
 * Directive structurelle qui affiche le contenu uniquement si l'utilisateur connecté
 * peut éditer le profil correspondant (même userId que le paramètre de route :id ou que la valeur passée).
 *
 * Utilisation :
 * - *appCanEdit : utilise l'id utilisateur depuis la route courante (params :id du segment ou du parent)
 * - *appCanEdit="userId" : utilise l'userId passé en entrée
 *
 * @example
 * ```html
 * <div *appCanEdit>
 *   <button>Modifier</button>
 * </div>
 *
 * <div *appCanEdit="getCurrentUserId()">
 *   Actions réservées au propriétaire
 * </div>
 * ```
 */
@Directive({
  selector: '[appCanEdit]',
  standalone: true,
})
export class CanEditDirective implements OnInit, OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private subscription: Subscription | null = null;
  private hasView = false;

  /**
   * Optionnel : id utilisateur cible. Si non fourni, l'id est récupéré depuis la route (params :id).
   */
  @Input() set appCanEdit(userId: string | null | undefined) {
    this.userIdInput = userId ?? null;
    this.updateView();
  }

  private userIdInput: string | null = null;

  private getRouteUserId(): string | null {
    let route: ActivatedRoute | null = this.activatedRoute;
    while (route) {
      const id = route.snapshot.params['id'];
      if (id != null && id !== '') return String(id).trim();
      route = route.parent;
    }
    return null;
  }

  private getEffectiveUserId(): string | null {
    if (this.userIdInput !== null && this.userIdInput !== undefined) {
      const v = String(this.userIdInput).trim();
      return v === '' ? null : v;
    }
    return this.getRouteUserId();
  }

  private updateView(): void {
    const userId = this.getEffectiveUserId();
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    const canEdit =
      isAdminView || this.authService.canEdit(userId ?? undefined);
    if (canEdit && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!canEdit && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnInit(): void {
    this.updateView();
    this.subscription = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
