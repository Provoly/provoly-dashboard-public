import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Inject, OnInit, Optional, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DashboardActions,
  DashboardSelectors,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  WidgetFactoryService
} from '@provoly/dashboard';
import { combineLatest, map, Observable, take } from 'rxjs';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-automate-refresh',
  templateUrl: './automate-refresh.component.html'
})
export class AutomateRefreshComponent extends ToolboxActionComponent implements OnInit {
  @ViewChild('datasourceList', { read: TemplateRef }) datasourceList!: TemplateRef<any>;
  @ViewChild('refreshRateList', { read: TemplateRef }) refreshRateList!: TemplateRef<any>;

  refreshRates = [0, 10, 30, 60];
  datasources$: Observable<string[]>;
  refreshRates$!: Observable<{ [p: string]: number }>;
  selectedDatasourceId: string = '';
  allRefreshRate$!: Observable<number>;

  private overlayRefDatasourceList?: OverlayRef;
  private overlayRefRefreshList?: OverlayRef;

  constructor(
    store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private widgetFactoryService: WidgetFactoryService,
    @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess
  ) {
    super(store, access);
    this.datasources$ = this.store
      .select(DashboardSelectors.globalManifest)
      .pipe(
        map((manifest) => [
          ...new Set(this.widgetFactoryService.getObjectsToAutoLoad(manifest).datasources.map((ds) => ds.datasetId))
        ])
      );
  }

  ngOnInit() {
    this.refreshRates$ = this.store.select(DashboardSelectors.refreshRates);

    this.allRefreshRate$ = combineLatest([this.datasources$, this.refreshRates$]).pipe(
      map(([datasources, refreshRates]) =>
        datasources.map((ds) => refreshRates[ds] ?? 0).reduce((p, c) => (p === c ? c : -1))
      )
    );
  }

  toggleDatasourceList() {
    if (!this.overlayRefDatasourceList) {
      this.overlayRefDatasourceList = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: false,
          panelClass: ['datasource-bg', 'refresh-rs']
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRefDatasourceList.attach(new TemplatePortal(this.datasourceList, this.viewContainerRef));
      this.subscriptions.add(
        this.overlayRefDatasourceList.backdropClick().subscribe((_) => this.hide(this.overlayRefDatasourceList))
      );
      const refreshElement = document.querySelector('.datasource-bg') as HTMLDivElement;
      const refresh = document.querySelector('.automate-btn') as HTMLDivElement;
      if (!!refreshElement) {
        const rect = refresh.getBoundingClientRect();
        refreshElement.style.left = rect.left + rect.width + 10 + 'px';
        refreshElement.style.top = rect.top + 'px';
      }
    }
  }

  hide(overlayRef: OverlayRef | undefined) {
    if (overlayRef) {
      overlayRef.dispose();
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    }
  }

  toggleRefreshRateList(datasourceId: string, templateIndex: number) {
    if (this.overlayRefRefreshList) {
      this.hide(this.overlayRefRefreshList);
    }
    this.selectDatasource(datasourceId);
    this.overlayRefRefreshList = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: false,
        panelClass: ['refresh-bg', 'refresh-rs']
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRefRefreshList.attach(new TemplatePortal(this.refreshRateList, this.viewContainerRef));
    this.subscriptions.add(
      this.overlayRefRefreshList.backdropClick().subscribe((_) => this.hide(this.overlayRefRefreshList))
    );
    const refreshElement = document.querySelector('.refresh-bg') as HTMLDivElement;
    const refresh = document.querySelector(`.ds-${templateIndex}`) as HTMLDivElement;
    if (!!refreshElement) {
      const rect = refresh.getBoundingClientRect();
      refreshElement.style.left = rect.left + rect.width + 5 + 'px';
      refreshElement.style.top = rect.top + 'px';
    }
  }

  selectDatasource(id: string) {
    this.selectedDatasourceId = id;
  }

  toggleRefreshRate(rate: number) {
    if (this.selectedDatasourceId !== 'all') {
      this.store.dispatch(DashboardActions.setRefreshRate({ rate, id: this.selectedDatasourceId }));
    } else {
      this.datasources$.pipe(take(1)).subscribe((datasourceIds) => {
        datasourceIds.forEach((id) => {
          this.store.dispatch(DashboardActions.setRefreshRate({ rate, id }));
        });
      });
    }
    setTimeout(() => {
      this.hide(this.overlayRefRefreshList);
      this.hide(this.overlayRefDatasourceList);
      this.close();
    }, 100);
  }
}
