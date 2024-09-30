// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-page-loader',
  template: '<p>Mock Page Loader</p>'
})
export class MockPryPageLoaderComponent {
  @Input() image?: string;
  @Input() imageAltText?: string;
}
