import { ChangeDetectionStrategy, Component, forwardRef, Inject, Input, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfigActions } from '../../../store/config/config.actions';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { SubscriptionnerDirective } from '../../../../dashboard/components/subscriptionner.directive';
import { Group } from '../share.model';
import {
  AUTHENTICATED_USERS_GROUP,
  getAccessRightsArrayByGroup,
  getAccessRightsStringByGroup,
  getGroupLabel,
  getGroupLabelByName,
  PUBLIC_GROUP,
  READ_ACCESS,
  SYSTEM_GROUPS,
  WRITE_ACCESS
} from '../share.utils';
import { ManifestDescription } from '../../../model/manifest.interface';
import { PryI18nService } from '../../../i18n/i18n.service';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { PRY_ACCESS_TOKEN, PryBaseAccess } from '../../../access/access.service';

@Component({
  selector: 'pry-access-rights-share',
  templateUrl: './access-rights-share.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryAccessRightsShareComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryAccessRightsShareComponent extends SubscriptionnerDirective implements ControlValueAccessor {
  value = {} as { [key: string]: string };
  private _onChange = (value: { [key: string]: string[] }) => {};
  private _onTouched = () => {};

  @Input({ required: true }) manifestDescription?: ManifestDescription;
  _allowedGroups$ = new BehaviorSubject<string[] | undefined>(undefined);
  @Input() set allowedGroups(value: string[] | null) {
    if (value) this._allowedGroups$.next(value);
  }

  groups$: Observable<(Group & { label: string })[]>;
  AVAILABLE_ACCESS_RIGHTS: { label: string; value: string }[] = [];
  accessRights: { label: string; value: string }[] = [];

  selectedGroups?: Group[] = [];
  selectedAccessRight: string = READ_ACCESS;

  assignedGroups$ = new BehaviorSubject<string[]>([]);

  constructor(
    private store: Store,
    protected i18n: PryI18nService,
    @Optional() @Inject(PRY_ACCESS_TOKEN) private access: PryBaseAccess
  ) {
    super();
    this.store.dispatch(ConfigActions.loadAccessGroups());
    this.groups$ = combineLatest([
      this.store.select(ConfigSelectors.accessGroups),
      this._allowedGroups$,
      this.assignedGroups$
    ]).pipe(
      map(([groups, allowedGroups, alreadyAssigned]) =>
        groups
          .filter((group) => (allowedGroups ? allowedGroups.includes(group.name) : true))
          .filter((group) => !alreadyAssigned.includes(group.name))
          .map((group) => ({
            ...group,
            label: getGroupLabel(group, this.i18n)
          }))
      )
    );
    this.AVAILABLE_ACCESS_RIGHTS = [
      { label: this.i18n.instant('@pry.share.read'), value: READ_ACCESS },
      { label: this.i18n.instant('@pry.share.write'), value: WRITE_ACCESS }
    ];
    this.accessRights = this.AVAILABLE_ACCESS_RIGHTS;
  }

  writeValue(value: { [key: string]: string[] } | undefined) {
    if (value) this.value = getAccessRightsStringByGroup(value) ?? ({} as { [key: string]: string });
    this.emitAlreadyAssignedGroups();
    this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onChange() {
    this._onChange(getAccessRightsArrayByGroup(this.value));
    this._onTouched();
  }

  addAccess() {
    if (this.selectedGroups) {
      this.selectedGroups.forEach((group) => {
        this.value = {
          ...this.value,
          [group.name]: this.selectedAccessRight
        };
      });
      this.emitAlreadyAssignedGroups();
      this.onChange();
    }
    this.resetSelection();
  }

  modifyGroupAccess(group: string, access: string) {
    this.value = {
      ...this.value,
      [group]: access
    };
    this._onChange(getAccessRightsArrayByGroup(this.value));
  }

  removeGroupAccess(group: string) {
    delete this.value[group];
    this._onChange(getAccessRightsArrayByGroup(this.value));
    this.emitAlreadyAssignedGroups();
  }

  resetSelection() {
    this.selectedAccessRight = 'READ';
    this.selectedGroups = undefined;
  }

  isAddingDisabled() {
    return this.selectedGroups?.length === 0;
  }

  emitAlreadyAssignedGroups() {
    this.assignedGroups$.next(Object.keys(this.value));
  }

  filterAvailableAccessRights() {
    if (
      this.selectedGroups &&
      this.selectedGroups.length > 0 &&
      this.selectedGroups.every((group) => SYSTEM_GROUPS.includes(group.name))
    ) {
      this.accessRights = this.AVAILABLE_ACCESS_RIGHTS.filter((access) => access.value === READ_ACCESS);
    } else {
      this.accessRights = this.AVAILABLE_ACCESS_RIGHTS;
    }
  }

  userBelongsToGroup(group: string): Observable<boolean> {
    return this.access ? this.access.hasGroup(group) : of(false);
  }

  protected readonly getGroupLabelByName = getGroupLabelByName;
  protected readonly PUBLIC_GROUP = PUBLIC_GROUP;
  protected readonly AUTHENTICATED_USERS_GROUP = AUTHENTICATED_USERS_GROUP;
}
