// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[cdkConnectedOverlay]'
})
export class MockCdkConnectedOverlayDirective {
  @Input() cdkConnectedOverlayOrigin: any;
  @Input() cdkConnectedOverlayOpen: any;
  @Input() cdkConnectedOverlayHasBackdrop: any;
  @Input() cdkConnectedOverlayPositions: any;
  @Input() cdkConnectedOverlayBackdropClass: any;
  @Input() cdkConnectedOverlayMinWidth: any;
  @Output() backdropClick = new EventEmitter();
}
