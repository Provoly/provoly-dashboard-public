import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { WebsocketService, wsMessage } from '@provoly/dashboard';
import { map, mergeMap } from 'rxjs';
import { NotificationActions } from './notification.actions';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private wsService: WebsocketService,
    private store: Store,
    private notificationService: NotificationService
  ) {
    wsService.messages$('notification').subscribe((msg: wsMessage) => {
      setTimeout(
        () =>
          this.store.dispatch(
            NotificationActions.add({
              notification: {
                text: msg.payload.text,
                link: msg.payload.link,
                creationDate: msg.payload.creationDate,
                id: msg.id
              }
            })
          ),
        1
      );
    });
  }

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.delete),
      mergeMap((action) =>
        this.notificationService
          .deleteNotification(action.id)
          .pipe(map(() => NotificationActions.deleteSuccess({ id: action.id })))
      )
    )
  );

  deleteAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.deleteAll),
      mergeMap((action) =>
        this.notificationService.deleteAllNotifications().pipe(map(() => NotificationActions.deleteAllSuccess()))
      )
    )
  );
}
