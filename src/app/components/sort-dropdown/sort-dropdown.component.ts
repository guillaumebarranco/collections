import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sort-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.scss']
})
export class SortDropdownComponent {
  @Input() sortOptions: SortOption[] = [];
  @Input() selectedSort: string = '';
  @Input() label: string = 'Trier par :';
  @Output() sortChange = new EventEmitter<string>();

  onSortChange() {
    this.sortChange.emit(this.selectedSort);
  }
}