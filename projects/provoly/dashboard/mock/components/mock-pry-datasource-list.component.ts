import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dataset, SubscriptionnerDirective } from '@provoly/dashboard';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'pry-datasource-list',
  template: '<p>Mock</p>'
})
export class MockPryDatasourceListComponent extends SubscriptionnerDirective {
  @Input() mode: 'list' | 'selector' = 'list';
  @Input() selectedDatasources: string[] = [];
  @Output() consultedDataset = new EventEmitter<Dataset>();
  @Output() datasourceSelected = new EventEmitter<string[]>();
  @Output() searchOrCategoryChanged = new EventEmitter<void>();
}
