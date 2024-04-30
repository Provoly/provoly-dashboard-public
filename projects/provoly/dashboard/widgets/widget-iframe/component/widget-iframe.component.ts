import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BaseWidgetComponent, IframeWidgetOptions, WIDGET_HEADER_HEIGHT } from '@provoly/dashboard';
import { combineLatest, debounceTime, delay, fromEvent, map, Observable } from 'rxjs';
import { PryIframeMessageType } from '../messaging/iframe-message-type.interface';
import { IframeMessagingService } from '../messaging/iframe-messaging.service';

@Component({
  selector: 'pry-widget-iframe',
  templateUrl: './widget-iframe.component.html'
})
export class WidgetIframeComponent extends BaseWidgetComponent {
  options$: Observable<IframeWidgetOptions>;
  src$: Observable<SafeResourceUrl | undefined>;
  height$: Observable<number>;
  optionsCopy: IframeWidgetOptions = {};
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  @ViewChild('iframe') iframe?: ElementRef;

  constructor(
    store: Store<any>,
    private domSanitizer: DomSanitizer,
    private iframeMessagingService: IframeMessagingService,
    el: ElementRef
  ) {
    super(store, el);
    this.options$ = this.manifest$.pipe(map((manifest) => ({ src: '', ...manifest.options } as IframeWidgetOptions)));
    this.src$ = this.options$.pipe(
      map((options) =>
        !!options && !!options.src ? domSanitizer.bypassSecurityTrustResourceUrl(options.src) : undefined
      )
    );

    this.height$ = combineLatest([this.widgetSize$.pipe(debounceTime(100)), this.displayHeader$]).pipe(
      map(([size, display]) => (size.height ?? 100) - (display ? WIDGET_HEADER_HEIGHT.value : 0)),
      delay(10)
    );

    this.subscriptions.add(
      this.options$.subscribe((options) => (this.optionsCopy = JSON.parse(JSON.stringify(options))))
    );

    this.subscriptions.add(
      combineLatest([fromEvent(window, 'message'), this.options$]).subscribe(([$event, options]) => {
        const event = $event as PryIframeMessageType;
        if (event.data.target !== '@pry') {
          // ignore all non pry formatted requests
          return;
        }

        if (!options.src || !options.src.startsWith(event.origin)) {
          // ignore demands from other domains
          return;
        }

        this.iframeMessagingService.received(event, this.iframe?.nativeElement?.contentWindow);
      })
    );
  }

  changeSrc($event: Event) {
    // @ts-ignore
    this.optionsCopy.src = $event.currentTarget.value;
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }
}
