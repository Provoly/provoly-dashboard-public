import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '@provoly/dashboard';
import { mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  deleteNotification(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete(encodeURI(`${url}/notification/me/id/${id}`))));
  }

  deleteAllNotifications() {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete(encodeURI(`${url}/notification/me`))));
  }
}
