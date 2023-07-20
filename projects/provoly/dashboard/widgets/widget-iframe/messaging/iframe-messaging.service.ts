import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PryIframeMessageType } from './iframe-message-type.interface';

@Injectable({
  providedIn: 'root'
})
export class IframeMessagingService {
  message$ = new Subject<PryIframeMessageType>();

  received($event: PryIframeMessageType, window: Window) {
    $event.relatedWindow = window;
    this.message$.next($event);
  }

  post(target: Window, message: any, origin?: string) {
    const msg = {
      data: JSON.parse(JSON.stringify(message)),
      source: '@pry'
    };
    if (!!target) {
      target.postMessage(msg, origin ?? '*');
    }
  }
}
