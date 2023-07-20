import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CatalogEntry,
  ConfigActions,
  ConfigSelectors,
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  PryI18nService,
  PryVisibilityType,
  SubscriptionnerDirective,
  ToolboxManifestService,
  ToolboxMenuService,
  ViewMode,
  Widget
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-catalog',
  templateUrl: './restitution-list.component.html'
})
export class PryRestitutionListComponent extends SubscriptionnerDirective {
  search$ = new BehaviorSubject('');
  type$ = new BehaviorSubject<undefined | string>(undefined);
  filteredWidgets$: Observable<CatalogEntry[]>;
  types$: Observable<{ icon: string; label: string; type: string }[]>;
  selectedRestitution: Widget | null = null;
  mode = ViewMode;
  selectedMode: ViewMode = ViewMode.CATALOG;
  catalog: Widget[] | undefined;
  automaticGridMode$: Observable<boolean>;
  modeAuto: boolean = false;
  PryVisibilityType = PryVisibilityType;

  constructor(
    private toolboxMenuService: ToolboxMenuService,
    private translateService: PryI18nService,
    private toolboxManifestService: ToolboxManifestService,
    private store: Store
  ) {
    super();
    this.store.dispatch(ConfigActions.loadWidgets());
    this.filteredWidgets$ = combineLatest([this.toolboxMenuService.menuList$, this.search$, this.type$]).pipe(
      map(([menus, search, type]) =>
        menus.filter(
          (menu) =>
            (search.length === 0 ||
              this.translateService.instant(menu.label).toLocaleLowerCase().includes(search.toLocaleLowerCase())) &&
            (!type || this.toolboxManifestService.get(menu.type).type === type)
        )
      )
    );
    this.types$ = this.toolboxMenuService.types$;
    this.store.select(ConfigSelectors.catalog).subscribe((catalog: Widget[]) => (this.catalog = catalog));
    this.automaticGridMode$ = this.store
      .select(DashboardSelectors.gridLayout)
      .pipe(map((layout) => layout !== DashboardGridLayout.MANUAL));
    this.subscriptions.add(this.automaticGridMode$.subscribe((modeAuto) => (this.modeAuto = modeAuto)));
  }

  dragStart($event: DragEvent, type: string) {
    if (!this.modeAuto) {
      this.toolboxManifestService.dataTransfer($event, type);
    }
  }

  selectMode(newMode: ViewMode) {
    this.selectedMode = newMode;
  }

  selectRestitution(catalogEntry: CatalogEntry) {
    if (catalogEntry.isCustom) {
      this.catalog?.forEach((widget: Widget) => {
        if (widget.id === catalogEntry.type) {
          this.selectedRestitution = widget;
          this.selectMode(this.mode.CONSULT);
        }
      });
    }
  }

  closeRestitution($event: void) {
    this.selectedRestitution = null;
    this.selectMode(this.mode.CATALOG);
  }

  viewInDashboard(widget: CatalogEntry) {
    this.store.dispatch(DashboardActions.addWidgetToPresentation({ widgetType: widget.type }));
  }
}
