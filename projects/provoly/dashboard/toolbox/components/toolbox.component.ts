import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardGridLayout, DashboardSelectors } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
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

  constructor(store: Store) {
    this.hasInitialPresentation$ = store.select(DashboardSelectors.presentation).pipe(map((pres) => !!pres.initial));
    this.isManualMode$ = store
      .select(DashboardSelectors.windowManifest)
      .pipe(map((pres) => (pres.grid?.layout ?? DashboardGridLayout.MANUAL) === DashboardGridLayout.MANUAL));
  }

  ngOnInit() {
    this.allActions$ = combineLatest([this.actions$, this.hasInitialPresentation$]).pipe(
      map(([actions, hasInitialPresentation]) => {
        return actions.map((action) => {
          if (action.name === 'save_view') {
            action = { ...action, visible: action.visible && hasInitialPresentation };
          }
          return action;
        });
      })
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
      map((actions) => actions.length > 0 && actions.filter((action) => action.visible).length > 0)
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
