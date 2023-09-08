import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import {
  auditTime,
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  fromEvent,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  DashboardGridLayout,
  DashboardManifest,
  WidgetLayout,
  WidgetManifest
} from '../../core/model/manifest.interface';
import { MIME_TYPE_RESULTSET } from '../../core/model/mimetype-resultset.constant';
import { CategoryActions } from '../../core/store/category/category.actions';
import { ClassActions } from '../../core/store/class/class.actions';
import { ConfigActions } from '../../core/store/config/config.actions';
import { ConfigSelectors } from '../../core/store/config/config.selectors';
import { DataSourceActions } from '../../core/store/data-source/data-source.actions';
import { FieldActions } from '../../core/store/field/field.actions';
import { RelationTypesActions } from '../../core/store/relation-types/relation-types.actions';
import { WidgetPlacementUtils } from '../components/widgets/widget-placement/widget-placement.utils';
import { DashboardActions, DashboardCellParams } from '../store/dashboard.actions';
import {
  DEFAULT_COLUMNS_NUMBER,
  DEFAULT_GAP_PX,
  DEFAULT_ROW_HEIGHT_PX,
  DEFAULT_ROWS_NUMBER
} from '../store/dashboard.contants';
import { DashboardSelectors } from '../store/dashboard.selectors';
import { solveCollisions } from './solve-collisions.function';
import { SubscriptionnerDirective } from './subscriptionner.directive';
import { BaseWidgetComponent } from './widgets/base-widget.component';
import { DisplayMode, DisplayOptions } from '../../core/model/display-options.interface';

export const MIME_TYPE_WIDGET_MANIFEST = 'application/widget-manifest';
export const MIME_TYPE_WIDGET_TYPE = 'application/widget-type-';
export const MIME_TYPE_WIDGET_SIZE = 'application/widget-size-';

@Component({
  selector: 'pry-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends SubscriptionnerDirective implements OnInit, AfterViewInit {
  manifest: DashboardManifest | null = null;
  windowManifest$: Observable<DashboardManifest>;
  modeEdition = false;
  modeEdition$: Observable<boolean>;
  actionType: string | undefined;
  staticDashboard$: BehaviorSubject<DashboardManifest | null> = new BehaviorSubject<DashboardManifest | null>(null);
  stacked$ = new BehaviorSubject<boolean>(false);
  indexForRemoval: number = -1;
  @ViewChild('templateModal', { read: TemplateRef }) templateModal!: TemplateRef<any>;
  separators$: Observable<WidgetLayout[]>;
  nonFillerWidgets$: Observable<number>;
  widgetsInstances: Array<BaseWidgetComponent> = [];
  loading$: Observable<boolean>;

  @Input() set staticDashboard(window: DashboardManifest) {
    this.staticDashboard$.next(window);
  }

  @Input() CloseOnDragOut = true;
  @Input() displayOptions?: DisplayOptions;

  @ViewChild('grid') gridRef!: ElementRef;
  private canCalculateView = false;
  targetIndexes$: Observable<number[]>;
  dashboardParams: DashboardCellParams = {
    gridWidth: 1,
    gridHeight: 1,
    gridGap: DEFAULT_GAP_PX,
    columns: DEFAULT_COLUMNS_NUMBER,
    cellWidth: 1,
    cellHeight: DEFAULT_ROW_HEIGHT_PX,
    rows: DEFAULT_ROWS_NUMBER,
    offsetLeft: 0,
    offsetTop: 0,
    mobileMode: false
  };
  private breakpoint: number = 0;
  @Output() rowHeight = new EventEmitter<number>();
  @Output() rows = new EventEmitter<number>();
  currentlyModifiedManifest: WidgetManifest | null = null;
  initialWidgetManifestList: WidgetManifest[] = [];
  move: {
    initialX: number;
    initialY: number;
    previousX: number;
    previousY: number;
  } = {
    initialX: -1,
    initialY: -1,
    previousX: -1,
    previousY: -1
  };
  gridTemplateRows$: Observable<string>;
  gridTemplateColumns$: Observable<string>;
  DashboardGridLayout = DashboardGridLayout;
  layout: DashboardGridLayout = DashboardGridLayout.MANUAL;
  backgroundArea$: Observable<string>;
  private confirmRemoveRef?: OverlayRef;
  Array: any;

  constructor(private store: Store<any>, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super();
    this.loading$ = this.store.select(DashboardSelectors.loading);
    this.modeEdition$ = this.store.select(DashboardSelectors.dashboardEditionMode);
    this.subscriptions.add(
      this.modeEdition$.subscribe((mode) => {
        this.modeEdition = mode;
        if (!mode) {
          this.clearActions();
        }
      })
    );
    this.targetIndexes$ = this.store.select(DashboardSelectors.targetTenantsIndexes);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.dashboardCellParams).subscribe((params) => (this.dashboardParams = params))
    );
    this.windowManifest$ = this.store.select(DashboardSelectors.windowManifest).pipe(
      combineLatestWith(this.staticDashboard$),
      switchMap(([windowManifest, staticDashboard]) => (!staticDashboard ? of(windowManifest) : of(staticDashboard))),
      distinctUntilChanged((p, c) => equal(p, c)),
      map((_wManifest) => {
        const wManifest = JSON.parse(JSON.stringify(_wManifest));
        if (wManifest.grid?.layout && wManifest.grid.layout !== DashboardGridLayout.MANUAL) {
          // Complete with placeholders
          const size = WidgetPlacementUtils.placesForLayout(wManifest.grid.layout);
          const places = WidgetPlacementUtils.placementOptions(
            { type: 'filler', layout: { x: 1, y: 1, width: 1, height: 1 } },
            wManifest.grid.layout,
            wManifest.grid
          );
          let added = true;
          while (wManifest.widgets.length < size && added) {
            added = false;
            for (let i = 0; i < places.length; i++) {
              const potential = { ...places[i], options: { index: i } };
              if (
                wManifest.widgets
                  .map((widget: WidgetManifest) => WidgetPlacementUtils.areDisjoint(widget, potential))
                  .reduce((a: boolean, b: boolean) => a && b, true)
              ) {
                wManifest.widgets.push(potential);
                added = true;
                break;
              }
            }
          }
        }
        return wManifest;
      })
    );
    this.nonFillerWidgets$ = this.windowManifest$.pipe(
      map((wManifest) => wManifest.widgets.filter((w) => w.type !== 'filler').length)
    );

    this.subscriptions.add(
      this.staticDashboard$.subscribe((manifest) => {
        if (!!manifest) {
          const getDataActions = (
            (
              [
                ...new Set(
                  (manifest.widgets ?? ([] as WidgetManifest[]))
                    .reduce((p, c) => [...p, c], [] as WidgetManifest[])
                    .map((widManifest) => widManifest.datasource)
                )
              ] as (string | string[])[]
            ).reduce((p, c) => [...p, ...(Array.isArray(c) ? c : [c])], []) as string[]
          ).map((resultSet) => DashboardActions.assertResultSets({ id: resultSet }));

          getDataActions.forEach((action) => this.store.dispatch(action));
        }
      })
    );

    this.store.dispatch(FieldActions.load());
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(CategoryActions.load());
    this.store.dispatch(ConfigActions.getMapStyles());
    this.store.dispatch(DataSourceActions.load());
    this.store.dispatch(RelationTypesActions.load());
    this.store.dispatch(ConfigActions.loadCustomization());

    this.subscriptions.add(
      fromEvent(window, 'resize')
        .pipe(auditTime(100))
        .subscribe(() => {
          this.calculateView();
        })
    );

    this.subscriptions.add(
      combineLatest([this.windowManifest$, this.modeEdition$])
        .pipe(auditTime(100))
        .subscribe(() => {
          this.calculateView();
        })
    );

    this.subscriptions.add(
      fromEvent(window, 'keydown')
        .pipe(
          map(($event: Event) => $event as KeyboardEvent),
          filter(($event: KeyboardEvent) => $event.key === 'L' && $event.ctrlKey && $event.shiftKey)
        )
        .subscribe(() => this.store.dispatch(DashboardActions.toggleEditionMode({})))
    );

    this.subscriptions.add(
      fromEvent(window, 'mouseup').subscribe(() => {
        this.clearActions();
      })
    );

    this.subscriptions.add(
      this.store.select(ConfigSelectors.breakpoint).subscribe((bp) => {
        this.breakpoint = bp;
      })
    );

    this.subscriptions.add(
      this.windowManifest$.subscribe((manifest) => {
        this.manifest = manifest;
      })
    );

    this.subscriptions.add(
      this.store.select(DashboardSelectors.gridLayout).subscribe((layout) => {
        this.layout = layout;
      })
    );

    this.gridTemplateRows$ = combineLatest([this.windowManifest$, this.stacked$]).pipe(
      map(([manifest, stacked]) =>
        this.generateRows(
          stacked && this.manifest
            ? this.manifest?.widgets.map((wm) => wm.layout.height).reduce((wm1, wm2) => wm1 + wm2, 0)
            : manifest.grid?.rows ?? DEFAULT_ROWS_NUMBER
        )
      )
    );

    this.gridTemplateColumns$ = combineLatest([this.windowManifest$, this.stacked$]).pipe(
      map(([manifest, stacked]) => this.generateColumns(stacked ? 1 : manifest.grid?.columns || DEFAULT_COLUMNS_NUMBER))
    );

    this.backgroundArea$ = combineLatest([this.windowManifest$, this.stacked$]).pipe(
      map(([manifest, stacked]) =>
        !stacked
          ? `3/3/${(manifest.grid?.rows ?? DEFAULT_ROWS_NUMBER) - 1}/${
              (manifest.grid?.columns ?? DEFAULT_COLUMNS_NUMBER) - 1
            }`
          : `3/1/${(manifest.grid?.columns ?? DEFAULT_COLUMNS_NUMBER) - 1}/1`
      )
    );

    this.separators$ = this.store
      .select(DashboardSelectors.gridLayout)
      .pipe(
        map((layout) =>
          layout === DashboardGridLayout.MANUAL
            ? []
            : WidgetPlacementUtils.getLayoutSize(layout, { rows: 1, columns: 1 })
        )
      );
  }

  ngOnInit() {
    if (this.displayOptions)
      this.store.dispatch(
        DashboardActions.updateDisplayOptions({ mode: DisplayMode.CUSTOM, customDisplay: this.displayOptions })
      );
  }

  ngAfterViewInit() {
    this.canCalculateView = true;
  }

  /***
   * Manage display
   */

  calculateView() {
    if (this.canCalculateView) {
      let element = this.gridRef.nativeElement;
      while (element.getBoundingClientRect().height === 0 && !!element.parentElement) {
        element = element.parentElement;
      }

      const gridWidth = (<HTMLElement>element).getBoundingClientRect().width;
      const mobileMode = gridWidth < this.breakpoint;
      this.stacked$.next(this.dashboardParams.mobileMode && !this.modeEdition);
      const rows = !this.displayIsStacked
        ? (!!this.manifest && !!this.manifest.grid && this.manifest.grid.rows) || DEFAULT_ROWS_NUMBER
        : this.manifest?.widgets.reduce((p: number, c: WidgetManifest) => p + c.layout.height, 0) ?? 1;

      const params = {
        gridWidth,
        // Calculate height to parennt the parent's
        gridHeight: element.getBoundingClientRect().height,
        gridGap: 1,
        columns: (!!this.manifest && !!this.manifest.grid && this.manifest.grid.columns) || DEFAULT_COLUMNS_NUMBER,
        cellHeight: 1,
        rows,
        cellWidth: 0,
        offsetLeft: this.gridRef.nativeElement.offsetLeft,
        offsetTop: this.gridRef.nativeElement.offsetTop,
        mobileMode
      };
      params.gridGap =
        params.rows * params.cellHeight < params.gridHeight
          ? !!this.manifest && !!this.manifest.grid
            ? this.manifest.grid.gap || DEFAULT_GAP_PX
            : DEFAULT_GAP_PX
          : 0;
      params.cellHeight = (params.gridHeight - (params.rows - 1) * params.gridGap) / params.rows;
      params.cellWidth = (params.gridWidth - (params.columns - 1) * params.gridGap) / params.columns;

      this.store.dispatch(DashboardActions.updateDashboardParams({ params }));

      this.rows.next(params.rows);
      this.rowHeight.next(params.cellHeight);
    }
  }

  get displayIsStacked() {
    return this.stacked$.getValue();
  }

  gridColumn(layout: WidgetLayout): string {
    if (this.displayIsStacked || !layout) {
      return '1 / 1';
    }
    if (layout.width > 1) {
      return `${Math.min(layout.x, this.dashboardParams.columns - layout.width + 1)} / ${Math.min(
        layout.x + layout.width,
        this.dashboardParams.columns + 1
      )}`;
    } else {
      return `${layout.x}`;
    }
  }

  gridRow(layout: WidgetLayout): string {
    if (!layout) {
      return '1';
    }
    if (this.displayIsStacked) {
      const previousHeight = this.manifest?.widgets
        .filter((wm: WidgetManifest) => (wm.layout.y === layout.y && wm.layout.x < layout.x) || wm.layout.y < layout.y)
        .reduce((p: number, c: WidgetManifest) => p + c.layout.height, 1);
      return `${previousHeight ?? 1} / ${(previousHeight ?? 1) + layout.height}`;
    }
    if (layout.height > 1) {
      return `${Math.max(1, Math.min(layout.y, this.dashboardParams.rows - layout.height + 1))} / ${Math.min(
        layout.y + layout.height,
        this.dashboardParams.rows + 1
      )}`;
    } else {
      return `${layout.y}`;
    }
  }

  generateRows(rows: number): string {
    return Array(rows).fill('1fr').join(' ');
  }

  generateColumns(columns: number): string {
    return Array(columns).fill('1fr').join(' ');
  }

  /***
   * Direct actions on widgets
   */

  remove(i: number) {
    const listWidgetManifests = [...(this.manifest || { widgets: [] }).widgets];
    listWidgetManifests.splice(i, 1).filter((widget) => widget.type !== 'filler');

    this.store.dispatch(
      DashboardActions.updateDashboardManifest({
        manifest: {
          ...this.manifest,
          widgets: listWidgetManifests
        }
      })
    );
  }

  moveInNewWindow(widgetIndex: number, targetIndex: number) {
    this.store.dispatch(DashboardActions.moveWidget({ widgetIndex, targetIndex }));
    this.store.dispatch(DashboardActions.toggleEditionMode({ force: false }));
  }

  maximize(widgetIndex: number) {
    this.store.dispatch(DashboardActions.maximizeWidget({ widgetIndex }));
  }

  /***
   * Manage drag n drop, move, resize
   */

  prepareModification($event: MouseEvent, indexManifest: number) {
    this.move.initialX = $event.clientX;
    this.move.initialY = $event.clientY;
    this.initialWidgetManifestList = JSON.parse(JSON.stringify((this.manifest || { widgets: [] }).widgets));
    this.currentlyModifiedManifest = this.initialWidgetManifestList.splice(indexManifest, 1)[0];
    // console.log('prepare', this.currentlyModifiedManifest, this.initialWidgetManifestList);
  }

  startResize($event: MouseEvent, indexManifest: number, direction: string) {
    this.actionType = direction;
    this.prepareModification($event, indexManifest);
    // console.log('start resize', this.currentlyModifiedManifest, this.initialWidgetManifestList);
  }

  dragStart($event: DragEvent, indexManifest: number) {
    this.actionType = 'move';
    this.prepareModification($event, indexManifest);
    DashboardComponent.addTransferManifestMetadata($event, this.currentlyModifiedManifest ?? ({} as WidgetManifest));
    // console.log('start move', this.currentlyModifiedManifest, this.initialWidgetManifestList);
  }

  private static addTransferManifestMetadata($event: DragEvent, manifest: WidgetManifest) {
    if (!!$event && !!$event.dataTransfer && !$event.dataTransfer.types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
      $event.dataTransfer.setData(MIME_TYPE_WIDGET_MANIFEST, JSON.stringify(manifest));
      $event.dataTransfer.setData(MIME_TYPE_WIDGET_TYPE + manifest.type, 'unused');
      // Passing widget size as a mime type, so that we can bypass security for placeholder size at the arrival of the drag
      $event.dataTransfer.setData(
        MIME_TYPE_WIDGET_SIZE + `${manifest.layout.width}-${manifest.layout.height}`,
        'useless' // data is in the mime type
      );
    }
  }

  dragEnter($event: DragEvent, force: boolean = false) {
    $event.stopPropagation();
    $event.preventDefault();

    const types = ($event.dataTransfer || { types: [''] }).types;

    if (types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
      this.store.dispatch(DashboardActions.toggleEditionMode({ force: true }));
      this.actionType = 'move';
    }
  }

  checkForDragEnter($event: MouseEvent) {
    if (!this.currentlyModifiedManifest) {
      // create placeholder as a drag entered the component, go into edition mode and move action if it's a widget being dragged
      const types = (($event as DragEvent).dataTransfer || { types: [''] }).types;
      if (types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
        this.actionType = 'move';
        this.store.dispatch(DashboardActions.toggleEditionMode({ force: true }));

        // On drag enter, we only can put a placeholder, since for security reasons, the content of the data-transfer is not available
        this.move.initialX = this.dashboardParams.offsetLeft;
        this.move.initialY = this.dashboardParams.offsetTop;
        const target = this.getTarget($event, false);
        this.currentlyModifiedManifest = {
          type: 'placeholder',
          layout: { x: target?.x ?? 0, y: target?.y ?? 0, width: 1, height: 1 }
        };
        this.initialWidgetManifestList = JSON.parse(JSON.stringify((this.manifest || { widgets: [] }).widgets));
        // console.log('create placeholder', this.currentlyModifiedManifest, this.initialWidgetManifestList);

        // We passed widget size as a mimetype so that we can still read it without security issues
        const widgetSizeMimeType = types.find((type) => type.includes(MIME_TYPE_WIDGET_SIZE));
        if (!!widgetSizeMimeType) {
          const [_, _2, w, h] = widgetSizeMimeType.split('-');
          this.currentlyModifiedManifest.layout.width = parseInt(w, 10);
          this.currentlyModifiedManifest.layout.height = parseInt(h, 10);
        } else {
          // Use grid size
          const layout = WidgetPlacementUtils.getLayoutSize(this.layout, this.dashboardParams)[
            this.initialWidgetManifestList.length
          ];
          this.currentlyModifiedManifest.layout.width = layout.width;
          this.currentlyModifiedManifest.layout.height = layout.height;
        }

        // We passed the type as a header name so that we can still access it without security issues
        const widgetType = types.find((type) => type.includes(MIME_TYPE_WIDGET_TYPE));
        if (!!widgetType) {
          const [_, _2, type] = widgetType.split('-');
          this.currentlyModifiedManifest.type = type;
        }

        // Reset initial position for the one we just calculated, so we can continue properly move the widget
        this.move.initialX = $event.pageX;
        this.move.initialY = $event.pageY;
      }
    }
  }

  getTarget($event: MouseEvent, optimize = true) {
    const dX = $event.pageX - this.move.initialX;
    const dY = $event.pageY - this.move.initialY;

    const target = {
      x:
        dX === 0
          ? 0
          : Math.round(
              ((dX / Math.abs(dX)) * (Math.abs(dX) - 0.5 * this.dashboardParams.cellWidth)) /
                (this.dashboardParams.cellWidth + this.dashboardParams.gridGap)
            ),
      y:
        dY === 0
          ? 0
          : Math.round(
              ((dY / Math.abs(dY)) * (Math.abs(dY) - 0.5 * this.dashboardParams.cellHeight)) /
                (this.dashboardParams.cellHeight + this.dashboardParams.gridGap)
            )
    };

    if (!optimize || target.x !== this.move.previousX || target.y !== this.move.previousY) {
      this.move.previousX = target.x;
      this.move.previousY = target.y;
      return target;
    }

    return null;
  }

  movingMouse($event: MouseEvent, optimize = true) {
    if (this.modeEdition && !!this.actionType) {
      const target = this.getTarget($event, optimize);
      if (target !== null) {
        this.checkForDragEnter($event);
        const candidateWidget = JSON.parse(JSON.stringify(this.currentlyModifiedManifest));

        switch (this.actionType) {
          case 'resize-nw':
            if (candidateWidget.layout.x + target.x > 0 && candidateWidget.layout.height - target.y > 0) {
              candidateWidget.layout.x += target.x;
              candidateWidget.layout.y += target.y;
              candidateWidget.layout.width -= target.x;
              candidateWidget.layout.height -= target.y;
            }
            break;
          case 'resize-sw':
            if (candidateWidget.layout.width - target.x > 0) {
              candidateWidget.layout.x += target.x;
              candidateWidget.layout.width -= target.x;
              candidateWidget.layout.height += target.y;
            }
            break;
          case 'resize-ne':
            if (candidateWidget.layout.height - target.y > 0) {
              candidateWidget.layout.y += target.y;
              candidateWidget.layout.width += target.x;
              candidateWidget.layout.height -= target.y;
            }
            break;
          case 'resize-se':
            candidateWidget.layout.width += target.x;
            candidateWidget.layout.height += target.y;
            break;
          case 'move':
            const currentMaxX =
              Math.max(
                this.manifest?.grid?.columns ?? DEFAULT_COLUMNS_NUMBER,
                ...(this.manifest?.widgets ?? []).map((w) => w.layout.width + w.layout.x)
              ) -
              candidateWidget.layout.width +
              1;
            candidateWidget.layout.x = Math.max(0, Math.min(candidateWidget.layout.x + target.x, currentMaxX));

            const currentMaxY =
              Math.max(
                this.manifest?.grid?.rows ?? DEFAULT_ROWS_NUMBER,
                ...(this.manifest?.widgets ?? []).map((w) => w.layout.height + w.layout.y)
              ) -
              candidateWidget.layout.height +
              1;
            candidateWidget.layout.y = Math.max(0, Math.min(candidateWidget.layout.y + target.y, currentMaxY));
            break;
        }

        this.store.dispatch(
          DashboardActions.updateDashboardManifest({
            manifest: solveCollisions(
              candidateWidget,
              this.initialWidgetManifestList,
              this.manifest ?? ({} as DashboardManifest)
            )
          })
        );
      }
    }
  }

  dragMove($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    this.movingMouse($event);
  }

  dragLeave($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    // @ts-ignore
    if ($event.currentTarget.contains($event.relatedTarget)) {
      return;
    }

    const types = ($event.dataTransfer || { types: [''] }).types;
    if (types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
      // As the drag is leaving the window, delete the widget from it, and stop edition mode
      if (!!$event && !!$event.dataTransfer) {
        this.store.dispatch(
          DashboardActions.updateDashboardManifest({
            manifest: {
              ...this.manifest,
              widgets: this.initialWidgetManifestList
            }
          })
        );
        this.clearActions();
      }
    }
  }

  dropping($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    // @ts-ignore
    if (!!$event && !!$event.dataTransfer) {
      if ($event.dataTransfer.types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
        // Rearrange drop to correct size, type, ..., as a placeholder already been added to manifest by dragenter event
        const dataTransferManifest = JSON.parse(
          $event.dataTransfer.getData(MIME_TYPE_WIDGET_MANIFEST)
        ) as WidgetManifest;

        this.currentlyModifiedManifest = {
          ...dataTransferManifest,
          layout: this.currentlyModifiedManifest?.layout ?? ({} as WidgetLayout)
        };

        this.movingMouse($event, false);

        this.store.dispatch(DashboardActions.assertResultSets({}));
      }

      this.clearActions();
    }
  }

  clearActions() {
    this.actionType = undefined;
    this.move.initialX = 0;
    this.move.initialY = 0;
    this.move.previousX = -1;
    this.move.previousY = -1;
    this.currentlyModifiedManifest = null;
    this.initialWidgetManifestList = [];
  }

  /***
   * Manage other kinds of drops (inside widgets)
   */
  droppingInWidget($event: DragEvent, index: number) {
    if (!!$event && !!$event.dataTransfer) {
      if ($event.dataTransfer.types.includes(MIME_TYPE_RESULTSET)) {
        const listWidgetManifests = [...(this.manifest || { widgets: [] }).widgets];

        const resultSetName = $event.dataTransfer.getData(MIME_TYPE_RESULTSET);
        const currentResultSet = (
          Array.isArray(listWidgetManifests[index].datasource)
            ? listWidgetManifests[index].datasource
            : [listWidgetManifests[index].datasource]
        ) as string[];
        const cumulative = $event.shiftKey;
        const newResultSet = cumulative ? [...currentResultSet, resultSetName] : resultSetName;

        listWidgetManifests[index] = {
          ...listWidgetManifests[index],
          datasource: newResultSet
        };

        this.store.dispatch(
          DashboardActions.updateDashboardManifest({
            manifest: {
              ...this.manifest,
              widgets: listWidgetManifests
            }
          })
        );
        this.store.dispatch(DashboardActions.assertResultSets({}));
        $event.preventDefault();
        $event.stopPropagation();
      }
    }
  }

  toggleRemoveConfirm($event?: MouseEvent, index?: number) {
    if (!this.confirmRemoveRef) {
      this.indexForRemoval = index ?? -1;
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
    } else {
      this.confirmRemoveRef.dispose();
      this.confirmRemoveRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
    }
  }

  confirmRemove() {
    this.remove(this.indexForRemoval);
    this.cancelRemoveConfirm();
  }

  cancelRemoveConfirm() {
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
  }

  trackWidgets(index: number, widgetManifest: WidgetManifest) {
    return widgetManifest.type + '-' + widgetManifest.datasource;
  }

  updateInstance(widgetIndex: number, $event: BaseWidgetComponent) {
    this.widgetsInstances[widgetIndex] = $event;
  }
}
