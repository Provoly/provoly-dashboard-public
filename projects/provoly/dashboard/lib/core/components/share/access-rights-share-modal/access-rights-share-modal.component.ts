import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PryDialogRef } from '../../overlay/dialog-ref';
import { PRY_DIALOG_DATA } from '../../overlay/dialog.service';
import { ManifestDescription } from '../../../model/manifest.interface';
import { DashboardActions } from '../../../../dashboard/store/dashboard.actions';
import { DataSourceSelectors } from '../../../store/data-source/data-source.selectors';
import { getCommonDatasourceGroupsForManifest } from '../share.utils';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import equal from 'fast-deep-equal/es6';
import { DataSourceActions } from '../../../store/data-source/data-source.actions';
import { DashboardSelectors } from '../../../../dashboard/store/dashboard.selectors';
import { ConfigActions } from '../../../store/config/config.actions';
import { ConfigSelectors } from '../../../store/config/config.selectors';

@Component({
  selector: 'pry-access-rights-share-modal',
  templateUrl: './access-rights-share-modal.component.html'
})
export class PryAccessRightsShareModalComponent {
  manifest: ManifestDescription;
  accessRightsByGroup: { [key: string]: string[] } = {};

  allowedShareGroups$: Observable<string[] | null>;
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  @ViewChild('submit') submit!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('crossVisibility') crossVisibility!: ElementRef<HTMLButtonElement>;

  constructor(
    private store: Store<any>,
    private dialogRef: PryDialogRef<PryAccessRightsShareModalComponent>,
    @Inject(PRY_DIALOG_DATA)
    private data: {
      manifest: ManifestDescription;
    }
  ) {
    this.store.dispatch(DataSourceActions.dataset.loadDataset({}));
    this.store.dispatch(ConfigActions.loadAccessGroups());
    this.manifest = this.data.manifest;
    this.accessRightsByGroup = { ...this.manifest.accessRightsByGroup };

    this.allowedShareGroups$ = combineLatest([
      this.store.select(DataSourceSelectors.datasets),
      this.store.select(DashboardSelectors.currentManifest),
      this.store.select(ConfigSelectors.accessGroups)
    ]).pipe(
      map(([datasets, current, groups]) => {
        return current && current.datasource.length > 0
          ? getCommonDatasourceGroupsForManifest(current, datasets, groups)
          : null;
      })
    );
  }

  updateAccessRights($event: { [key: string]: string[] }) {
    this.accessRightsByGroup = $event;
    this.updateDisableButtonValue();
  }

  updateDisableButtonValue() {
    if (equal(this.accessRightsByGroup, this.manifest.accessRightsByGroup)) {
      this.disableShareButton$.next(true);
    } else {
      if (this.disableShareButton$.getValue()) {
        this.disableShareButton$.next(false);
      }
    }
  }

  validate() {
    this.store.dispatch(
      DashboardActions.saveManifest({
        ...this.manifest,
        accessRightsByGroup: this.accessRightsByGroup,
        metadata: undefined
      })
    );
    this.toggleModal();
  }

  toggleModal() {
    this.dialogRef.close();
  }

  focusCrossElement() {
    if (this.crossVisibility) {
      this.crossVisibility?.nativeElement.focus();
    }
    this.cross?.nativeElement.focus();
  }

  focusValidation() {
    if (this.confirm) {
      this.confirm.nativeElement.focus();
    }
    this.submit.nativeElement.focus();
  }
}
