import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PryI18nService, PryNotification } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { NotificationActions } from '../../../store/notification.actions';
import { NotificationSelectors } from '../../../store/notification.selectors';

@Component({
  selector: 'pry-notification-content',
  templateUrl: './notification-content.component.html'
})
export class PryNotificationContentComponent implements DoCheck, AfterViewInit {
  open: boolean = false;
  notifications$: Observable<PryNotification[]>;
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('caret') caret!: ElementRef;
  @ViewChild('button') button!: ElementRef<HTMLButtonElement>;
  left: number = 0;

  constructor(
    protected store: Store,
    private router: Router,
    private i18nService: PryI18nService
  ) {
    this.notifications$ = this.store
      .select(NotificationSelectors.list)
      .pipe(
        map((notifications: PryNotification[]) =>
          [...notifications].sort((a, b) => (a.creationDate < b.creationDate ? 1 : -1))
        )
      );
  }

  ngAfterViewInit() {
    if (!this.open) {
      this.button?.nativeElement.focus();
    }
  }

  @HostListener('window:resize')
  ngDoCheck() {
    if (this.caret) {
      this.left = this.caret.nativeElement.offsetWidth - 48;
    }
  }

  delete(notification: PryNotification) {
    this.store.dispatch(NotificationActions.delete({ id: notification.id }));
  }

  deleteAll() {
    this.store.dispatch(NotificationActions.deleteAll());
  }

  goTo(notification: PryNotification) {
    const link = notification.link ?? '';
    if (link.startsWith('http')) {
      window.location.href = link;
    } else {
      this.router.navigateByUrl(notification.link ?? '');
    }
    this.closed.next(true);
  }

  closeToEscape() {
    this.closed.next(true);
  }

  hasTranslation(title: string, translationBase: string) {
    return this.i18nService.instant(translationBase + title) !== translationBase + title;
  }
}
