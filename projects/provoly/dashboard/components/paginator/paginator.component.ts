import { Component, computed, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Action, Store } from '@ngrx/store';

@Component({
  selector: 'pry-paginator',
  templateUrl: './paginator.component.html'
})
export class PryPaginatorComponent {
  store = inject(Store);

  action = input<Action>();
  nbPerPage = input<number>(10);
  totalItemNb = input<number>(100);
  mode = input<'long' | 'short'>('long');

  nbOfPages = computed(() => {
    return Math.floor(this.totalItemNb() / this.nbPerPage());
  });
  pages = computed(() => {
    return Array.from({ length: this.nbOfPages() }, (_, i) => i + 1);
  });
  currentPage = signal(1);

  @Output() pageChange = new EventEmitter<number>();

  constructor() {
    effect(
      () => {
        if (this.currentPage()) {
          this.dispatchPageChangeAction();
        }
      },
      { allowSignalWrites: true }
    );
  }

  dispatchPageChangeAction() {
    if (this.action()) {
      this.store.dispatch({
        ...this.action(),
        // @ts-ignore
        offset: (this.currentPage() - 1) * this.nbPerPage(),
        limit: this.nbPerPage()
      });
    }
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }
}
