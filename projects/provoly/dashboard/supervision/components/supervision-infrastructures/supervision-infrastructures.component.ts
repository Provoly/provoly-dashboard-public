import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Infrastructure, LastInfrastructureScale } from '../../store/supervision-api.model';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-infrastructures',
  templateUrl: './supervision-infrastructures.component.html'
})
export class SupervisionInfrastructuresComponent {
  infras$: Observable<Infrastructure[]>;
  loading$: Observable<boolean>;
  lastInfraScale$: Observable<LastInfrastructureScale | undefined>;
  classFromStatus: { [key: string]: string } = {
    GREEN: '-ok',
    YELLOW: '-warning',
    RED: '-error'
  };

  constructor(private store: Store<any>) {
    this.store.dispatch(SupervisionActions.loadInfras());
    this.infras$ = this.store.select(SupervisionSelectors.infrastructures);
    this.lastInfraScale$ = this.store.select(SupervisionSelectors.lastInfraScale);
    this.loading$ = this.store.select(SupervisionSelectors.loading);
    this.store.dispatch(
      SupervisionActions.mainActions({
        actions: [
          {
            action: SupervisionActions.loadInfras(),
            label: 'refresh',
            icon: 'synchro'
          }
        ]
      })
    );
  }

  onScaleUp(infra: string, replicas: number): void {
    this.store.dispatch(
      SupervisionActions.scaleInfra({
        name: infra,
        scale: replicas + 1,
        up: true
      })
    );
  }

  onScaleDown(infra: string, replicas: number): void {
    this.store.dispatch(
      SupervisionActions.scaleInfra({
        name: infra,
        scale: replicas - 1,
        up: false
      })
    );
  }
}
