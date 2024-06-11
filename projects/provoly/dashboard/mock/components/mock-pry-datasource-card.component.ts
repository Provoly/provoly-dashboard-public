// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource } from '@provoly/dashboard';

@Component({
  selector: 'pry-datasource-card',
  template: '<p>Mock</p>'
})
export class MockPryDatasourceCardComponent {
  @Input() datasource!: DataSource;
  @Input() showFooter: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;

  @Output() clicked = new EventEmitter<any>();
}
