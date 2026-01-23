import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
})
export class ViewToggleComponent {
  @Input() options: ViewToggleOption[] = [];
  @Input() selected = '';
  @Input() toggleClass = '';
  @Output() selectedChange = new EventEmitter<string>();

  select(value: string): void {
    this.selectedChange.emit(value);
  }
}
