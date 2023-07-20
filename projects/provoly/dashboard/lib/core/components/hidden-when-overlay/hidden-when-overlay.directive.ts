import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '../../../dashboard/components/subscriptionner.directive';
import { ConfigSelectors } from '../../store/config/config.selectors';

@Directive({
  selector: '[pryHwo]'
})
export class PryHiddenWhenOverlayDirective extends SubscriptionnerDirective {
  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
    private store: Store
  ) {
    super();
    this.store.select(ConfigSelectors.hasOverlay).subscribe((hasOverlay: boolean) => {
      if (hasOverlay) {
        this._renderer.setAttribute(this._elRef.nativeElement, 'aria-hidden', hasOverlay + '');
      } else {
        this._renderer.removeAttribute(this._elRef.nativeElement, 'aria-hidden');
      }
    });
  }
}
