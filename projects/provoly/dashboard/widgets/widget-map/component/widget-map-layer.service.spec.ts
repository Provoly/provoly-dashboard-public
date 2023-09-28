import { WidgetMapLayerService } from '@provoly/dashboard/widgets/widget-map';
import { Map } from 'ol';

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
          {},
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
