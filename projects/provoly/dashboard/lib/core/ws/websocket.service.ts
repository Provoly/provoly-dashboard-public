import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigSelectors } from '../store/config/config.selectors';

export type wsMessage = { type: string; payload: any; id: string };

const MAX_DELAY = 5 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocket?: WebSocketSubject<any>;
  private _messages$ = new ReplaySubject<wsMessage>();
  private url?: string;
  private delay = 0.5;
  private active = true;
  private currentRetry: undefined | number = undefined;

  constructor(private store: Store<any>) {
    this.store
      .select(ConfigSelectors.wsUrl)
      .pipe(filter((url) => !!url))
      .subscribe((url) => {
        this.url = url;
        this.connect();
      });
  }

  connect(currentDelay?: number) {
    if (this.url && this.active) {
      console.log(`Connecting to ${this.url}${currentDelay ? ' (retry after ' + currentDelay / 1000 + 's)' : ''}`);

      this.currentRetry = undefined;
      this.disconnect();

      this.websocket = webSocket({
        url: this.url,
        openObserver: {
          next: () => {
            console.log(`Connection to ${this.url} succeeded`);
            this.delay = 0.5;
          }
        },
        closeObserver: {
          next: () => this.retry()
        }
      });

      this.websocket.subscribe({
        next: (msg: wsMessage) => {
          // message received (must be stored by type to present all of them when subscribing
          this._messages$.next(msg);
        },
        error: (err) => this.retry(),
        complete: () => this.retry()
      });
    }
  }

  sendMessage(type: string, payload: any) {
    if (!!this.websocket) {
      this.websocket.next({ type, payload });
    }
  }

  messages$(type: string): Observable<wsMessage> {
    return this._messages$.pipe(filter((msg) => msg.type === type));
  }

  retry() {
    if (!this.currentRetry) {
      this.delay = this.delay * 2;
      this.disconnect();
      const currentDelay = Math.min(MAX_DELAY, this.delay * 1000);
      this.currentRetry = setTimeout(() => {
        this.connect(currentDelay);
      }, currentDelay) as unknown as number;
    }
  }

  toggleActive(active?: boolean) {
    this.active = active !== undefined ? active : !this.active;
    if (this.active) {
      this.connect();
    } else {
      this.disconnect();
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket?.unsubscribe();
      this.websocket = undefined;
    }
  }
}
