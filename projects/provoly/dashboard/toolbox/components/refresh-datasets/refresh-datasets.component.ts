import { Component, Inject, Optional } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  GlobalManifest,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  SearchActions,
  WidgetFactoryService
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-refresh-datasets',
  templateUrl: './refresh-datasets.component.html'
})
export class RefreshDatasetsComponent extends ToolboxActionComponent {
  manifest$: Observable<GlobalManifest>;
  manifest?: GlobalManifest;
  datasetCount = 0;

  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private widgetFactoryService: WidgetFactoryService
  ) {
    super(store, access);
    this.manifest$ = this.store.select(DashboardSelectors.globalManifest);
    this.subscriptions.add(this.manifest$.subscribe((manifest) => (this.manifest = manifest)));
    this.subscriptions.add(
      this.manifest$.subscribe(
        (manifest) =>
          (this.datasetCount =
            [
              ...new Set(
                manifest?.windows
                  .map((window) => window.widgets.map((widget) => widget.datasource))
                  .flat(3)
                  .filter((dataset) => !!dataset)
              )
            ].length ?? 0)
      )
    );
  }

  refresh() {
    if (this.manifest) {
      const dsAgg = this.widgetFactoryService.getObjectsToAutoLoad(this.manifest);

      const actions = [
        ...dsAgg.datasources.map((ds) =>
          SearchActions.getDatasourceItems({
            id: ds.datasetId,
            excludeGeo: ds.excludeGeo,
            from: 'RefreshDatasetsComponent.refresh()'
          })
        ),
        ...dsAgg.aggregates.map((agg) => DashboardActions.triggerAggregate({ id: agg }))
      ] as Action[];

      actions.forEach((action) => this.store.dispatch(action));
    }
    this.close();
  }
}
