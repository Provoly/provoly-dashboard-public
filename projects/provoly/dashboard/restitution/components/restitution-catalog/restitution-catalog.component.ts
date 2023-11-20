import { Overlay } from '@angular/cdk/overlay';
import { Component, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions, ConfigSelectors, PryVisibilityType, ViewMode, Widget } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-restitution-catalog',
  templateUrl: './restitution-catalog.component.html'
})
export class PryRestitutionCatalogComponent {
  restitutions$: Observable<Widget[]>;
  search$ = new BehaviorSubject('');
  filteredRestitution$: Observable<Widget[]>;
  selectedItem?: Element | null;
  mode = ViewMode;
  selectedMode: ViewMode = ViewMode.CATALOG;
  selectedRestitution: Widget | null = null;
  restitution?: Widget;
  PryVisibilityType = PryVisibilityType;

  constructor(private store: Store, protected overlay: Overlay, protected viewContainerRef: ViewContainerRef) {
    this.store.dispatch(ConfigActions.loadWidgets());
    this.store.dispatch(ConfigActions.getMapStyles());

    this.restitutions$ = this.store
      .select(ConfigSelectors.catalog)
      .pipe(
        map((restitutionList) =>
          [...restitutionList].sort((a, b) =>
            a.modificationDate ? b.modificationDate.localeCompare(a.modificationDate) : 1
          )
        )
      );
    this.filteredRestitution$ = combineLatest([this.restitutions$, this.search$]).pipe(
      map(([restitutions, search]) =>
        restitutions.filter(
          (restitution) => search.length === 0 || restitution.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }

  selectMode(newMode: ViewMode) {
    this.selectedMode = newMode;
  }

  selectRestitution(restitution: Widget) {
    this.selectedRestitution = restitution;
    this.selectMode(this.mode.CONSULT);
    this.search$.next('');
  }

  closeRestitution($event: void) {
    this.selectedRestitution = null;
    this.selectMode(this.mode.CATALOG);
  }

  deleteRestitution(id: string) {
    this.store.dispatch(ConfigActions.confirmRestitutionDeletion({ id }));
  }

  editRestitution(restitution: Widget) {
    this.selectedRestitution = restitution;
    this.selectMode(ViewMode.EDITION);
    this.search$.next('');
  }

  focusElement(element: HTMLButtonElement) {
    element.focus();
  }
}
