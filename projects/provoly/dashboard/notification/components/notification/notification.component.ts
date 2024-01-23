import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PryDialogRef, PryDialogService, PryNotification, SubscriptionnerDirective } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { NotificationSelectors } from '../../store/notification.selectors';
import { PryNotificationContentComponent } from './content/notification-content.component';

@Component({
  selector: 'pry-notification',
  templateUrl: './notification.component.html'
})
export class PryNotificationComponent extends SubscriptionnerDirective {
  @ViewChild('ref') ref!: ElementRef<HTMLButtonElement>;
  notifications$: Observable<PryNotification[]>;
  isOpened: boolean = false;
  dialogRef?: PryDialogRef<PryNotificationContentComponent>;

  constructor(private dialog: PryDialogService, private overlay: Overlay, protected store: Store<any>) {
    super();
    this.notifications$ = this.store.select(NotificationSelectors.list);
  }

  toggle() {
    this.isOpened = true;
    this.dialogRef = this.dialog.open(
      PryNotificationContentComponent,
      {
        overlayConfig: new OverlayConfig({
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          scrollStrategy: this.overlay.scrollStrategies.noop(),
          positionStrategy: this.overlay
            .position()
            .flexibleConnectedTo(this.ref)
            .withPositions([
              {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
              }
            ])
        })
      },
      () => {
        this.isOpened = false;
      }
    );
    this.subscriptions.add(
      this.dialogRef?.component?.closed.subscribe((isClosed) => {
        if (isClosed) {
          this.dialogRef?.close();
          this.ref.nativeElement.focus();
        }
      })
    );
  }
}
