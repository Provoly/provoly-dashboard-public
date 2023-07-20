import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class PryDialogRef<T> {
  public closeValue = new Subject<any>();
  component?: T;

  constructor(private overlayRef: OverlayRef) {}

  close(value?: any): void {
    if (value) {
      this.closeValue.next(value);
    }
    this.closeValue.complete();
    this.overlayRef.dispose();
  }
}
