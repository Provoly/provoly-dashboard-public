import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardGridLayout,
  DashboardSelectors,
  DisplayOptions,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryBaseAccess
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ACTIONS, ToolboxAction } from '../toolbox.model';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'pry-toolbox',
  templateUrl: './toolbox.component.html'
})
export class ToolboxComponent implements OnInit {
  actions$ = new BehaviorSubject<ToolboxAction[]>(ACTIONS);
  _dropdownActions$ = new BehaviorSubject<{ name: string; order: number }[]>([]);
  @Input() displayLabels = true;
  @Input() dropdownPosition: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top'
    }
  ];
  isManualMode$: Observable<boolean>;
  canModify$: Observable<boolean>;
  allActions$!: Observable<ToolboxAction[]>;
  mainActions$!: Observable<ToolboxAction[]>;
  dropdownActions$!: Observable<ToolboxAction[]>;
  showDropdownButton$!: Observable<boolean>;
  isDropdownOpen = false;
  actionsAvailable$: Observable<DisplayOptions | undefined>;
  showEditToggle$: Observable<boolean>;
  private currentManifest$: Observable<ManifestDescription | undefined>;

  @Input() set actions(actions: ToolboxAction[]) {
    this.actions$.next(actions);
  }

  @Input() set dropdownActions(dropdownActions: { name: string; order: number }[]) {
    this._dropdownActions$.next(dropdownActions);
  }

  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) private access: PryBaseAccess
  ) {
    this.currentManifest$ = store
      .select(DashboardSelectors.presentation)
      .pipe(map((presentation) => presentation?.current));
    this.isManualMode$ = combineLatest([
      store.select(DashboardSelectors.staticManifest),
      store.select(DashboardSelectors.gridLayout)
    ]).pipe(
      map(
        ([staticManifest, gridLayout]) =>
          (staticManifest.windows[0]?.grid?.layout !== undefined
            ? staticManifest.windows[0]?.grid?.layout
            : gridLayout) === DashboardGridLayout.MANUAL
      )
    );
    this.actionsAvailable$ = store.select(DashboardSelectors.displayOptions);
    this.showEditToggle$ = this.actionsAvailable$.pipe(map((actions) => !!actions?.edit_toggle));
    this.canModify$ = this.currentManifest$.pipe(
      switchMap((manifest) => {
        return manifest ? this.access?.canModifyPresentation(manifest) : of(false);
      })
    );
  }

  ngOnInit() {
    this.allActions$ = combineLatest([this.actions$, this.actionsAvailable$, this.canModify$]).pipe(
      withLatestFrom(this.currentManifest$),
      switchMap(([[actions, displayOptions, _canModify], currentManifest]) =>
        combineLatest(
          actions.map((action) => {
            // @ts-ignore
            const actionAvailable =
              this.isActionVisible(action, currentManifest) &&
              displayOptions?.toolbox[action.name as keyof typeof displayOptions.toolbox];
            const canModify = !action.needsOwner || _canModify;
            return this.access
              ? this.access.hasRole(null, action.access.module, action.access.page, action.access.action).pipe(
                  map(
                    (hasRole) =>
                      ({
                        ...action,
                        visible: actionAvailable && (!this.access || hasRole) && canModify
                      }) as ToolboxAction
                  )
                )
              : of({
                  ...action,
                  visible: actionAvailable && canModify
                } as ToolboxAction);
          })
        )
      )
    );
    this.mainActions$ = combineLatest([this._dropdownActions$, this.allActions$]).pipe(
      map(([dropdownActions, actions]) =>
        actions.filter((action) => !dropdownActions.find((dropdownAction) => action.name === dropdownAction.name))
      )
    );
    this.dropdownActions$ = combineLatest([this._dropdownActions$, this.allActions$]).pipe(
      map(([dropdownActions, actions]) =>
        actions.filter((action) => !!dropdownActions.find((dropdownAction) => action.name === dropdownAction.name))
      )
    );

    this.showDropdownButton$ = this.dropdownActions$.pipe(
      map((actions) => actions.filter((action) => action.visible).length > 0)
    );
  }

  openDropdown($event: Event) {
    this.isDropdownOpen = true;
    $event.stopPropagation();
  }

  closeDropdown($event: Event | void) {
    this.isDropdownOpen = false;
    if ($event) $event.stopPropagation();
  }

  getOrder(actionName: string) {
    return this._dropdownActions$.getValue().find((action) => actionName === action.name)?.order;
  }

  isActionVisible(action: ToolboxAction, manifest: ManifestDescription | undefined): boolean {
    return manifest && action.name === 'dashboard_details' ? !!manifest.additionalInformation : action.visible;
  }
}
