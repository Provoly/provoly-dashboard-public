import { LayerGroup } from '@provoly/dashboard';
import { DEFAULT_LAYER_GROUP } from '@provoly/dashboard/widgets/widget-map';

export const mockLayerGroups: LayerGroup[] = [
  {
    name: DEFAULT_LAYER_GROUP,
    singleLayer: true,
    visibleLayers: ['@pry.widget.map.layerType.point']
  },
  {
    name: 'red',
    singleLayer: false,
    visibleLayers: ['red-layer-1', 'red-layer-2']
  },
  {
    name: 'green',
    singleLayer: false,
    visibleLayers: []
  },
  {
    name: 'blue',
    singleLayer: false,
    visibleLayers: []
  }
];
