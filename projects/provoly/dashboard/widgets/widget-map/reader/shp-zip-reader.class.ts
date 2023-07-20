import FeatureFormat from 'ol/format/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature, Map } from 'ol';
import { GeoJSON } from 'ol/format';
import { parseZip } from 'shpjs';
import { Buffer } from 'buffer';

export class ShpZipReader extends FeatureFormat {
  parser = new GeoJSON();
  map!: Map;

  constructor() {
    super();
  }

  withMap(map: Map) {
    this.map = map;
    return this;
  }

  apply(file: any, resolve: (r: any) => void, reject: (e: any) => void) {
    file
      .arrayBuffer()
      .then((buffer: ArrayBuffer) => {
        parseZip(Buffer.from(buffer))
          .then((geojson) => {
            resolve(
              new VectorLayer({
                source: new VectorSource({
                  features: this.parser.readFeatures(geojson, {
                    featureProjection: this.map.getView().getProjection()
                  }) as Feature<any>[]
                })
              })
            );
          })
          .catch((err) => reject({ msg: 'ShpZipReader: ' + err, val: {} }));
      })
      .catch((err: any) => reject({ msg: 'ShpZipReader: ' + err, val: {} }));
  }
}
