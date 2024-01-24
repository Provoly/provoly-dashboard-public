import { ContextMenuActions, TooltipMode } from '@provoly/dashboard';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { ScaleLine } from 'ol/control';
import { Circle, Point } from 'ol/geom';
import { toLonLat } from 'ol/proj';
// This is not a circular dependency
import type { WidgetMapComponent } from '../component/widget-map.component';
import { SelectionInteraction } from './selection-interaction.class';

export class InteractionManager {
  interactionPopupOverlay?: Overlay;
  scaleControl?: ScaleLine;
  selectionInteraction = new SelectionInteraction();
  public tooltipEvent?: MapBrowserEvent<MouseEvent>;
  private component!: WidgetMapComponent;

  init(component: WidgetMapComponent) {
    this.component = component;
    this.addContextMenuInteraction();
    this.addOverlayOnInteraction();
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
    },
    popup: (event: MapBrowserEvent<MouseEvent>) => {
      const values = this.component.map.getFeaturesAtPixel(event.pixel, { hitTolerance: 5 }) as (
        | Feature<Circle>
        | Feature<Point>
      )[];
      const valuesToDisplay = [...new Set(values.map((value) => value.get('id')).filter((id) => !!id))]
        .map((id) => values.find((value) => value.get('id') === id))
        .map((value) => ({
          oClass: value?.get('oClass'),
          coordinates: event.coordinate,
          values: value?.getKeys().reduce((p, c) => ({ ...p, [c]: value.get(c) }), {})
        }));
      this.component.classicFeatures$.next(valuesToDisplay);
      const wmsLayers = this.component.getWMSLayers();
      if (wmsLayers) {
        this.component.getFeatureFromServer(wmsLayers, event.coordinate);
      }
      this.tooltipEvent = event;
    }
  };

  private addContextMenuInteraction() {
    this.component.map.getViewport().addEventListener('contextmenu', this.listeners.contextMenu);
  }

  private addOverlayOnInteraction() {
    if (!this.interactionPopupOverlay) {
      this.interactionPopupOverlay = new Overlay({
        element: this.component.popup.nativeElement,
        offset: [9, 9]
      });
      this.component.map.addOverlay(this.interactionPopupOverlay);
    }
    if (this.component.optionsCopy.tooltipMode !== TooltipMode.NONE) {
      this.component.map.un('singleclick', this.listeners.popup);
      this.component.map.on('singleclick', this.listeners.popup);
    }
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
