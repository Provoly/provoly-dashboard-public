import { Feature, Map } from 'ol';
import FeatureFormat from 'ol/format/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { randomColor, styleFunction } from './random-color-style.function';

export class ReadAsText {
  reader: FileReader;
  map!: Map;

  constructor(private parser: FeatureFormat) {
    this.reader = new FileReader();
  }

  withMap(map: Map) {
    this.map = map;
    return this;
  }

  apply(file: any, resolve: (r: any) => void, reject: (e: any) => void) {
    this.reader.readAsText(file, 'UTF-8');
    this.reader.onload = (evt) => {
      resolve(
        new VectorLayer({
          source: new VectorSource({
            features: this.parser.readFeatures(evt.target?.result, {
              featureProjection: this.map.getView().getProjection()
            }) as Feature<any>[]
          }),
          style: styleFunction(randomColor())
        })
      );
    };
    this.reader.onerror = (err) => {
      reject({ msg: 'ReadAsText: ' + err, val: {} });
    };
  }
}
