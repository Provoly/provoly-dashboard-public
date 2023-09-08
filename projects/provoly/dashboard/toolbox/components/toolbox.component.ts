import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardGridLayout, DashboardSelectors } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
import { ACTIONS, ToolboxAction } from '../toolbox.model';

@Component({
  selector: 'pry-toolbox',
  templateUrl: './toolbox.component.html'
})
export class ToolboxComponent implements OnInit {
  @Input() actions: ToolboxAction[] = ACTIONS;
  @Input() dropdownActions: { name: string; order: number }[] = [];
  @Input() displayLabels = true;
  hasInitialPresentation$: Observable<boolean>;
  isManualMode$: Observable<boolean>;
  allActions$!: Observable<ToolboxAction[]>;
  mainActions$!: Observable<ToolboxAction[]>;
  dropdownActions$!: Observable<ToolboxAction[]>;
  showDropdownButton$!: Observable<boolean>;
  isDropdownOpen = false;

  constructor(store: Store) {
    this.hasInitialPresentation$ = store.select(DashboardSelectors.presentation).pipe(map((pres) => !!pres.initial));
    this.isManualMode$ = store
      .select(DashboardSelectors.windowManifest)
      .pipe(map((pres) => (pres.grid?.layout ?? DashboardGridLayout.MANUAL) === DashboardGridLayout.MANUAL));
  }

  ngOnInit() {
    this.allActions$ = this.hasInitialPresentation$.pipe(
      map((hasInitialPresentation) => {
        return this.actions.map((action) => {
          if (action.name === 'save_view') {
            action = { ...action, visible: hasInitialPresentation };
          }
          return action;
        });
      })
    );
    this.mainActions$ = this.allActions$.pipe(
      map((actions) =>
        actions.filter((action) => !this.dropdownActions.find((dropdownAction) => action.name === dropdownAction.name))
      )
    );
    this.dropdownActions$ = this.allActions$.pipe(
      map((actions) =>
        actions.filter((action) => !!this.dropdownActions.find((dropdownAction) => action.name === dropdownAction.name))
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
    return this.dropdownActions.find((action) => actionName === action.name)?.order;
  }
}
