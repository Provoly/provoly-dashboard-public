import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { PrySnackMessage } from '../snack.interface';

const showAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{transition}}')]);

const hideAnimation = animation([animate('{{transition}}'), style({ transform: '{{transform}}', opacity: 0 })]);

@Component({
  selector: 'pry-snackbar',
  templateUrl: './snackbar.component.html',
  animations: [
    trigger('panelState', [
      transition('void => visible', [useAnimation(showAnimation)]),
      transition('visible => void', [useAnimation(hideAnimation)])
    ])
  ]
})
export class PrySnackbarComponent {
  container: any;
  _data = { message: '', action: undefined, type: 'info', timeout: 3000 } as PrySnackMessage;
  @Input() set data(message: PrySnackMessage) {
    this._data = message;
    this.cdRef.detectChanges();
  }

  @Input() listIndex = 0;
  @Input() actionClicked!: Subject<void>;
  transformOptions = 'translate3d(-50%, 100%, 0px)';
  transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
  hiddenFromAction = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  get data() {
    return this._data;
  }

  get typeClass() {
    return { ['-' + this.data.type]: true };
  }

  get icon(): string {
    const iconsDefs = {
      info: 'information-point',
      success: 'check',
      warning: 'warning',
      error: 'close'
    };
    return iconsDefs[this.data.type];
  }

  actionClick() {
    this.actionClicked.next();
  }

  hide() {
    this.hiddenFromAction = true;
  }
}
