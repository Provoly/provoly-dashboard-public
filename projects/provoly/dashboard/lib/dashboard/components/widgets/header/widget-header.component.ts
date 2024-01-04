import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, Subject, Subscription } from 'rxjs';
import { v4 } from 'uuid';
import { UNKNOWN_DATASOURCE } from '../../../../core/components/translate-id/translate-id.pipe';
import { GeoMetadata } from '../../../../core/model/dataset.interface';
import { DashboardGridLayout, DashboardManifest, WidgetManifest } from '../../../../core/model/manifest.interface';
import { Widget } from '../../../../core/model/widget.interface';
import { ConfigActions } from '../../../../core/store/config/config.actions';
import { DEFAULT_ICON_URL } from '../../../../core/store/config/icon-definitions.interface';
import { Dataset, DataSource, NamedQuery } from '../../../../core/store/data-source/data-source.model';
import { DataSourceSelectors } from '../../../../core/store/data-source/data-source.selectors';
import { LibraryTypes } from '../../../../core/store/image/image.service';
import { ToolboxMenuService } from '../../../../core/toolbox/toolbox-menu.service';
import { DashboardActions } from '../../../store/dashboard.actions';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';
import { WidgetPlacementUtils } from '../widget-placement/widget-placement.utils';
import { WidgetContextMenuDisplayOptions } from '../../../../core/model/display-options.interface';

export const WIDGET_HEADER_HEIGHT = 30;

export type HeaderAction = {
  icon: string;
  action: (that: PryWidgetHeaderComponent) => void;
  label: string;
  disabled?: (that: PryWidgetHeaderComponent) => boolean;
};

@Component({
  selector: 'pry-widget-header',
  templateUrl: './widget-header.component.html'
})
export class PryWidgetHeaderComponent extends SubscriptionnerDirective implements OnDestroy {
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('templateModal', { read: TemplateRef }) templateModal!: TemplateRef<any>;
  @ViewChild('toggle', { read: TemplateRef }) toggle!: TemplateRef<any>;
  @ViewChild('overlayMenu', { read: TemplateRef }) overlayMenu!: TemplateRef<any>;
  @ViewChild('overlayCatalog', { read: TemplateRef }) overlayCatalog!: TemplateRef<any>;
  @ViewChild('overlaySpot', { read: TemplateRef }) overlaySpot!: TemplateRef<any>;
  @ViewChild('togglePanel') togglePanel!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('validate') validate!: ElementRef<HTMLButtonElement>;
  @ViewChild('validateCatalog') validateCatalog!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancel') cancel!: ElementRef<HTMLButtonElement>;
  @ViewChild('crossCatalog') crossCatalog!: ElementRef<HTMLButtonElement>;
  @ViewChild('inputCatalog') inputCatalog!: ElementRef<HTMLInputElement>;
  @ViewChild('menuList') menuList!: ElementRef;
  manifest$ = new BehaviorSubject<WidgetManifest | null>(null);
  subscription?: Subscription;
  places: WidgetManifest[] = [];
  selectedItem?: Element | null;
  usedDatasources$: Observable<DataSource[]>;
  openSub?: Subscription;

  @Input() set manifest(manifest: WidgetManifest | null) {
    this.manifest$.next(manifest);
  }

  @Input() set openData$(open$: Observable<void> | Subject<void>) {
    this.openSub?.unsubscribe();
    this.openSub = open$.subscribe(() => {
      this.toggleDatasourceSelection();
    });
  }

  @Input() additionalOptions: HeaderAction[] | null = [];
  @Input() headerOptions: { [key: string]: boolean } | {} | undefined;
  @Input() displayCount = true;

  @Output() manifestModified = new EventEmitter<{ widgetIndex: number; manifest: WidgetManifest }>();

  isEdit = false;
  catalogInfo: Widget = {
    id: v4(),
    image: '',
    name: '',
    description: '',
    content: '',
    datasource: [],
    modificationDate: ''
  };

  @Input() set datasourceIds(datasourceIds: string[]) {
    this.selectedDataSourceIds$.next(datasourceIds);
  }

  @Input() set widgetIndex(widgetIndex: number) {
    this._widgetIndex$.next(widgetIndex);
    this._widgetIndex = widgetIndex;
  }

  displayContextMenu$: Observable<boolean | WidgetContextMenuDisplayOptions>;
  targetIndexes$: Observable<number[]>;
  _widgetIndex$ = new BehaviorSubject<number>(0);
  _widgetIndex!: number;
  open = false;
  selectedDataSourceIds$ = new BehaviorSubject<string[]>([]);

  windowManifest: DashboardManifest | null = null;
  private windowManifest$: Observable<DashboardManifest>;
  private menuRef?: OverlayRef;
  private comboRef?: OverlayRef;
  private confirmRemoveRef?: OverlayRef;
  private catalogRef?: OverlayRef;
  private spotRef?: OverlayRef;
  menu: boolean = false;
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    public toolboxMenuService: ToolboxMenuService
  ) {
    super();
    this.windowManifest$ = this.store
      .select(DashboardSelectors.windowManifest)
      .pipe(distinctUntilChanged((p, c) => equal(p, c)));

    this.targetIndexes$ = this.store.select(DashboardSelectors.targetTenantsIndexes);
    this.subscriptions.add(
      this.windowManifest$.subscribe((manifest) => {
        this.windowManifest = manifest;
      })
    );
    this.displayContextMenu$ = this.store
      .select(DashboardSelectors.displayOptions)
      .pipe(map((options) => options.widgetContextMenu));

    this.usedDatasources$ = combineLatest([
      this.store.select(DataSourceSelectors.getDataSourcesSorted),
      this.selectedDataSourceIds$
    ]).pipe(map(([allDss, dsIds]) => dsIds.map((id) => allDss.find((ds) => ds.id === id) ?? UNKNOWN_DATASOURCE(id))));
  }

  onArrowUp() {
    const lastElement = this.menuList.nativeElement.lastElementChild;
    if (this.selectedItem?.previousElementSibling) {
      this.selectedItem = this.selectedItem.previousElementSibling;
    } else {
      this.selectedItem = lastElement;
    }
    const focusElement = this.selectedItem?.children[0] as HTMLButtonElement;
    const focusChildrenElement = this.selectedItem?.children[0].children[0] as HTMLButtonElement;
    if (focusChildrenElement) {
      focusChildrenElement.focus();
    }
    focusElement.focus();
  }

  onArrowDown() {
    const firstElement = this.menuList.nativeElement.firstElementChild;
    if (this.selectedItem?.nextElementSibling) {
      this.selectedItem = this.selectedItem.nextElementSibling;
    } else {
      this.selectedItem = firstElement;
    }
    const focusElement = this.selectedItem?.children[0] as HTMLButtonElement;
    const focusChildrenElement = this.selectedItem?.children[0].children[0] as HTMLButtonElement;
    if (focusChildrenElement) {
      focusChildrenElement.focus();
    }
    focusElement.focus();
  }

  get currentLayout() {
    return this.windowManifest?.grid?.layout ?? DashboardGridLayout.MANUAL;
  }

  get hasGrid() {
    return this.currentLayout !== DashboardGridLayout.MANUAL;
  }

  get currentPlacementIndex() {
    return this.places.findIndex(
      (place) =>
        this.manifest$.getValue()?.layout.x === place.layout.x &&
        this.manifest$.getValue()?.layout.y === place.layout.y &&
        this.manifest$.getValue()?.layout.width === place.layout.width &&
        this.manifest$.getValue()?.layout.height === place.layout.height
    );
  }

  menuOpen($event?: MouseEvent, forceOpen?: boolean) {
    this.menu = !this.menu;
    const mustOpen = forceOpen !== undefined ? forceOpen : !this.menuRef;
    if (mustOpen) {
      this.menuRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['m-context-menu-wrapper'],
          backdropClass: 'backdrop',
          positionStrategy: this.overlay
            .position()
            .flexibleConnectedTo(this.togglePanel)
            .withPositions([
              {
                offsetX: 50,
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top'
              }
            ])
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-menu' }));
      this.menuRef.backdropClick().subscribe((_) => this.menuOpen());
      this.menuRef.attach(new TemplatePortal(this.overlayMenu, this.viewContainerRef));
      setTimeout(() => {
        this.selectedItem = this.menuList?.nativeElement?.firstElementChild;
        if (this.selectedItem) {
          const focus = this.selectedItem?.children[0] as HTMLButtonElement;
          const focusChildrenElement = this.selectedItem?.children[0]?.children[0] as HTMLButtonElement;
          focus ? focus.focus() : focusChildrenElement?.focus();
        }
      }, 10);
    } else {
      this.menuRef?.dispose();
      this.menuRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-menu' }));
      this.togglePanel?.nativeElement?.focus();
    }
  }

  toggleDatasourceSelection() {
    if (!this.comboRef) {
      this.comboRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-widget__choose-resultset'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-combo' }));
      this.comboRef.backdropClick().subscribe((_) => this.toggleDatasourceSelection());
      this.comboRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      setTimeout(() => {
        this.inputCatalog?.nativeElement?.focus();
      }, 10);
    } else {
      this.comboRef.dispose();
      this.comboRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-combo' }));
      this.menuOpen(undefined, false);
    }
  }

  moveInNewWindow(widgetIndex: number, targetIndex: number) {
    this.store.dispatch(DashboardActions.moveWidget({ widgetIndex, targetIndex }));
    this.store.dispatch(DashboardActions.toggleEditionMode({ force: false }));
    this.menuOpen();
  }

  maximize(widgetIndex: number) {
    this.store.dispatch(DashboardActions.maximizeWidget({ widgetIndex }));
    this.menuOpen();
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this._widgetIndex,
      manifest: {
        ...this.manifest$.getValue(),
        datasource: this.selectedDataSourceIds$.getValue()
      } as unknown as WidgetManifest
    });
    this.toggleDatasourceSelection();
  }

  toggleRemoveConfirm($event?: MouseEvent) {
    if (!this.confirmRemoveRef) {
      this.confirmRemoveRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-modal' }));
      this.confirmRemoveRef.backdropClick().subscribe((_) => this.toggleRemoveConfirm());
      this.confirmRemoveRef.attach(new TemplatePortal(this.templateModal, this.viewContainerRef));
      if ($event) {
        const panel = document.querySelector('div.o-modal-wrapper') as HTMLDivElement;
        if (!!panel) {
          panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.clientWidth, $event.clientX - 30)) + 'px';
          panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.clientHeight, $event.clientY - 10)) + 'px';
        }
      }
      setTimeout(() => {
        this.cross?.nativeElement?.focus();
      }, 10);
    } else {
      this.confirmRemoveRef.dispose();
      this.confirmRemoveRef = undefined;
      this.togglePanel?.nativeElement?.focus();
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
      this.menuOpen();
    }
  }

  confirmRemove() {
    this.remove();
    this.cancelRemoveConfirm();
  }

  remove() {
    const listWidgetManifests = [...(this.windowManifest || { widgets: [] }).widgets];
    listWidgetManifests.splice(this._widgetIndex, 1);

    this.store.dispatch(
      DashboardActions.updateDashboardManifest({
        manifest: {
          ...this.windowManifest,
          widgets: listWidgetManifests
        }
      })
    );
  }

  cancelRemoveConfirm() {
    this.isEdit = false;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    this.confirmRemoveRef?.backdropClick().subscribe(() => this.toggleRemoveConfirm());
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
    this.menuRef?.dispose();
    this.menuRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-menu' }));
  }

  toggleCatalog() {
    if (!this.catalogRef) {
      this.catalogInfo = {
        id: v4(),
        image: '',
        name: '',
        description: '',
        content: '',
        datasource: [],
        modificationDate: ''
      };
      this.catalogRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-catalog' }));
      this.catalogRef.backdropClick().subscribe((_) => this.toggleCatalog());
      this.catalogRef.attach(new TemplatePortal(this.overlayCatalog, this.viewContainerRef));
      setTimeout(() => {
        this.crossCatalog?.nativeElement?.focus();
      }, 10);
    } else {
      this.catalogRef.dispose();
      this.catalogRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-catalog' }));
      this.menuOpen();
    }
  }

  confirmCatalog() {
    if (this.toolboxMenuService.isValidForCatalog(this.catalogInfo.name)) {
      this.toolboxMenuService.addToCatalog(
        {
          ...this.catalogInfo,
          content: JSON.stringify({ ...this.manifest$.getValue(), title: this.catalogInfo.name })
        },
        this._widgetIndex
      );
    }
    this.toggleCatalog();
  }

  executeAction(options: HeaderAction) {
    options.action(this);
    this.menuOpen();
  }

  isActionDisabled(option: HeaderAction) {
    return !!option?.disabled ? option?.disabled(this) : false;
  }

  toggleChangeSpot() {
    if (!this.spotRef) {
      this.places = WidgetPlacementUtils.placementOptions({ type: 'icon' } as WidgetManifest, this.currentLayout, {
        ...this.windowManifest?.grid
      });

      this.spotRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-spot' }));
      this.spotRef.backdropClick().subscribe(() => this.toggleChangeSpot());
      this.spotRef.attach(new TemplatePortal(this.overlaySpot, this.viewContainerRef));
    } else {
      this.spotRef.dispose();
      this.spotRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-spot' }));
      this.menuOpen();
    }
  }

  moveToPlace(place: WidgetManifest) {
    const startLayout = this.manifest$.getValue()!.layout;
    const targetLayout = place.layout;
    const newWindowManifest = JSON.parse(JSON.stringify(this.windowManifest)) as DashboardManifest;

    const targetWidgetIndex = newWindowManifest.widgets.findIndex(
      (w) =>
        w.layout.x === targetLayout.x &&
        w.layout.y === targetLayout.y &&
        w.layout.width === targetLayout.width &&
        w.layout.height === targetLayout.height
    );
    const startWidgetIndex = newWindowManifest.widgets.findIndex(
      (w) =>
        w.layout.x === startLayout.x &&
        w.layout.y === startLayout.y &&
        w.layout.width === startLayout.width &&
        w.layout.height === startLayout.height
    );
    if (targetWidgetIndex !== -1) {
      newWindowManifest.widgets[targetWidgetIndex].layout = startLayout;
    }
    newWindowManifest.widgets[startWidgetIndex].layout = targetLayout;

    this.store.dispatch(DashboardActions.updateDashboardManifest({ manifest: newWindowManifest }));

    this.toggleChangeSpot();
  }

  focusCrossElement() {
    this.cross?.nativeElement?.focus();
    this.crossCatalog?.nativeElement?.focus();
  }

  focusValidation() {
    this.validateCatalog?.nativeElement?.focus();
    if (!this.toolboxMenuService.isValidForCatalog(this.catalogInfo?.name)) {
      this.cancel?.nativeElement?.focus();
    }
    this.validate?.nativeElement?.focus();
  }

  focusInputCatalog() {
    this.inputCatalog?.nativeElement?.focus();
  }

  disableValidation() {
    if (!this.toolboxMenuService.isValidForCatalog(this.catalogInfo?.name)) {
      this.crossCatalog?.nativeElement?.focus();
    }
  }

  datasourcesChanged($event: DataSource[]) {
    const ids = $event.map((ds) => ds.id);
    if (JSON.stringify(this.selectedDataSourceIds$.getValue()) !== JSON.stringify(ids)) {
      this.selectedDataSourceIds$.next(ids);
    }
  }

  isGeo(ds: NamedQuery | Dataset) {
    return ds.metadata?.find((m) => m.metadataDef.name === GeoMetadata.NAMESPACE) !== undefined;
  }

  protected readonly DEFAULT_ICON_URL = DEFAULT_ICON_URL;

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription?.unsubscribe();
    this.openSub?.unsubscribe();
  }
}
