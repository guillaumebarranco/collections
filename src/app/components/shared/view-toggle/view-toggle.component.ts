import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

export type ViewToggleOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-view-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewToggleComponent {
  private static nextId = 0;

  @Input() options: ViewToggleOption[] = [];
  @Input() selected = '';
  @Input() toggleClass = '';
  @Output() selectedChange = new EventEmitter<string>();

  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly expanded = signal(false);
  readonly mobilePanelId = `view-toggle-panel-${ViewToggleComponent.nextId++}`;

  get selectedLabel(): string {
    return this.options.find((o) => o.value === this.selected)?.label ?? this.selected;
  }

  toggleMenu(): void {
    this.expanded.update((v) => !v);
  }

  select(value: string): void {
    this.selectedChange.emit(value);
    this.expanded.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.expanded()) return;
    const target = event.target;
    if (target instanceof Node && this.host.nativeElement.contains(target)) {
      return;
    }
    this.expanded.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.expanded()) {
      this.expanded.set(false);
    }
  }
}
