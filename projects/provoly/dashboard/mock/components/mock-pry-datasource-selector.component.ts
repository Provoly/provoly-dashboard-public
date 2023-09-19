// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource, WidgetManifest } from '@provoly/dashboard';

@Component({
  selector: 'pry-datasource-selector',
  template: '<p>Mock</p>'
})
export class MockPryDatasourceSelectorComponent {
  @Input() manifest: WidgetManifest | null = null;

  @Input() datasourceIds: string[] = [];

  @Output() cancel = new EventEmitter();
  @Output() validated = new EventEmitter();
  @Output() previousTab = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() datasourcesChanged = new EventEmitter<DataSource[]>();
}
