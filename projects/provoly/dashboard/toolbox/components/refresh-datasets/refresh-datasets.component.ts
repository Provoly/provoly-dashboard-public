import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardSelectors, GlobalManifest, ManifestUtils, SearchActions } from '@provoly/dashboard';
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

  constructor(store: Store) {
    super(store);
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
      ManifestUtils.getDatasourcesUsedByManifest(this.manifest).forEach(
        (res: { datasetId: string; excludeGeo: boolean }) => {
          if (res.datasetId) {
            this.store.dispatch(
              SearchActions.getDatasourceItems({
                id: res.datasetId,
                excludeGeo: res.excludeGeo,
                from: 'RefreshDatasetsComponent.refresh()'
              })
            );
          }
        }
      );
    }
    this.close();
  }
}
