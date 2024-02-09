import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardGridLayout,
  DashboardSelectors,
  DisplayOptions,
  GlobalManifest,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ACTIONS, ToolboxAction } from '../toolbox.model';
import { ConnectedPosition } from '@angular/cdk/overlay';

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
  allActions$!: Observable<ToolboxAction[]>;
  mainActions$!: Observable<ToolboxAction[]>;
  dropdownActions$!: Observable<ToolboxAction[]>;
  showDropdownButton$!: Observable<boolean>;
  isDropdownOpen = false;
  actionsAvailable$: Observable<DisplayOptions | undefined>;
  showEditToggle$: Observable<boolean>;
  private presentation$: Observable<
    | {
        current: ManifestDescription | undefined;
        viewMode?: ViewMode;
        initial: GlobalManifest | undefined;
      }
    | undefined
  >;

  @Input() set actions(actions: ToolboxAction[]) {
    this.actions$.next(actions);
  }

  @Input() set dropdownActions(dropdownActions: { name: string; order: number }[]) {
    this._dropdownActions$.next(dropdownActions);
  }

  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) private role: PryBaseAccess) {
    this.presentation$ = store.select(DashboardSelectors.presentation);
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
  }

  ngOnInit() {
    this.allActions$ = combineLatest([
      this.actions$,
      this.actionsAvailable$,
      this.presentation$.pipe(map((pres) => pres?.current?.owner ?? false))
    ]).pipe(
      switchMap(([actions, displayOptions, isOwner]) =>
        combineLatest(
          actions.map((action) => {
            // @ts-ignore
            const actionAvailable = action.visible && displayOptions.toolbox[action.name];
            const restraintOwner = !action.needsOwner || isOwner;
            return this.role
              ? this.role.hasRole(null, action.access.module, action.access.page, action.access.action).pipe(
                  map(
                    (hasRole) =>
                      ({
                        ...action,
                        visible: actionAvailable && (!this.role || hasRole) && restraintOwner
                      } as ToolboxAction)
                  )
                )
              : of({
                  ...action,
                  visible: actionAvailable && restraintOwner
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
}
