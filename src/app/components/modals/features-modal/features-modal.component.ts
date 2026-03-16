import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../shared/view-toggle/view-toggle.component';

type FeaturesTab = 'base' | 'simplify' | 'advanced';

@Component({
  selector: 'app-features-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ViewToggleComponent],
  templateUrl: './features-modal.component.html',
  styleUrls: ['./features-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<FeaturesModalComponent>>(MatDialogRef);

  readonly selectedTab = signal<FeaturesTab>('base');

  readonly tabOptions: ViewToggleOption[] = [
    { value: 'base', label: 'Fonctionnalités de base' },
    { value: 'simplify', label: 'Pour vous simplifier la vie' },
    { value: 'advanced', label: 'Fonctionnalités avancées' },
  ];

  onTabChange(tab: string): void {
    this.selectedTab.set(tab as FeaturesTab);
  }

  close(): void {
    this.dialogRef.close();
  }
}
