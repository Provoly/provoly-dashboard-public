import { Component } from '@angular/core';
import { PipelinePropertiesPanelComponent } from '@provoly/dashboard/pipeline';

@Component({
  selector: 'pry-pipeline-noop',
  template: ``
})
export class NoopComponent extends PipelinePropertiesPanelComponent {
  constructor() {
    super();
  }
}
