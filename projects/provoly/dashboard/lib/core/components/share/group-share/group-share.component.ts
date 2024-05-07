import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Group, PryVisibilityType } from '../share.model';
import { BehaviorSubject, map, Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { ConfigActions } from '../../../store/config/config.actions';
import { SubscriptionnerDirective } from '../../../../dashboard/components/subscriptionner.directive';
import equal from 'fast-deep-equal/es6';
import { AUTHENTICATED_USERS_GROUP, PUBLIC_GROUP } from '../share.utils';

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
  private _onChange = (groups: string[]) => groups;
  private _onTouched = () => {};

  // for tracking input
  assignedGroupNames$ = new BehaviorSubject<string[]>([]);

  radioValue = PryVisibilityType.PRIVATE;
  assignedGroups$: Observable<Group[]>;
  groups$: Observable<Group[]>;
  PryVisibilityType = PryVisibilityType;
  visibilityTypes: { label: string; value: PryVisibilityType }[] = [];
  templateData$: Observable<{
    groups: Group[];
    assignedGroups: Group[];
    disableRadios: { [key in PryVisibilityType]: boolean };
  }>;

  _disableRadios$: BehaviorSubject<{ [key in PryVisibilityType]: boolean }> = new BehaviorSubject<{
    [key in PryVisibilityType]: boolean;
  }>({
    [PryVisibilityType.PRIVATE]: false,
    [PryVisibilityType.RESTRICTED]: false,
    [PryVisibilityType.PUBLIC]: false
  });
  @Input() set disableRadios(value: { [key in PryVisibilityType]: boolean } | null) {
    if (value) this._disableRadios$.next(value);
  }

  _allowedGroups$: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
  @Input() set allowedGroups(value: string[] | null) {
    if (value) this._allowedGroups$.next(value);
  }

  @Output() radioValueChange = new EventEmitter<PryVisibilityType>();

  constructor(
    private store: Store,
    private _cd: ChangeDetectorRef
  ) {
    super();
    this.store.dispatch(ConfigActions.loadAccessGroups());
    this.groups$ = combineLatest([this.store.select(ConfigSelectors.accessGroups), this._allowedGroups$]).pipe(
      map(([groups, allowedGroups]) =>
        groups
          .filter((group) => group.name !== 'ALL')
          .filter((group) =>
            allowedGroups?.includes(PUBLIC_GROUP) || allowedGroups?.includes(AUTHENTICATED_USERS_GROUP) || !allowedGroups
              ? true
              : allowedGroups.includes(group.name)
          )
      )
    );
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
    this.templateData$ = combineLatest([this.groups$, this.assignedGroups$, this._disableRadios$]).pipe(
      map(([groups, assignedGroups, disableRadios]) => ({ groups, assignedGroups, disableRadios }))
    );
  }

  writeValue(value: string[] | undefined) {
    value = value ?? [];
    if (!equal(this.assignedGroupNames$.getValue(), value)) {
      this._onChange(value);
      this.assignedGroupNames$.next(value);
      this.updateRadioValue(value);
      this._onTouched();
      this._cd.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
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
      this.radioValueChange.emit(type);

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
      this._onChange(groups.map((group) => (typeof group === 'string' ? group : group.name)));
      this._onTouched();
      this._cd.markForCheck();
    }
  }
}
