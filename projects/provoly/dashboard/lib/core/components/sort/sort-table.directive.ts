import {
  AfterContentInit,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { PrySortHeaderComponent } from './sort-header/sort-header.component';
import { PrySortChange } from './sort.model';

@Directive({
  selector: '[prySortTable]'
})
export class PrySortTableDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(PrySortHeaderComponent, { descendants: true }) contentChildrenC!: QueryList<PrySortHeaderComponent>;
  @Input() prySortActive?: string;
  @Input() prySortDirection?: 'asc' | 'desc';
  @Output() prySortChange = new EventEmitter<PrySortChange>();

  private subSort?: Subscription;
  private sub = new Subscription();

  ngAfterContentInit() {
    if (this.prySortActive && this.prySortDirection) {
      const header = this.contentChildrenC.find((item) => item.prySortHeader === this.prySortActive);
      if (header) {
        header.prySortActive = true;
        header.prySortDirection = this.prySortDirection;
      }
    }
    this.subSort = merge(...this.contentChildrenC.map((item) => item.sortChange.asObservable())).subscribe((value) => {
      this.resetSorts(value);
      this.prySortChange.emit(value);
    });
    this.sub.add(
      this.contentChildrenC.changes.subscribe(() => {
        this.subSort?.unsubscribe();
        this.subSort = merge(...this.contentChildrenC.map((item) => item.sortChange.asObservable())).subscribe(
          (value) => {
            this.resetSorts(value);
            this.prySortChange.emit(value);
          }
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subSort?.unsubscribe();
  }

  private resetSorts(sort: PrySortChange): void {
    this.contentChildrenC.forEach((item) => {
      if (item.prySortHeader !== sort.active) {
        item.prySortActive = false;
        item.prySortDirection = undefined;
      } else {
        item.prySortActive = true;
        item.prySortDirection = sort.direction;
      }
    });
  }
}
