import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CatalogEntry,
  ConfigSelectors,
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  SubscriptionnerDirective,
  ToolboxManifestService,
  Widget
} from '@provoly/dashboard';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'pry-catalog-item',
  templateUrl: './restitution-list-item.component.html'
})
export class PryRestitutionListItemComponent extends SubscriptionnerDirective {
  @Input() widget!: CatalogEntry;
  @Input() translate: boolean = true;
  catalog: Widget[] | undefined;
  automaticGridMode$: Observable<boolean>;
  automaticGridMode: boolean = false;

  constructor(
    private store: Store,
    private toolboxManifestService: ToolboxManifestService
  ) {
    super();
    this.store.select(ConfigSelectors.catalog).subscribe((catalog: Widget[]) => (this.catalog = catalog));
    this.automaticGridMode$ = this.store
      .select(DashboardSelectors.gridLayout)
      .pipe(map((layout) => layout !== DashboardGridLayout.MANUAL));
    this.subscriptions.add(this.automaticGridMode$.subscribe((modeAuto) => (this.automaticGridMode = modeAuto)));
  }

  dragStart($event: DragEvent, type: string) {
    if (!this.automaticGridMode) {
      this.toolboxManifestService.dataTransfer($event, type);
    }
  }

  viewInDashboard(widget: CatalogEntry) {
    this.store.dispatch(DashboardActions.addWidgetToPresentation({ widgetType: widget.type }));
  }
}
