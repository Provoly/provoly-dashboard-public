import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-page-loader',
  templateUrl: 'page-loader.component.html'
})
export class PryPageLoaderComponent {
  @Input() image?: string;
  @Input() imageAltText?: string;
}
