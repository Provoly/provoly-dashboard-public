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
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../../../../core/model/filter.interface';
import { SubscriptionnerDirective } from '../../../components/subscriptionner.directive';
import { FilterFactoryService } from '../../filter-factory.service';

@Component({
  selector: 'pry-filter-instanciator',
  templateUrl: './filter-instanciator.component.html'
})
export class FilterInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit {
  filter$ = new BehaviorSubject<Filter | null>(null);

  @Input() set filter(filter: Filter) {
    this.filter$.next(filter);
  }

  @ViewChild('filters', { read: ViewContainerRef }) filterContainerRef!: ViewContainerRef;

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
            component.instance.filter = filter;
            this.changeDetector.detectChanges();
          });
        }
      })
    );
  }
}
