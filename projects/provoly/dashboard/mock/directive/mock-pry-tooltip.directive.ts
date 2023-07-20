// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, Input } from '@angular/core';

@Directive({ selector: '[pryTooltip]' })
export class MockPryTooltipDirective {
  @Input() pryTooltip: any;

  @Input() pryTooltipPosition: any;
  @Input() pryTooltipShowDelay: any;
}
