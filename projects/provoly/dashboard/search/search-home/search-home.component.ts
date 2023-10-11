import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  DataSourceActions,
  DataSourceSelectors,
  DatasourceUtils,
  defaultMenuStructure,
  FullTextSearchPayload,
  NamedQuery,
  NamedQueryTypes,
  PryDialogConfirmComponent,
  PryDialogConfirmData,
  PryDialogService,
  SearchActions,
  WidgetLayout
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, combineLatestWith, filter, Observable, Subscription, take } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { PrySaveQueryComponent } from '../components/save-query/save-query.component';
import { SearchFulltextChange } from '../search-fulltext/search-fulltext/search-fulltext.component';

@Component({
  selector: 'pry-search-home',
  templateUrl: './search-home.component.html'
})
export class PrySearchHomeComponent implements OnInit, OnDestroy {
  @ViewChild('templateSpot', { read: TemplateRef }) templateSpot!: TemplateRef<any>;
  @ViewChild('templateRefresh', { read: TemplateRef }) templateRefresh!: TemplateRef<any>;

  @Input() searchFulltextTpl?: TemplateRef<any>;
  @Input() isMoreList = false;

  @Output() changeListView = new EventEmitter<boolean>();
  @Output() changeSearchCriteria = new EventEmitter<boolean>();

  namedQueryList$?: Observable<NamedQuery[]>;
  private subscription: Subscription = new Subscription();

  namedQueriesUses$!: Observable<{ [p: string]: { windowIndex: number; type: string; layout: WidgetLayout }[] }>;
  spotting$ = new BehaviorSubject<string>('');
  spottingWidget$!: Observable<{ windowIndex: number; type: string; layout: WidgetLayout }[]>;
  refreshOptions = [0, 10, 30, 60];

  icons = {
    map: 'share_location',
    table: 'table_chart',
    chart: 'show_chart',
    graph: 'graph'
  } as { [key: string]: string };

  loadOpened: string | undefined;

  private overlayRef?: OverlayRef;

  readonly connectedPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };
  structure = defaultMenuStructure.map((items) => ({
    ...items,
    sub: items.sub.filter((s) => s.type !== 'iframe' && s.type !== 'detail')
  }));

  refreshRates$!: Observable<{ [p: string]: number }>;
  refreshId: string = '';
  deleteError$?: Observable<any>;
  layout$!: Observable<DashboardGridLayout>;
  DashboardGridLayout = DashboardGridLayout;

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private pryDialog: PryDialogService
  ) {}

  ngOnInit() {
    this.store.dispatch(DataSourceActions.load());
    this.namedQueryList$ = this.store.select(DataSourceSelectors.getNamedQuerySorted);
    this.namedQueriesUses$ = this.store.select(DashboardSelectors.namedQueriesUses);
    this.spottingWidget$ = combineLatest([this.namedQueriesUses$, this.spotting$]).pipe(
      map(([uses, spotting]) => uses[spotting] ?? []),
      map((uses) => uses.map((use) => ({ ...use, windowIndex: use.windowIndex + 1 })))
    );
    this.refreshRates$ = this.store.select(DashboardSelectors.refreshRates);
    this.layout$ = this.store.select(DashboardSelectors.gridLayout);
    this.deleteError$ = this.store.select(DataSourceSelectors.errors).pipe(debounceTime(100));
  }

  onSearchNamedQuery(id: string) {
    this.store.dispatch(DashboardActions.updateWidgetInPresentation({ id, widgetType: 'table' }));
  }

  onFavorite(id: string, isFavorite: boolean | undefined) {
    if (!isFavorite) {
      this.store.dispatch(DataSourceActions.namedQuery.addFavorite({ id }));
    } else {
      this.store.dispatch(DataSourceActions.namedQuery.deleteFavorite({ id }));
    }
  }

  onSpot(id: string, $event: MouseEvent) {
    this.spotting$.next(id);

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: false,
          panelClass: ['spot-rs']
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.attach(new TemplatePortal(this.templateSpot, this.viewContainerRef));
      const spotElement = document.querySelector('.spot-rs') as HTMLDivElement;
      if (!!spotElement) {
        spotElement.style.left = $event.clientX - 10 + 'px';
        spotElement.style.top = $event.clientY - 10 + 'px';
      }
    }
  }

  hideSpot() {
    this.overlayRef?.dispose();
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    this.overlayRef = undefined;
  }

  onEdit(namedQuery: NamedQuery) {
    this.store.dispatch(DataSourceActions.namedQuery.edit({ currentEdit: namedQuery }));
  }

  onChangeListView(isMoreList: boolean) {
    this.changeListView.emit(isMoreList);
  }

  onSearchCriteria() {
    this.changeSearchCriteria.emit();
  }

  loadWidget(id: string, sub: { icon: string; label: string; type: string }) {
    this.store.dispatch(DashboardActions.updateWidgetInPresentation({ id, widgetType: sub.type }));
    this.loadOpened = undefined;
  }

  onDelete(nq: NamedQuery) {
    const data: PryDialogConfirmData = {
      title: '@pry.search.namedQuery.delete',
      actions: [
        { id: 0, label: '@pry.toolbox.manifest.close', color: 'ghost' },
        { id: 1, label: '@pry.search.namedQuery.delete' }
      ]
    };
    const dialog = this.pryDialog.open(PryDialogConfirmComponent, {
      data
    });
    this.subscription.add(
      dialog.closeValue.pipe(take(1)).subscribe((action) => {
        this.store.dispatch(ConfigActions.closeOverlay({ id: 'PryDialogConfirmComponent' }));
        if (action.id === 1) {
          this.store.dispatch(DataSourceActions.namedQuery.delete({ id: nq.id ?? '' }));
          this.subscription.add(
            this.deleteError$
              ?.pipe(
                combineLatestWith(this.store.select(DataSourceSelectors.isLoading)),
                filter(([, isLoading]) => !isLoading),
                take(1)
              )
              .subscribe(([error]) => {
                if (error?.status === 403) {
                  const data: PryDialogConfirmData = {
                    title: '@pry.manifest.deleteError',
                    actions: [{ id: 1, label: '@pry.toolbox.close' }]
                  };
                  const errorDialog = this.pryDialog.open(PryDialogConfirmComponent, {
                    data
                  });
                  this.subscription.add(
                    errorDialog.closeValue.pipe(take(1)).subscribe(() => {
                      this.store.dispatch(ConfigActions.closeOverlay({ id: 'PryDialogConfirmComponent' }));
                    })
                  );
                }
              })
          );
        }
      })
    );
  }

  onRename(nq: NamedQuery) {
    this.store.dispatch(DataSourceActions.namedQuery.openRename());
    this.store.dispatch(DataSourceActions.namedQuery.edit({ currentEdit: nq }));
    const save = false;
    const type = DatasourceUtils.getTypeFromPayload(nq.request);
    const data =
      type === NamedQueryTypes.FULL_TEXT
        ? { save, type, payload: this.extractPayload(nq.request as FullTextSearchPayload) }
        : { save, type };
    this.pryDialog.open(PrySaveQueryComponent, { data });
  }

  private extractPayload(payload: FullTextSearchPayload): SearchFulltextChange {
    const { fullSearch, oClasses } = payload;
    return { value: fullSearch.value, classes: oClasses ?? [] };
  }

  onRefresh(id: string, $event: MouseEvent) {
    this.refreshId = id;

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['refresh-rs']
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.attach(new TemplatePortal(this.templateRefresh, this.viewContainerRef));
      this.overlayRef.backdropClick().subscribe((_) => this.hideSpot());
      const refreshElement = document.querySelector('.refresh-rs') as HTMLDivElement;
      const refresh = document.querySelector('.refreshbt') as HTMLDivElement;
      if (!!refreshElement) {
        const rect = refresh.getBoundingClientRect();
        refreshElement.style.left = rect.left + rect.width + 10 + 'px';
        refreshElement.style.top = rect.top + 137 + 'px';
      }
    }
  }

  selectRefresh($event: number) {
    this.store.dispatch(DashboardActions.setRefreshRate({ id: this.refreshId ?? '', rate: $event }));
    this.hideSpot();
  }

  refresh(id: string) {
    this.store.dispatch(SearchActions.getDatasourceItems({ id }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
