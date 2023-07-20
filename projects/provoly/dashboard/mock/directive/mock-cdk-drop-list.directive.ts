// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({ selector: '[cdkDropList]' })
export class MockPryDropListDirective {
  @Input() pryOverlay: any;

  @Input() styleReversed = false;
  @Input() pryOverlaySticky = false;
  @Input() pryOverlayNoPadding = false;

  @Input() pryTooltipPosition: any;
  @Input() overlayOpen: any;
  @Output() overlayOpenChange = new EventEmitter();
  @Input() hasBackdrop = true;
}
