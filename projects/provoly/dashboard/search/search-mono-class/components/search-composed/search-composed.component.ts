import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Attribute, ConditionType, NormalizedCondition } from '@provoly/dashboard';
import { Observable, of } from 'rxjs';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

@Component({
  selector: 'pry-search-composed',
  templateUrl: './search-composed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrySearchComposedComponent {
  @HostBinding('class') class = 'o-pry-search-composed-wrapper';
  @HostBinding('class.is-hover') hover = false;
  masterId$: Observable<string | null>;

  @HostListener('mouseover', ['$event'])
  onMouseOver(evt: any) {
    evt.stopPropagation();
    this.hover = true;
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(evt: any) {
    evt.stopPropagation();
    this.hover = false;
  }

  @Input() set id(val: string) {
    this._id = val;
    this.condition$ = this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsById(this._id));
  }

  private _id!: string;
  condition$: Observable<NormalizedCondition | null> = of(null);

  panelNewAttributeOpen = false;

  constructor(
    private store: Store<any>,
    private _change: ChangeDetectorRef
  ) {
    this.masterId$ = this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsMasterId);
  }

  onAddNestedCondition(conditionId: string): void {
    this.store.dispatch(SearchMonoClassActions.addNormalizedConditionComposedForConditionId({ conditionId }));
  }

  onSelectType(conditionId: string, conditionType: ConditionType): void {
    this.store.dispatch(
      SearchMonoClassActions.updateNormalizedConditionTypeForConditionId({ conditionId, conditionType })
    );
  }

  onOpenPanel() {
    this.panelNewAttributeOpen = true;
    this._change.markForCheck();
  }

  onClosePanel() {
    if (this.panelNewAttributeOpen) {
      this.panelNewAttributeOpen = false;
      this._change.markForCheck();
    }
  }

  onAddAttributeCondition(attribute: Attribute, conditionId: string): void {
    this.store.dispatch(
      SearchMonoClassActions.addNormalizedConditionAttributeForConditionId({ conditionId, attribute })
    );
    this.onClosePanel();
  }

  onDeleteNestedCondition(conditionId: string): void {
    this.store.dispatch(SearchMonoClassActions.deleteNormalizedConditionById({ conditionId }));
  }
}
