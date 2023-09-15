import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Associations } from '@provoly/dashboard';

@Component({
  selector: 'pry-association',
  templateUrl: './association.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PryAssociationComponent {
  @Input() associations?: Associations;
}
