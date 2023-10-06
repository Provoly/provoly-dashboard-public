import { DEFAULT_PROJECTION } from '@provoly/dashboard';
import { Map } from 'ol';
import { get as getProjection, transform } from 'ol/proj';

export class XMLUtils {
  static find(childs: NodeListOf<ChildNode>, name: string) {
    if (!!childs) {
      for (let i = 0; i < childs.length; i++) {
        const node = childs[i];
        if (node.nodeName === name) {
          return node;
        }
      }
    }
    return null;
  }

  static findAll(childs: NodeListOf<ChildNode>, name: string) {
    const result = [];
    for (let i = 0; i < childs.length; i++) {
      const node = childs[i];
      if (node.nodeName === name) {
        result.push(node);
      }
    }
    return result;
  }

  static findWith(childs: NodeListOf<ChildNode>, attribute: string, value: string) {
    for (let i = 0; i < childs.length; i++) {
      const node = childs[i];
      const attrNode = XMLUtils.find(node.childNodes, attribute);
      if (attrNode?.textContent === value) {
        return node;
      }
    }
    return null;
  }

  static getMatchingLayer(paramLayer: string, doc: Document) {
    const WMSCapability = XMLUtils.find(doc.childNodes, 'WMS_Capabilities');
    if (WMSCapability) {
      const Capabilities = XMLUtils.find(WMSCapability.childNodes, 'Capability');
      if (Capabilities) {
        const Layer = XMLUtils.find(Capabilities.childNodes, 'Layer');
        if (Layer) {
          let matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', paramLayer);
          const split = paramLayer.split(':');
          if (!matchingLayer && split.length >= 2) {
            // Try again, splitting on ":" in the name to ignore namespace if present
            matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', split[split.length - 1]);
          }
          return matchingLayer;
        }
      }
    }
    return null;
  }

  static getLayerExtent(paramLayer: string, map: Map, doc?: Document) {
    if (!doc) {
      return null;
    }
    const matchingLayer = XMLUtils.getMatchingLayer(paramLayer, doc);
    if (matchingLayer) {
      const boundingBox = XMLUtils.find(matchingLayer.childNodes, 'BoundingBox');
      if (boundingBox) {
        // @ts-ignore
        const attributes = boundingBox.attributes;
        const projBox = getProjection(attributes.CRS.textContent ?? DEFAULT_PROJECTION);
        if (projBox) {
          return [
            transform(
              [parseFloat(attributes.minx.textContent), parseFloat(attributes.miny.textContent)],
              projBox,
              map.getView().getProjection()
            ),
            transform(
              [parseFloat(attributes.maxx.textContent), parseFloat(attributes.maxy.textContent)],
              projBox,
              map.getView().getProjection()
            )
          ];
        }
      }
    }
    return null;
  }
}
