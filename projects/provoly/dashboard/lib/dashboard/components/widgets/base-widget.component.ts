import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  Subscription,
  switchMap
} from 'rxjs';
import { WidgetManifest } from '../../../core/model/manifest.interface';
import { Size } from '../../../core/model/widget-chart-manifest.interface';
import { SubscriptionnerDirective } from '../subscriptionner.directive';

@Component({ selector: 'pry-base-widget', template: '' })
export class BaseWidgetComponent extends SubscriptionnerDirective implements OnDestroy, AfterViewChecked {
  widgetIndex$ = new BehaviorSubject<number>(0);
  manifest$!: Observable<WidgetManifest>;
  manifest: WidgetManifest = { type: 'placeholder' } as WidgetManifest;
  sub?: Subscription;
  observableList$ = new BehaviorSubject<Observable<WidgetManifest>[]>([] as Observable<WidgetManifest>[]);
  staticManifest$ = new BehaviorSubject<WidgetManifest | null>(null);
  displayHeader$: Observable<boolean | { [key: string]: boolean }>;
  private _widgetSize$ = new BehaviorSubject<Size>({ width: 300, height: 300 });
  widgetSize$: Observable<Size>;

  @Input() open$: Observable<void> | Subject<void> = new Subject<void>();

  @Output() manifestModified = new EventEmitter<{ widgetIndex: number; manifest: WidgetManifest }>();

  @Input() set widgetIndex(index: number) {
    this.widgetIndex$.next(index);
  }

  @Input() set staticManifest(manifest: WidgetManifest) {
    this.staticManifest$.next(manifest);
  }

  set _manifest$(manifest: Observable<WidgetManifest>) {
    this.manifest$ = manifest;
    this.sub?.unsubscribe();
    this.observableList$.next([manifest]);
  }

  get widgetIndex() {
    return this.widgetIndex$.getValue();
  }

  constructor(
    protected store: Store<any>,
    protected el: ElementRef
  ) {
    super();
    this.manifest$ = this.observableList$.pipe(
      combineLatestWith(this.staticManifest$),
      switchMap(([observables, staticManifest]) => (!staticManifest ? merge(...observables) : of(staticManifest))),
      distinctUntilChanged((p, v) => equal(p, v))
    );
    this.subscriptions.add(this.manifest$.subscribe((manifest) => (this.manifest = manifest)));
    this.displayHeader$ = this.manifest$.pipe(map((manifest) => manifest.header === undefined || manifest.header));
    this.widgetSize$ = this._widgetSize$.pipe(
      startWith({
        width: 300,
        height: 300
      }),
      distinctUntilChanged((p, c) => p.width === c.width && p.height === c.height),
      debounceTime(100),
      distinctUntilChanged((p, c) => p.width === c.width && p.height === c.height)
    );
  }

  ngAfterViewChecked(): void {
    this._widgetSize$.next({ width: this.el.nativeElement.offsetWidth, height: this.el.nativeElement.offsetHeight });
  }

  toImage(): Promise<string> {
    return Promise.reject('Not yet implemented');
  }
}
