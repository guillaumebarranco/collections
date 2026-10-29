import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  ViewChild,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-entity-quotes',
  standalone: true,
  templateUrl: './entity-quotes.component.html',
  styleUrl: './entity-quotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityQuotesComponent implements AfterViewInit {
  readonly quotes = input.required<string[]>();

  readonly quotesExpanded = signal(false);
  readonly firstQuoteOverflows = signal(false);

  @ViewChild('firstQuote') firstQuote?: ElementRef<HTMLElement>;

  private quotesKey = '';

  constructor() {
    effect(() => {
      const quotes = this.quotes();
      const nextKey = `${quotes.length}\u0000${quotes[0] ?? ''}`;
      if (nextKey === this.quotesKey) {
        return;
      }
      const isFirst = this.quotesKey === '';
      this.quotesKey = nextKey;
      if (!isFirst) {
        this.quotesExpanded.set(false);
        this.firstQuoteOverflows.set(false);
      }
      setTimeout(() => this.measureFirstQuote());
    });
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.measureFirstQuote());
  }

  toggleQuotes(): void {
    this.quotesExpanded.update((expanded) => !expanded);
  }

  formatQuote(quote: string): string {
    return quote
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n');
  }

  private measureFirstQuote(): void {
    const element = this.firstQuote?.nativeElement;
    if (!element || this.quotesExpanded()) {
      return;
    }
    const wasClamped = element.classList.contains('entity-quotes__item--clamped');
    if (wasClamped) {
      element.classList.remove('entity-quotes__item--clamped');
    }
    const fullHeight = element.scrollHeight;
    if (wasClamped) {
      element.classList.add('entity-quotes__item--clamped');
    }
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
      return;
    }
    this.firstQuoteOverflows.set(fullHeight > lineHeight * 4 + 1);
  }
}
