import { Component } from '@angular/core';
import { FieldType } from '@provoly/dashboard';
import { PipelinePropertiesPanelComponent } from '@provoly/dashboard/pipeline';

@Component({
  selector: 'pry-pipeline-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent extends PipelinePropertiesPanelComponent {
  ref = {
    [FieldType.INTEGER]: ['GREATER_THAN', 'LOWER_THAN'],
    [FieldType.DECIMAL]: ['GREATER_THAN', 'LOWER_THAN'],
    [FieldType.LONG]: ['GREATER_THAN', 'LOWER_THAN'],
    [FieldType.STRING]: [],
    [FieldType.KEYWORD]: [],
    [FieldType.INSTANT]: ['GREATER_THAN', 'LOWER_THAN']
  } as { [key: string]: string[] };

  operators: string[] = [];
  inputType: string = 'text';

  constructor() {
    super();
  }

  changeAttribute($event: any) {
    this.node.properties['attributeName'] = $event;
    this.checkFn();
    if (this.model) {
      const attrType = this.model.attributes.find((attr) => attr.technicalName === $event)?.type ?? 'string';
      this.operators = this.ref[attrType];
      if (this.operators) {
        this.node.properties['operator'] = this.operators[0];
      }
      this.inputType = this.getType(attrType);
    }
  }

  getType(type: string) {
    switch (type) {
      case FieldType.INTEGER:
      case FieldType.LONG:
      case FieldType.DECIMAL:
        return 'number';
      case FieldType.INSTANT:
        return 'date';
      case FieldType.KEYWORD:
      case FieldType.STRING:
      default:
        return 'text';
    }
  }

  changeOperator($event: any) {
    this.node.properties['operator'] = $event;
    this.checkFn();
  }

  changeValue($event: any) {
    this.node.properties['value'] = $event;
    this.checkFn();
  }
}
