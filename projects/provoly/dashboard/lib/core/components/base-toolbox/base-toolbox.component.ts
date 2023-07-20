import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseToolboxAction } from './base-toolbox-action.interface';

@Component({
  selector: 'pry-base-toolbox',
  templateUrl: './base-toolbox.component.html'
})
export class BaseToolboxComponent {
  @Input() baseToolboxTranslation = '';
  @Input() actions$?: Observable<BaseToolboxAction[]>;
  @Input() subActions$?: Observable<BaseToolboxAction[]>;
}
