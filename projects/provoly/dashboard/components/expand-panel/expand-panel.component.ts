import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Directive, HostBinding, Input } from '@angular/core';

const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

@Directive({
  selector: 'pry-expand-panel-title'
})
export class PryExpansionPanelTitleDirective {}

@Component({
  selector: 'pry-expand-panel',
  templateUrl: 'expand-panel.component.html',
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING))
    ]),
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryExpandPanelComponent {
  @HostBinding('class.pry-expand-panel-open')
  @Input()
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  protected _open: boolean = false;

  _getExpandedState(): any {
    return this._open ? 'expanded' : 'collapsed';
  }

  _toggle(): void {
    this._open = !this._open;
  }
}
