import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

const POSITIONS: { [key: string]: ConnectedPosition } = {
  before: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center'
  },
  after: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center'
  },
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom'
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top'
  }
};

@Directive({ selector: '[pryTooltip]' })
export class PryTooltipDirective implements OnInit {
  @Input() pryTooltip!: TemplateRef<any>;
  private overlayRef?: OverlayRef;

  @Input() styleReversed = false;
  private _context: any = {};

  @Input() set pryTooltipContext(context: any) {
    Object.keys(context).forEach((key) => {
      this._context[key] = context[key];
    });
  }

  portalRef?: TemplatePortal<any>;

  @Input() set pryTooltipPosition(val: 'before' | 'after' | 'top' | 'bottom') {
    this._position = val;
    this.assignConnectedPositions();
  }

  private _position: 'before' | 'after' | 'top' | 'bottom' = 'top';
  private _connectedPositions = [POSITIONS['top'], POSITIONS['bottom'], POSITIONS['after'], POSITIONS['before']];

  @Input() pryTooltipShowDelay: number = 300;
  _timeout?: any;

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
    const panelClass = this.styleReversed
      ? ['pry-tooltip-container', 'pry-tooltip-reversed']
      : ['pry-tooltip-container'];
    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass
    });
  }

  @HostListener('mouseenter')
  show() {
    this._timeout = setTimeout(() => {
      this.portalRef = new TemplatePortal(this.pryTooltip, this.viewContainerRef, this._context);
      this.overlayRef?.attach(this.portalRef);
    }, this.pryTooltipShowDelay);
  }

  @HostListener('mouseout')
  hide() {
    clearTimeout(this._timeout);
    this.overlayRef?.detach();
  }

  @HostListener('click')
  hideOnClick() {
    this.hide();
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
      case 'top':
      default:
        this._connectedPositions = [POSITIONS['top'], POSITIONS['bottom'], POSITIONS['after'], POSITIONS['before']];
        break;
    }
  }
}
