import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardGridLayout, DashboardSelectors, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { ACTIONS, ToolboxAction } from '../toolbox.model';

@Component({
  selector: 'pry-toolbox',
  templateUrl: './toolbox.component.html'
})
export class ToolboxComponent implements OnInit {
  actions$ = new BehaviorSubject<ToolboxAction[]>(ACTIONS);
  _dropdownActions$ = new BehaviorSubject<{ name: string; order: number }[]>([]);
  @Input() displayLabels = true;
  hasInitialPresentation$: Observable<boolean>;
  isManualMode$: Observable<boolean>;
  allActions$!: Observable<ToolboxAction[]>;
  mainActions$!: Observable<ToolboxAction[]>;
  dropdownActions$!: Observable<ToolboxAction[]>;
  showDropdownButton$!: Observable<boolean>;
  isDropdownOpen = false;

  @Input() set actions(actions: ToolboxAction[]) {
    this.actions$.next(actions);
  }

  @Input() set dropdownActions(dropdownActions: { name: string; order: number }[]) {
    this._dropdownActions$.next(dropdownActions);
  }

  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) private role: PryBaseAccess) {
    this.hasInitialPresentation$ = store.select(DashboardSelectors.presentation).pipe(map((pres) => !!pres.initial));
    this.isManualMode$ = store
      .select(DashboardSelectors.windowManifest)
      .pipe(map((pres) => (pres.grid?.layout ?? DashboardGridLayout.MANUAL) === DashboardGridLayout.MANUAL));
  }

  ngOnInit() {
    this.allActions$ = combineLatest([this.actions$, this.hasInitialPresentation$]).pipe(
      tap((v) => console.log(v)),
      switchMap(([actions, hasInitialPresentation]) =>
        combineLatest(
          actions.map((action) =>
            this.role
              ? this.role.hasRole(null, action.access.module, action.access.page, action.access.action).pipe(
                  map(
                    (hasRole) =>
                      ({
                        ...action,
                        visible:
                          action.visible &&
                          (action.name !== 'save_view' || hasInitialPresentation) &&
                          (!this.role || hasRole)
                      } as ToolboxAction)
                  )
                )
              : of({
                  ...action,
                  visible: action.visible && (action.name !== 'save_view' || hasInitialPresentation)
                } as ToolboxAction)
          )
        )
      ),
      tap((v) => console.log(v))
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
