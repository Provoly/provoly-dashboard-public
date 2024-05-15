import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PryDialogRef } from '../../overlay/dialog-ref';
import { PRY_DIALOG_DATA } from '../../overlay/dialog.service';
import { ManifestDescription } from '../../../model/manifest.interface';
import { DashboardActions } from '../../../../dashboard/store/dashboard.actions';
import { DataSourceSelectors } from '../../../store/data-source/data-source.selectors';
import { getCommonDatasourceGroupsForManifest } from '../share.utils';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable } from 'rxjs';
import equal from 'fast-deep-equal/es6';

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
    this.manifest = this.data.manifest;
    this.accessRightsByGroup = { ...this.manifest.accessRightsByGroup };

    this.allowedShareGroups$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return this.manifest.datasource.length > 0
          ? getCommonDatasourceGroupsForManifest(this.manifest, datasets)
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
        id: this.manifest.id ?? '',
        name: this.manifest.name ?? '',
        description: this.manifest.description ?? '',
        image: this.manifest.image ?? '',
        accessRightsByGroup: this.accessRightsByGroup
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
