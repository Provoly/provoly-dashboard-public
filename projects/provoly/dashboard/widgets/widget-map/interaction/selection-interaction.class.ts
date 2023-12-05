import { Store } from '@ngrx/store';
import { DashboardActions, widgetMapConfig } from '@provoly/dashboard';
import { Feature, Map, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry, Polygon } from 'ol/geom';
import PointerInteraction from 'ol/interaction/Pointer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import RenderBox from 'ol/render/Box';
import VectorSource from 'ol/source/Vector';
import { Fill, Style } from 'ol/style';
import { BehaviorSubject } from 'rxjs';

export class SelectionInteraction extends PointerInteraction {
  private coordinates: number[] | null;
  private features: string[];
  selectionType$ = new BehaviorSubject<'click' | 'lasso' | 'rectangle' | 'zoom' | 'move'>('move');
  private store?: Store;
  private currentRectangle = new RenderBox('ol-rectangle-selection');
  private overlayForLasso: VectorLayer<any>;
  private lassoCoordinates: number[][] = [];
  private currentLassoFeature: Feature<Polygon> | null = null;
  private actions: ('click' | 'lasso' | 'rectangle' | 'zoom' | 'move')[] = [];

  selectionStyle = new Style({
    fill: new Fill({
      color: 'rgba(251, 198, 199, 0.5)'
    })
  });

  constructor() {
    super({});

    this.coordinates = null;
    this.features = [];
    widgetMapConfig.actions$.subscribe((actions) => {
      // @ts-ignore
      this.actions = actions.filter((action) => action !== 'export' && action !== 'upload');
      this.selectionType$.next(this.actions[0]);
    });
    this.overlayForLasso = new VectorLayer({
      source: new VectorSource({
        useSpatialIndex: false,
        wrapX: false,
        features: []
      }),
      style: this.selectionStyle,
      updateWhileInteracting: true
    });
  }

  init(store: Store) {
    this.store = store;
    return this;
  }

  override handleDownEvent(evt: MapBrowserEvent<MouseEvent>) {
    const map = evt.map;

    if (this.selectionType$.getValue() === 'move') {
      return false;
    }

    if (this.selectionType$.getValue() === 'click') {
      this.features = [
        ...new Set(
          map
            .getFeaturesAtPixel(evt.pixel)
            .map((feature) => feature.get('id'))
            .filter((id) => !!id)
        )
      ];
      // Click and move are collisionning. Need to make another button if needed right now click is aborted
      return true;
    }

    if (['rectangle', 'zoom'].includes(this.selectionType$.getValue())) {
      this.coordinates = evt.pixel;
      this.currentRectangle.setMap(evt.map);
      this.currentRectangle.setPixels(this.coordinates, this.coordinates);
    }

    if (this.selectionType$.getValue() === 'lasso') {
      this.getMap()?.addLayer(this.overlayForLasso);
      this.lassoCoordinates = [evt.coordinate];
      if (!this.currentLassoFeature) {
        this.currentLassoFeature = new Feature(new Polygon(this.getPolygonCoordinates(this.lassoCoordinates)));
        this.overlayForLasso.getSource().addFeature(this.currentLassoFeature);
      }
    }

    return true;
  }

  getPolygonCoordinates(coordinates: number[][]) {
    return [coordinates.concat(coordinates[0])];
  }

  override handleDragEvent(evt: MapBrowserEvent<MouseEvent>) {
    if (['rectangle', 'zoom'].includes(this.selectionType$.getValue())) {
      this.currentRectangle.setPixels(this.coordinates ?? [0, 0], evt.pixel);
      return true;
    }
    if (this.selectionType$.getValue() === 'lasso') {
      this.lassoCoordinates.push(evt.coordinate);
      this.currentLassoFeature?.getGeometry()?.setCoordinates(this.getPolygonCoordinates(this.lassoCoordinates));
      return true;
    }
    return false;
  }

  override handleUpEvent() {
    if (this.selectionType$.getValue() === 'click' && this.features.length > 0) {
      this.store?.dispatch(DashboardActions.selectMany({ ids: this.features }));
    }

    if (this.selectionType$.getValue() === 'lasso') {
      const geometry = this.currentLassoFeature?.getGeometry();

      const boxFeatures = this.getMap()
        ?.getAllLayers()
        .filter(
          (layer) =>
            !(layer instanceof VectorTileLayer) &&
            !(layer instanceof TileLayer) &&
            layer?.getSource() instanceof VectorSource
        )
        .map((layer) =>
          (layer?.getSource() as VectorSource)
            ?.getFeatures()
            .filter((features: Feature<any>) => !!features.get('id'))
            .filter((feature: Feature<any>) => {
              switch (feature.get('type')) {
                case 'point':
                case 'marker':
                  return geometry?.intersectsCoordinate(feature.getGeometry().getCoordinates());
                case 'bubble':
                  return feature
                    .getGeometry()
                    .getCenter()
                    .map((coords: Coordinate) => geometry?.intersectsCoordinate(coords))
                    .reduce((a: boolean, b: boolean) => a || b, false);
                case 'line':
                  return feature
                    .getGeometry()
                    .getCoordinates()
                    .map((coords: Coordinate) => geometry?.intersectsCoordinate(coords))
                    .reduce((a: boolean, b: boolean) => a || b, false);
                case 'polygon':
                  return feature
                    .getGeometry()
                    .getCoordinates()[0]
                    .map((coords: Coordinate) => geometry?.intersectsCoordinate(coords))
                    .reduce((a: boolean, b: boolean) => a || b, false);
                default:
                  return false;
              }
            })
        )
        .reduce((p, c) => [...p, ...c], []);

      const ids = [
        ...new Set(
          boxFeatures?.map((feature: Feature<Geometry>) => feature.get('id') as string).filter((id: string) => !!id)
        )
      ] as string[];

      this.store?.dispatch(DashboardActions.selectMany({ ids }));

      this.getMap()?.removeLayer(this.overlayForLasso);
      this.lassoCoordinates = [];
    }

    if (this.selectionType$.getValue() === 'rectangle') {
      this.currentRectangle.setMap(null as unknown as Map);

      const extent = this.currentRectangle.getGeometry().getExtent();
      const boxFeatures = this.getMap()
        ?.getLayers()
        .getArray()
        // @ts-ignore
        .map((layer) => layer.getSource())
        .map((source) => (source.getFeaturesInExtent ? source.getFeaturesInExtent(extent) : []))
        .reduce((p, c) => [...p, ...c], [])
        .filter(
          (feature: any) => !!feature.getGeometry().intersectsExtent && feature.getGeometry().intersectsExtent(extent)
        );

      const ids = [
        ...new Set(
          boxFeatures.map((feature: Feature<Geometry>) => feature.get('id') as string).filter((id: string) => !!id)
        )
      ] as string[];

      this.store?.dispatch(DashboardActions.selectMany({ ids }));
    }

    if (this.selectionType$.getValue() === 'zoom') {
      this.currentRectangle.setMap(null as unknown as Map);

      const extent = this.currentRectangle.getGeometry().getExtent();
      this.getMap()
        ?.getView()
        .fit(extent, { padding: [20, 20, 70, 70], duration: 200 });
    }

    if (this.selectionType$.getValue() === 'lasso') {
      this.getMap()?.removeLayer(this.overlayForLasso);
    }

    this.changeSelection(this.actions[0]);
    this.coordinates = null;
    this.features = [];

    return false;
  }

  changeSelection(type: string) {
    this.selectionType$.next(type as 'click' | 'lasso' | 'rectangle' | 'zoom' | 'move');
  }
}
