import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, InjectionToken, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions } from '../../store/config/config.actions';
import { PryDialogRef } from './dialog-ref';

interface PryDialogConfig {
  panelClass?: string[];
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: any;
  overlayConfig?: OverlayConfig;
}

const DEFAULT_CONFIG: PryDialogConfig = {
  hasBackdrop: true,
  panelClass: ['pry-dialog-container'],
  backdropClass: 'backdrop'
};

export const PRY_DIALOG_DATA = new InjectionToken<any>('PRY_DIALOG_DATA');

@Injectable({ providedIn: 'root' })
export class PryDialogService {
  constructor(
    private injector: Injector,
    private overlay: Overlay,
    private store: Store
  ) {}

  open<T>(
    component: ComponentType<T>,
    config: PryDialogConfig = {},
    additionalBehaviorAtClose?: () => void
  ): PryDialogRef<T> {
    const modalConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay<T>(modalConfig, component, additionalBehaviorAtClose);
    const dialogRef = new PryDialogRef<T>(overlayRef);

    dialogRef.component = this.attachModalContainer<T>(overlayRef, modalConfig, dialogRef, component);

    this.store.dispatch(ConfigActions.addingOverlay({ id: component.name }));

    return dialogRef;
  }

  private attachModalContainer<T>(
    overlayRef: OverlayRef,
    config: PryDialogConfig,
    dialogRef: PryDialogRef<T>,
    component: ComponentType<T>
  ) {
    const injector = this.createInjector(dialogRef, config);

    const containerPortal = new ComponentPortal(component, null, injector);
    const containerRef: ComponentRef<T> = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private createInjector<T>(dialogRef: PryDialogRef<T>, config: PryDialogConfig): Injector {
    const providers = [
      { provide: PryDialogRef, useValue: dialogRef },
      { provide: PRY_DIALOG_DATA, useValue: config.data }
    ];
    return Injector.create({ parent: this.injector, providers });
  }

  private getOverlayConfig(config: PryDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }

  private createOverlay<T>(
    config: PryDialogConfig,
    component: ComponentType<T>,
    additionalBehaviorAtClose?: () => void
  ) {
    const overlayConfig = config.overlayConfig ?? this.getOverlayConfig(config);
    const overlay = this.overlay.create(overlayConfig);
    overlay.backdropClick().subscribe(() => {
      overlay.dispose();
      if (!!additionalBehaviorAtClose) {
        additionalBehaviorAtClose();
      }
      this.store.dispatch(ConfigActions.closeOverlay({ id: component.name }));
    });
    return overlay;
  }
}
