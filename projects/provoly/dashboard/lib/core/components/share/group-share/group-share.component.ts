import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Group, PryVisibilityType } from '../share.model';
import { BehaviorSubject, map, Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { ConfigActions } from '../../../store/config/config.actions';
import { SubscriptionnerDirective } from '../../../../dashboard/components/subscriptionner.directive';

@Component({
  selector: 'pry-group-share',
  templateUrl: './group-share.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryGroupShareComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryGroupShareComponent extends SubscriptionnerDirective implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;

  radioValue = PryVisibilityType.PRIVATE;
  groups$: Observable<Group[]>;
  assignedGroups$: Observable<Group[]>;
  PryVisibilityType = PryVisibilityType;
  visibilityTypes: { label: string; value: PryVisibilityType }[] = [];
  assignedGroupNames$ = new BehaviorSubject<string[]>([]);

  constructor(private store: Store, private _cd: ChangeDetectorRef) {
    super();
    this.store.dispatch(ConfigActions.loadAccessGroups());
    this.groups$ = this.store
      .select(ConfigSelectors.accessGroups)
      .pipe(map((groups) => groups.filter((group) => group.name !== 'ALL')));
    this.assignedGroups$ = combineLatest([this.groups$, this.assignedGroupNames$]).pipe(
      map(
        ([groups, groupNames]) =>
          groups.filter((group) => {
            return groupNames.includes(group.name);
          }) ?? []
      )
    );
    this.visibilityTypes = Object.keys(PryVisibilityType).map((label) => ({
      label: label.toLowerCase(),
      value: PryVisibilityType[<keyof typeof PryVisibilityType>label]
    }));
  }

  writeValue(value: string[] | undefined) {
    this.assignedGroupNames$.next(value ?? []);
    this.updateRadioValue(value ?? []);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._cd.markForCheck();
  }

  updateRadioValue(groups: string[]) {
    if (groups.length === 0) {
      this.radioValue = PryVisibilityType.PRIVATE;
    } else if (groups.length === 1 && groups.find((group) => group === 'ALL')) {
      this.radioValue = PryVisibilityType.PUBLIC;
    } else {
      this.radioValue = PryVisibilityType.RESTRICTED;
    }
  }

  changeGroupsBasedOnRadioValue(type: PryVisibilityType): void {
    if (this.radioValue !== type) {
      this.radioValue = type;

      switch (type) {
        case PryVisibilityType.PRIVATE:
          this.changeGroups([]);
          break;
        case PryVisibilityType.RESTRICTED:
          this.changeGroups(this.assignedGroupNames$.getValue() ?? []);
          break;
        case PryVisibilityType.PUBLIC:
          this.changeGroups(['ALL']);
          break;
      }
    }
  }

  changeGroups(groups: (Group | string)[] | null) {
    if (groups) {
      this._onChange(this.assignedGroupNames$.getValue());
      this._onTouched();
      this._cd.markForCheck();
    }
  }
}
