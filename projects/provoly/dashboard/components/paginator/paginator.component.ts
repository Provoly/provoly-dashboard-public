import { Component, computed, effect, EventEmitter, inject, input, Output, signal, untracked } from '@angular/core';
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
  goBackToFirstPage = input<any>();

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
        // if current page changes, dispatch action to load data
        if (this.currentPage()) {
          this.dispatchPageChangeAction();
        }
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        if (this.goBackToFirstPage()) {
          this.changePage(1);
        }
      },
      { allowSignalWrites: true }
    );
  }

  dispatchPageChangeAction() {
    if (untracked(this.action)) {
      this.store.dispatch({
        ...untracked(this.action),
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
