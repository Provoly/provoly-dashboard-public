import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Associations } from '@provoly/dashboard';

@Component({
  selector: 'pry-association',
  templateUrl: './association.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PryAssociationComponent implements OnInit {
  @Input() associations?: Associations;

  ngOnInit() {
    console.log(this.associations);
  }
}
