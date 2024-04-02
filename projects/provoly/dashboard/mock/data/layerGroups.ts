import { LayerGroup, MapWidgetLayerOptions, MapWidgetOptions } from '@provoly/dashboard';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

export const layerGroups: LayerGroup[] = [
  {
    name: 'red',
    singleLayer: false,
    visibleLayers: []
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
