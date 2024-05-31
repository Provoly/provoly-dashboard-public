import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, ViewContainerRef } from '@angular/core';
import equal from 'fast-deep-equal/es6';
import { Observable, Subject, switchMap, windowTime } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { PryI18nService } from '../../i18n/i18n.service';
import { PrySnackMessage } from './snack.interface';
import { PrySnackbarComponent } from './snackbar/snackbar.component';

export const DEFAULT_MSG_TIMEOUT = 3000;
export const DELAY_FOR_HIDE = 200;

export const PRY_CUSTOMEVENT_TYPE = '@pry.snack';

@Injectable({
  providedIn: 'root'
})
export class PrySnackbarService {
  rootViewContainer?: ViewContainerRef;
  static count = 0;

  private overlayRef?: OverlayRef;

  private messageEvents$ = new Subject<PrySnackMessage>();

  constructor(
    private overlay: Overlay,
    private translate: PryI18nService
  ) {
    // Allows to access snackbar from javascript, for example to manage Vega errors
    document.addEventListener(
      PRY_CUSTOMEVENT_TYPE,
      (e: Event) => {
        const pryMessage = (e as CustomEvent<PrySnackMessage>).detail;
        pryMessage.message = this.translate.instant(pryMessage.message);
        pryMessage.action = !!pryMessage.action ? this.translate.instant(pryMessage.action) : undefined;
        this.messageEvents$.next(pryMessage);
      },
      false
    );

    this.messageEvents$
      .pipe(
        windowTime(1000),
        switchMap((source) => source.pipe(distinctUntilChanged((p, v) => equal(p, v))))
      )
      .subscribe((message) => this.notMitigatedOpen(message));
  }

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  dispatchOpenEvent(message: PrySnackMessage) {
    document.dispatchEvent(new CustomEvent(PRY_CUSTOMEVENT_TYPE, { detail: message }));
  }

  notMitigatedOpen(message: PrySnackMessage): Observable<void> | null {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: false
      })
    );
    const componentPortal = new ComponentPortal(PrySnackbarComponent, this.rootViewContainer);
    const component = this.overlayRef.attach(componentPortal);

    component.instance.data = message;
    component.instance.listIndex = PrySnackbarService.count++;
    component.instance.actionClicked = new Subject<void>();

    setTimeout(() => {
      /* First hide component so it uses animation */
      component.instance.hiddenFromAction = true;
      PrySnackbarService.count--;

      setTimeout(() => {
        /* then clean by removing it */
        component.instance.actionClicked.complete();
        this.overlayRef?.dispose();
        component.destroy();
      }, DELAY_FOR_HIDE);
    }, message.timeout ?? DEFAULT_MSG_TIMEOUT);

    return component.instance.actionClicked;
  }

  open(message: PrySnackMessage) {
    this.messageEvents$.next(message);
  }
}
