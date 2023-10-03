import { Map } from 'ol';
import { WidgetMapLayerService } from './widget-map-layer.service';

describe('WidgetMapLayerService', () => {
  let service: WidgetMapLayerService;

  beforeEach(async () => {
    service = new WidgetMapLayerService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should show all implementations', () => {
    expect(service.implementationList).toEqual([
      'auto',
      'heatmap',
      'marker',
      'point',
      'line',
      'multi-line',
      'polygon',
      'multi-polygon',
      'bubble',
      'relation',
      'wms',
      'wmts',
      'featurelayer',
      'vectortile',
      'rastertile'
    ]);
  });

  it('should create layers', () => {
    service.implementationList.forEach((impl) => {
      expect(
        // @ts-ignore
        service.layersImplementation[impl](
          impl === 'auto' ? { subType: 'Point' } : {},
          { locationAttribute: 'test' },
          [],
          {},
          { min: 0, max: 1 },
          {},
          new Map({})
        )
      ).toBeDefined();
    });
  });
});
