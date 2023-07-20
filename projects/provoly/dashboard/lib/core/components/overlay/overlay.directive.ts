import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { POSITIONS } from './overlay.constantes';

@Directive({ selector: '[pryOverlay]' })
export class PryOverlayDirective implements OnInit, OnDestroy {
  @Input() pryOverlay!: TemplateRef<any>;
  private overlayRef?: OverlayRef;

  @Input() styleReversed = false;
  @Input() pryOverlaySticky = false;
  @Input() pryOverlayNoPadding = false;

  @Input() set pryOverlayPosition(val: 'before' | 'after' | 'top' | 'bottom' | 'start-bottom' | 'start-top') {
    this._position = val;
    this.assignConnectedPositions();
  }

  private _position: 'before' | 'after' | 'top' | 'bottom' | 'start-top' | 'start-bottom' = 'bottom';
  private _connectedPositions = [POSITIONS['bottom'], POSITIONS['top'], POSITIONS['after'], POSITIONS['before']];

  @Input() set overlayOpen(val: boolean) {
    const overlayOpen = this._overlayOpen;
    this._overlayOpen = val;
    if (overlayOpen !== this._overlayOpen && overlayOpen) {
      this.closeOverlay();
    } else if (overlayOpen !== this._overlayOpen && !overlayOpen) {
      this.overlayRef?.attach(
        new TemplatePortal(this.pryOverlay, this.viewContainerRef, { close: () => this.closeOverlay() })
      );
      this.overlayRef?.backdropClick().subscribe(() => this.closeOverlay());
    }
  }

  @Output() overlayOpenChange = new EventEmitter<boolean>();
  private _overlayOpen = false;
  @Input() hasBackdrop = true;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withViewportMargin(5)
      .withPositions(this._connectedPositions);
    const panelClass = ['pry-tooltip-container'];
    this.styleReversed && panelClass.push('pry-tooltip-reversed');
    this.pryOverlaySticky && panelClass.push('pry-overlay-sticky');
    this.pryOverlayNoPadding && panelClass.push('pry-overlay-no-padding');
    if (this.hasBackdrop) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        positionStrategy,
        panelClass,
        scrollStrategy: this.overlay.scrollStrategies.reposition({ autoClose: false })
      });
    } else {
      this.overlayRef = this.overlay.create({
        positionStrategy,
        panelClass,
        scrollStrategy: this.overlay.scrollStrategies.reposition({ autoClose: false })
      });
    }
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }

  private closeOverlay() {
    this.overlayRef?.detach();
    this.overlayOpenChange.emit(false);
  }

  private assignConnectedPositions() {
    switch (this._position) {
      case 'before':
        this._connectedPositions = [POSITIONS['before'], POSITIONS['after'], POSITIONS['top'], POSITIONS['bottom']];
        break;
      case 'after':
        this._connectedPositions = [POSITIONS['after'], POSITIONS['before'], POSITIONS['top'], POSITIONS['bottom']];
        break;
      case 'bottom':
        this._connectedPositions = [POSITIONS['bottom'], POSITIONS['top'], POSITIONS['after'], POSITIONS['before']];
        break;
      case 'start-bottom':
        this._connectedPositions = [
          POSITIONS['start-bottom'],
          POSITIONS['start-top'],
          POSITIONS['after'],
          POSITIONS['before']
        ];
        break;
      case 'start-top':
        this._connectedPositions = [
          POSITIONS['start-top'],
          POSITIONS['start-bottom'],
          POSITIONS['after'],
          POSITIONS['before']
        ];
        break;
      case 'top':
      default:
        this._connectedPositions = [POSITIONS['top'], POSITIONS['bottom'], POSITIONS['after'], POSITIONS['before']];
        break;
    }
  }
}
