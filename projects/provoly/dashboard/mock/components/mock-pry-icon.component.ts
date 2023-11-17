// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-icon',
  template: '<p>Mock Mat icon</p>'
})
export class MockPryIconComponent {
  @Input() color: 'primary' | 'accent' | null = null;
  @Input() iconSvg?: string;
  @Input() alt?: string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() animation: any;
}
