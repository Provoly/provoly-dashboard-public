import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardManifest } from '../../../../core/model/manifest.interface';
import { DashboardActions } from '../../../store/dashboard.actions';
import { BaseWidgetComponent } from '../base-widget.component';

@Component({
  selector: 'pry-widget-filler',
  templateUrl: './widget-filler.component.html'
})
export class WidgetFillerComponent extends BaseWidgetComponent {
  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
  }

  get index() {
    // @ts-ignore
    return this.manifest.options?.index ?? 0;
  }

  moveToPlace() {
    // @ts-ignore
    const startLayout = this.manifest.options?.sourcePlace;
    // @ts-ignore
    const targetLayout = this.manifest.options?.targetPlace;
    // @ts-ignore
    if (startLayout && targetLayout && this.manifest.options?.windowManifest && this.index !== '-') {
      // @ts-ignore
      const newWindowManifest = structuredClone(this.manifest.options?.windowManifest) as DashboardManifest;
      const targetWidgetIndex = newWindowManifest.widgets.findIndex(
        (w) =>
          w.layout.x === targetLayout.x &&
          w.layout.y === targetLayout.y &&
          w.layout.width === targetLayout.width &&
          w.layout.height === targetLayout.height
      );
      const startWidgetIndex = newWindowManifest.widgets.findIndex(
        (w) =>
          w.layout.x === startLayout.x &&
          w.layout.y === startLayout.y &&
          w.layout.width === startLayout.width &&
          w.layout.height === startLayout.height
      );
      if (targetWidgetIndex !== -1) {
        newWindowManifest.widgets[targetWidgetIndex].layout = startLayout;
      }
      newWindowManifest.widgets[startWidgetIndex].layout = targetLayout;

      this.store.dispatch(DashboardActions.updateDashboardManifest({ manifest: newWindowManifest }));
    }
  }
}
