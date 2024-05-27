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
import { Group } from '../share.model';
import { BehaviorSubject, map, Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { ConfigActions } from '../../../store/config/config.actions';
import { SubscriptionnerDirective } from '../../../../dashboard/components/subscriptionner.directive';
import equal from 'fast-deep-equal/es6';
import { AUTHENTICATED_USERS_GROUP, PUBLIC_GROUP } from '../share.utils';

export enum PryShareMode {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  GROUPS = 'GROUPS'
}

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

  radioValue = PryShareMode.PRIVATE;
  assignedGroups$: Observable<Group[]>;
  groups$: Observable<Group[]>;
  PryShareMode = PryShareMode;
  shareModes: { label: string; value: PryShareMode }[] = [];
  templateData$: Observable<{
    groups: Group[];
    assignedGroups: Group[];
    disableRadios: { [key in PryShareMode]: boolean };
  }>;

  _disableRadios$: BehaviorSubject<{ [key in PryShareMode]: boolean }> = new BehaviorSubject<{
    [key in PryShareMode]: boolean;
  }>({
    [PryShareMode.PRIVATE]: false,
    [PryShareMode.PUBLIC]: false,
    [PryShareMode.GROUPS]: false
  });
  @Input() set disableRadios(value: { [key in PryShareMode]: boolean } | null) {
    if (value) this._disableRadios$.next(value);
  }

  _allowedGroups$: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
  @Input() set allowedGroups(value: string[] | null) {
    if (value) this._allowedGroups$.next(value);
  }

  @Output() radioValueChange = new EventEmitter<PryShareMode>();

  constructor(
    private store: Store,
    private _cd: ChangeDetectorRef
  ) {
    super();
    this.store.dispatch(ConfigActions.loadAccessGroups());
    this.groups$ = combineLatest([this.store.select(ConfigSelectors.accessGroups), this._allowedGroups$]).pipe(
      map(([groups, allowedGroups]) =>
        groups
          .filter((group) => group.name !== PUBLIC_GROUP)
          .filter((group) =>
            allowedGroups?.includes(PUBLIC_GROUP) ||
            allowedGroups?.includes(AUTHENTICATED_USERS_GROUP) ||
            !allowedGroups
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
    this.shareModes = Object.keys(PryShareMode).map((label) => ({
      label: label.toLowerCase(),
      value: PryShareMode[<keyof typeof PryShareMode>label]
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
      this.radioValue = PryShareMode.PRIVATE;
    } else if (groups.length === 1 && groups.find((group) => group === PUBLIC_GROUP)) {
      this.radioValue = PryShareMode.PUBLIC;
    } else {
      this.radioValue = PryShareMode.GROUPS;
    }
  }

  changeGroupsBasedOnRadioValue(type: PryShareMode): void {
    if (this.radioValue !== type) {
      this.radioValue = type;
      this.radioValueChange.emit(type);

      switch (type) {
        case PryShareMode.PRIVATE:
          this.changeGroups([]);
          break;
        case PryShareMode.GROUPS:
          this.changeGroups(this.assignedGroupNames$.getValue() ?? []);
          break;
        case PryShareMode.PUBLIC:
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
