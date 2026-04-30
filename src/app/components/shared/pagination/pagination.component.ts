import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PageItem = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 50;
  @Input() pageSizeOptions: number[] = [50, 100, 200, 500, -1];
  @Input() maxVisiblePages = 10;

  @Output() currentPageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  goToPageInput = 1;

  get totalPages(): number {
    if (this.totalItems <= 0) return 1;
    if (this.pageSize === -1) return 1;
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get hasPagination(): boolean {
    return this.totalItems > 0;
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    if (this.pageSize === -1) return 1;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    if (this.totalItems === 0) return 0;
    if (this.pageSize === -1) return this.totalItems;
    return Math.min(this.totalItems, this.currentPage * this.pageSize);
  }

  get visiblePages(): PageItem[] {
    return this.buildVisiblePages();
  }

  getPageSizeLabel(value: number): string {
    return value === -1 ? 'Tous' : `${value}`;
  }

  onPageSizeSelectionChange(value: string): void {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue === this.pageSize) {
      return;
    }
    this.pageSizeChange.emit(parsedValue);
  }

  goToPage(page: number): void {
    const target = this.clampPage(page);
    if (target === this.currentPage) return;
    this.currentPageChange.emit(target);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  applyGoToPage(): void {
    this.goToPage(this.goToPageInput);
  }

  private clampPage(page: number): number {
    return Math.min(this.totalPages, Math.max(1, Math.trunc(page)));
  }

  private buildVisiblePages(): PageItem[] {
    const pagesCount = this.totalPages;
    if (pagesCount <= this.maxVisiblePages) {
      return Array.from({ length: pagesCount }, (_, idx) => idx + 1);
    }

    const visibleMiddleCount = Math.max(1, this.maxVisiblePages - 2);
    let start = Math.max(2, this.currentPage - Math.floor(visibleMiddleCount / 2));
    let end = start + visibleMiddleCount - 1;

    if (end > pagesCount - 1) {
      end = pagesCount - 1;
      start = end - visibleMiddleCount + 1;
      start = Math.max(2, start);
    }

    const items: PageItem[] = [1];

    if (start > 2) {
      items.push('ellipsis');
    }

    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }

    if (end < pagesCount - 1) {
      items.push('ellipsis');
    }

    items.push(pagesCount);
    return items;
  }
}
