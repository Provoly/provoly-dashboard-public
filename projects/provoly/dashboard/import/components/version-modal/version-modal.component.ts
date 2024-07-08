import { Component, Inject, input } from '@angular/core';
import { DatasetVersion, PRY_DIALOG_DATA, PryDialogRef } from '@provoly/dashboard';

@Component({
  selector: 'pry-version-modal',
  templateUrl: './version-modal.component.html'
})
export class PryVersionModalComponent {
  version: DatasetVersion;

  constructor(
    private dialogRef: PryDialogRef<PryVersionModalComponent>,
    @Inject(PRY_DIALOG_DATA)
    private data: { version: DatasetVersion }
  ) {
    this.version = this.data.version;
  }

  close(): void {
    this.dialogRef.close();
  }
}
