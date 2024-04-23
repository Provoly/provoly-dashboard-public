import { ContextMenuActions } from '@provoly/dashboard';
import { ScaleLine } from 'ol/control';
import { toLonLat } from 'ol/proj';
// This is not a circular dependency
import type { WidgetMapComponent } from '../component/widget-map.component';
import { SelectionInteraction } from './selection-interaction.class';

export class InteractionManager {
  scaleControl?: ScaleLine;
  selectionInteraction = new SelectionInteraction();
  private component!: WidgetMapComponent;

  init(component: WidgetMapComponent) {
    this.component = component;
    this.addContextMenuInteraction();
    this.addScaleControl();
    this.addUpdateZoomAndCenter();
    this.component.map.addInteraction(this.selectionInteraction.init(this.component.store));
    return this;
  }

  listeners = {
    contextMenu: (e: MouseEvent) => {
      if (this.component.manifest.contextMenu !== false) {
        const mapCoordinates = this.component.map.getEventPixel(e);
        const itemId = this.component.map.forEachFeatureAtPixel(mapCoordinates, (feature: any) => feature.get('id'));
        this.component.store.dispatch(
          ContextMenuActions.open({
            itemId,
            clientX: e.clientX,
            clientY: e.clientY,
            resultSet: Array.isArray(this.component.manifest.datasource)
              ? this.component.manifest.datasource[0]
              : this.component.manifest.datasource,
            from: 'map',
            coordinates: toLonLat(
              this.component.map.getCoordinateFromPixel(mapCoordinates),
              this.component.map.getView().getProjection()
            ).reverse(),
            allowObjectCreation: false
          })
        );
        e.preventDefault();
      }
    }
  };

  private addContextMenuInteraction() {
    this.component.map.getViewport().addEventListener('contextmenu', this.listeners.contextMenu);
  }

  private addScaleControl() {
    if (!this.scaleControl) {
      this.scaleControl = new ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4,
        text: true,
        minWidth: 140,
        dpi: 90
      });
      this.component.map.addControl(this.scaleControl);
    }
  }

  private addUpdateZoomAndCenter() {
    this.component.map.on('moveend', () => {
      this.component.optionsCopy.zoom = {
        start:
          this.component.map.getView().getZoom() ??
          this.component.optionsCopy.zoom?.start ??
          this.component.map.getView().getMinZoom(),
        min: this.component.map.getView().getMinZoom(),
        max: this.component.map.getView().getMaxZoom()
      };
      this.component.optionsCopy.center =
        toLonLat(this.component.map.getView().getCenter() ?? [0, 0]) ?? this.component.optionsCopy.center;
      this.component.zoomAndCenter$.next({
        zoom: this.component.optionsCopy.zoom,
        center: this.component.optionsCopy.center
      });
    });
  }
}
