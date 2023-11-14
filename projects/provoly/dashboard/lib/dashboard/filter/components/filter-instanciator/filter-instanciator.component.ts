import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
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
export class FilterInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit {
  filter$ = new BehaviorSubject<Filter | null>(null);
  private applySub?: Subscription;
  private currentInstance?: BaseFilterComponent;

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
          const component$ = this.filterFactoryService.generateFilter(
            filter.type,
            this.injector,
            this.filterContainerRef
          );
          component$.subscribe((component) => {
            this.currentInstance = component.instance;
            component.instance.filter = filter;
            this.changeDetector.detectChanges();
          });
        }
      })
    );
  }
}
