import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap
} from 'rxjs';
import { delay } from 'rxjs/operators';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { DashboardActions } from '../../../store/dashboard.actions';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';
import { BaseWidgetComponent } from '../base-widget.component';
import { WidgetPlaceholderComponent } from '../widget-placeholder/widget-placeholder.component';
import { WidgetFactoryService } from './widget-factory.service';

@Component({
  selector: 'pry-widget-instanciator',
  templateUrl: './widget-instanciator.component.html'
})
export class WidgetInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit, OnDestroy {
  _widgetIndex$ = new BehaviorSubject<number>(0);
  widgetManifest$!: Observable<WidgetManifest>;
  staticManifest$ = new BehaviorSubject<WidgetManifest | null>(null);

  @Input() set widgetIndex(manifest: number) {
    this._widgetIndex$.next(manifest);
  }

  get widgetIndex() {
    return this._widgetIndex$.getValue();
  }

  @Input() set staticManifest(manifest: WidgetManifest) {
    this.staticManifest$.next(manifest);
  }

  @Input() standalone = false;

  @Output() manifestModified = new EventEmitter<{ widgetIndex: number; manifest: WidgetManifest }>();

  @ViewChild('componentRef', { read: ViewContainerRef, static: false }) componentRef!: ViewContainerRef;
  instanciatedComponent!: ComponentRef<any>;
  instanceSubscription?: Subscription;
  @Input() open$: Observable<void> | Subject<void> = new Subject<void>();

  @Output() widgetInstance = new EventEmitter<BaseWidgetComponent>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private widgetFactoryService: WidgetFactoryService,
    private store: Store<any>
  ) {
    super();
  }

  ngAfterViewInit() {
    // Dynamically create associated component
    this.widgetManifest$ = combineLatest([this.staticManifest$, this._widgetIndex$]).pipe(
      distinctUntilChanged(),
      switchMap(([staticManifest, index]) =>
        !!staticManifest ? of(staticManifest) : this.store.select(DashboardSelectors.widgetManifest(index))
      ),
      distinctUntilChanged((p, c) => equal(p, c))
    );

    this.subscriptions.add(
      this.widgetManifest$.subscribe((widgetManifest) => {
        this.componentRef.clear();
        this.instanceSubscription?.unsubscribe();

        this.widgetFactoryService
          .resolveComponent(widgetManifest)
          .pipe(delay(1))
          .subscribe((component) => {
            this.instanciatedComponent = !!component
              ? this.componentRef.createComponent(component)
              : this.componentRef.createComponent(WidgetPlaceholderComponent);
            this.instanciatedComponent.instance._manifest$ = this.widgetManifest$;
            this.instanciatedComponent.instance.widgetIndex = this._widgetIndex$.getValue();
            this.instanciatedComponent.instance.open$ = this.open$;
            this.instanceSubscription = this.instanciatedComponent.instance.manifestModified.subscribe(
              (manifest: { widgetIndex: number; manifest: WidgetManifest }) => {
                if (!this.standalone) {
                  // Impact store global manifest
                  this.store.dispatch(
                    DashboardActions.updateWidgetManifest({ ...manifest, index: manifest.widgetIndex })
                  );
                }
                this.manifestModified.emit(manifest);
              }
            );
            this.widgetInstance.emit(this.instanciatedComponent.instance);
          });
      })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.instanciatedComponent) {
      this.instanciatedComponent.destroy();
    }
    this.cdRef.detectChanges();
  }
}
