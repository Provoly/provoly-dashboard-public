import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ConfigActions } from '../../../../core/store/config/config.actions';
import { PryWidgetHeaderComponent } from '../header/widget-header.component';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';

@Component({
  selector: 'pry-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  _widgetIndex$ = new BehaviorSubject<number>(0);
  manifest$?: Observable<WidgetManifest>;
  manifest?: WidgetManifest;
  private openSub?: Subscription;

  @Input() set widgetIndex(widgetIndex: number) {
    this._widgetIndex$.next(widgetIndex);
  }

  @Input() isDisable?: boolean;

  @Input() headerPresent!: boolean | null | { [key: string]: boolean };

  @Input() set open$(open$: Observable<void> | Subject<void>) {
    this.openSub?.unsubscribe();
    this.openSub = open$.subscribe(() => {
      this.toggle();
    });
  }

  @Input() header?: PryWidgetHeaderComponent;

  @Output() saveTriggered = new EventEmitter<void>();
  open = false;

  @Output() changeTitle = new EventEmitter<string>();

  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('validate') validate!: ElementRef<HTMLButtonElement>;

  constructor(private store: Store<any>, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this.manifest$ = this.store.select(DashboardSelectors.widgetManifest(this._widgetIndex$.value));
    this.subscriptions.add(this.manifest$.subscribe((manifest) => (this.manifest = manifest)));
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      this.openWithTemplate();
      setTimeout(() => {
        this.cross?.nativeElement.focus();
      }, 10);
    } else {
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.overlayRef?.dispose();
      if (!!this.header) {
        this.header.menuOpen(undefined, false);
      }
    }
  }

  saveAndClose() {
    this.toggle();
    this.saveTriggered.emit();
  }

  openWithTemplate() {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-settings__popup'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.toggle());
    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
  }

  focusElement(element: HTMLButtonElement) {
    element.focus();
  }
  focusCrossElement() {
    this.cross.nativeElement.focus();
  }

  focusValidation() {
    this.validate.nativeElement.focus();
  }

  emitTitle($event: Event) {
    // @ts-ignore
    this.changeTitle.emit($event.currentTarget.value || undefined);
  }

  override ngOnDestroy(): void {
    this.openSub?.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
