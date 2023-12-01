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

  static getMatchingLayer(paramLayer: string, doc?: Document) {
    if (doc) {
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
    }
    return null;
  }

  static allLayers(doc?: Document) {
    const result = [];
    if (doc) {
      const WMSCapability = XMLUtils.find(doc.childNodes, 'WMS_Capabilities');
      if (WMSCapability) {
        const Capabilities = XMLUtils.find(WMSCapability.childNodes, 'Capability');
        if (Capabilities) {
          const layerBloc = XMLUtils.find(Capabilities.childNodes, 'Layer');
          if (layerBloc && layerBloc.childNodes) {
            for (let i = 0; i < layerBloc.childNodes.length; i++) {
              const node = layerBloc.childNodes[i];
              if (node.nodeName === 'Layer') {
                result.push(node);
              }
            }
          }
        }
      }
    }
    return result;
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

  static getPossibleLayerStyles(doc?: Document): {
    [param: string]: { param: string; styles: { id: string; label: string }[] };
  } | null {
    if (!doc) {
      return {};
    }
    const layers = XMLUtils.allLayers(doc);
    return (
      layers.map((layer) => {
        const layerName = XMLUtils.find(layer.childNodes, 'Name')?.textContent ?? '';
        const styles = XMLUtils.findAll(layer.childNodes, 'Style');
        const stylesArray = styles.map((style) => ({
          id: XMLUtils.find(style.childNodes, 'Name')?.textContent,
          label:
            XMLUtils.find(style.childNodes, 'Title')?.textContent ??
            XMLUtils.find(style.childNodes, 'Name')?.textContent
        })) as { id: string; label: string }[];
        const uniquesStyles = [...new Set(stylesArray.map((style) => style.id))].map((styleId) =>
          stylesArray.find((styleInArray) => styleInArray.id === styleId)
        );
        return {
          param: layerName,
          styles: uniquesStyles
        };
      }) as { param: string; styles: { id: string; label: string }[] }[]
    ).reduce((p, c) => ({ ...p, [c.param]: c }), {});
  }
}
