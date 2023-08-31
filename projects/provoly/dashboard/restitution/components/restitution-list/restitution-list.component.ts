import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CatalogEntry,
  ConfigActions,
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
  @Input() showTabs = true;
  @Input()
  get customModels(): string[] {
    return this._customModels;
  }
  set customModels(models: string[]) {
    this._customModels = ['detail', 'iframe', ...models];
  }
  private _customModels = ['detail', 'iframe'];
  search$ = new BehaviorSubject('');
  type$ = new BehaviorSubject<undefined | string>(undefined);
  filteredWidgets$: Observable<CatalogEntry[]>;
  nonCustomWidgets$: Observable<CatalogEntry[]>;
  customWidgets$: Observable<CatalogEntry[]>;
  types$: Observable<{ icon: string; label: string; type: string }[]>;
  selectedRestitution: Widget | null = null;
  mode = ViewMode;
  selectedMode: ViewMode = ViewMode.CATALOG;
  categories = ['model', 'noModel'];
  PryVisibilityType = PryVisibilityType;

  constructor(
    private toolboxMenuService: ToolboxMenuService,
    private translateService: PryI18nService,
    private toolboxManifestService: ToolboxManifestService,
    private store: Store
  ) {
    super();
    this.store.dispatch(ConfigActions.loadWidgets());
    this.types$ = this.toolboxMenuService.types$;
    this.filteredWidgets$ = combineLatest([this.toolboxMenuService.menuList$, this.search$, this.type$]).pipe(
      map(([widgets, search, type]) =>
        widgets.filter(
          (widget) =>
            (search.length === 0 ||
              this.translateService.instant(widget.label).toLocaleLowerCase().includes(search.toLocaleLowerCase())) &&
            (!type || this.toolboxManifestService.get(widget.type).type === type)
        )
      )
    );
    this.nonCustomWidgets$ = this.filteredWidgets$.pipe(
      map((widgets) =>
        widgets.filter(
          (widget) => this.toolboxManifestService.isModel(widget.type) || this.customModels.includes(widget.type)
        )
      )
    );
    this.customWidgets$ = this.filteredWidgets$.pipe(
      map((widgets) =>
        widgets.filter(
          (widget) => !this.toolboxManifestService.isModel(widget.type) && !this.customModels.includes(widget.type)
        )
      )
    );
  }

  selectMode(newMode: ViewMode) {
    this.selectedMode = newMode;
  }

  selectRestitution($event: Widget) {
    this.selectedRestitution = $event;
    this.selectMode(ViewMode.CONSULT);
  }

  closeRestitution() {
    this.selectedRestitution = null;
    this.selectMode(this.mode.CATALOG);
  }
}
