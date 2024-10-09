import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Filter } from '../../../../core/model/filter.interface';
import { SubscriptionnerDirective } from '../../../components/subscriptionner.directive';
import { FilterFactoryService } from '../../filter-factory.service';
import { BaseFilterComponent } from '../../base-filter.component';

@Component({
  selector: 'pry-filter-instanciator',
  templateUrl: './filter-instanciator.component.html'
})
export class FilterInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit, OnDestroy {
  filter$ = new BehaviorSubject<Filter | null>(null);
  private applySub?: Subscription;
  private currentInstance?: BaseFilterComponent;
  @Output() pressedEnter = new EventEmitter<void>();

  @Input() set filter(filter: Filter) {
    this.filter$.next(filter);
  }

  @ViewChild('filters', { read: ViewContainerRef }) filterContainerRef!: ViewContainerRef;

  @Input() set applyFilter$(applyFilter$: Observable<void>) {
    this.applySub?.unsubscribe();
    this.applySub = applyFilter$.subscribe(() => {
      this.currentInstance?.validateFilters();
    });
  }

  constructor(
    private store: Store,
    private injector: Injector,
    private filterFactoryService: FilterFactoryService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.filter$.subscribe((filter) => {
        if (filter) {
          if (this.currentInstance) {
            this.filterContainerRef.clear();
            this.currentInstance = undefined;
          }
          const component$ = this.filterFactoryService.generateFilter(
            filter.type,
            this.injector,
            this.filterContainerRef
          );
          component$.subscribe((component) => {
            this.currentInstance = component.instance;
            this.currentInstance.filter = filter;
            this.currentInstance.pressedEnter = this.pressedEnter;
            this.changeDetector.detectChanges();
          });
        }
      })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.applySub?.unsubscribe();
  }
}
