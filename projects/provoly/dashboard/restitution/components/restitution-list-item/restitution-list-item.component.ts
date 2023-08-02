import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CatalogEntry,
  ConfigSelectors,
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  PryVisibilityType,
  SubscriptionnerDirective,
  ToolboxManifestService,
  Widget
} from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-catalog-item',
  templateUrl: './restitution-list-item.component.html'
})
export class PryRestitutionListItemComponent extends SubscriptionnerDirective {
  @Input() widget!: CatalogEntry;
  @Output() selectRestitution = new EventEmitter<Widget>();
  catalog: Widget[] | undefined;
  automaticGridMode$: Observable<boolean>;
  automaticGridMode: boolean = false;
  PryVisibilityType = PryVisibilityType;

  constructor(private store: Store, private toolboxManifestService: ToolboxManifestService) {
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

  emitSelectedRestitution(catalogEntry: CatalogEntry) {
    if (catalogEntry.isCustom) {
      this.catalog?.forEach((widget: Widget) => {
        if (widget.id === catalogEntry.type) {
          this.selectRestitution.emit(widget);
        }
      });
    }
  }

  viewInDashboard(widget: CatalogEntry) {
    this.store.dispatch(DashboardActions.addWidgetToPresentation({ widgetType: widget.type }));
  }
}
