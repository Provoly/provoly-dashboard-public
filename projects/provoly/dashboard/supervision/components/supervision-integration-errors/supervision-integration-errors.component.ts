import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClassActions } from '@provoly/dashboard';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntegrationError } from '../../store/supervision-api.model';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-integration-errors',
  templateUrl: './supervision-integration-errors.component.html'
})
export class SupervisionIntegrationErrorsComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();
  integrationErrors$: Observable<IntegrationError[]>;
  currentIntegrationError = new BehaviorSubject<IntegrationError | undefined>(undefined);
  selectedClasses!: string[];
  loading$: Observable<boolean>;
  refreshInterval$: Observable<number>;
  possibleIntervals = [1, 5, 10, 15, 20, 25, 30];
  sortActive? = 'name';
  sortDirection? = 'asc';
  @ViewChild('detailPanel', { static: true, read: ViewContainerRef }) detailPanel!: ViewContainerRef;

  constructor(private store: Store<any>) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(SupervisionActions.loadIntegrationErrors());
    this.integrationErrors$ = this.store.select(SupervisionSelectors.integrationErrors);
    this.subscription.add(
      this.store.select(SupervisionSelectors.selectedClasses).subscribe((selectedClasses: string[]) => {
        this.selectedClasses = selectedClasses;
      })
    );
    this.loading$ = this.store.select(SupervisionSelectors.loading);
    this.refreshInterval$ = this.store
      .select(SupervisionSelectors.refreshInterval)
      .pipe(map((interval) => interval / 1000));
    this.store.dispatch(SupervisionActions.startAutoRefresh());
    this.store.dispatch(
      SupervisionActions.mainActions({
        actions: [
          {
            action: SupervisionActions.reloadErrors(),
            icon: 'reset',
            label: 'reloadErrors',
            moduleAccess: 'supervision',
            pageAccess: 'errors'
          },
          {
            action: SupervisionActions.acknowledgeErrors(),
            icon: 'check',
            label: 'acknowledgeErrors',
            moduleAccess: 'supervision',
            pageAccess: 'errors'
          },
          {
            action: SupervisionActions.loadIntegrationErrors(),
            label: 'refresh',
            icon: 'synchro',
            moduleAccess: 'supervision',
            pageAccess: 'errors'
          }
        ]
      })
    );
  }

  selectCurrentError(e: IntegrationError) {
    if (this.currentIntegrationError.value?.oClass === e.oClass) this.currentIntegrationError.next(undefined);
    else this.currentIntegrationError.next(e);
  }

  getTotalErrorCount(e: IntegrationError): number {
    return e.errors.reduce((previousValue, currentValue) => previousValue + currentValue.count, 0);
  }

  toggleErrorDetails(e: IntegrationError): void {
    this.selectCurrentError(e);
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: e, errorDetailsOpen: true }));
  }

  onCheckChange(selectedClass: string): void {
    this.store.dispatch(SupervisionActions.toggleClassSelection({ selectedClass }));
  }

  isClassSelected(c: string): boolean {
    return !!this.selectedClasses.find((oclass) => oclass === c);
  }

  setRefreshInterval($event: number): void {
    this.store.dispatch(SupervisionActions.stopAutoRefresh());
    this.store.dispatch(SupervisionActions.setRefreshInterval({ interval: +$event * 1000 }));
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: undefined, errorDetailsOpen: false }));
    this.subscription.unsubscribe();
    this.store.dispatch(SupervisionActions.mainActions({ actions: [] }));
    this.store.dispatch(SupervisionActions.stopAutoRefresh());
  }
}
