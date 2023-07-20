import { Map } from 'ol';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { KmzZipReader } from './kmz-zip-reader.class';
import { ReadAsText } from './read-as-text.class';
import { ShpZipReader } from './shp-zip-reader.class';

export class MapFormatsReader {
  formats = {
    gpx: new ReadAsText(new GPX()),
    geojson: new ReadAsText(new GeoJSON()),
    igc: new ReadAsText(new IGC()),
    kml: new ReadAsText(new KML()),
    kmz: new KmzZipReader(),
    'kml.zip': new KmzZipReader(),
    topojson: new ReadAsText(new TopoJSON()),
    'shp.zip': new ShpZipReader()
  } as { [extension: string]: ReadAsText | KmzZipReader | ShpZipReader };
  map: Map;

  constructor(map: Map) {
    this.map = map;
  }

  decodeFile(file: any): Promise<VectorLayer<VectorSource<Geometry>>> {
    return new Promise((resolve, reject) => {
      const split = file.name.split('.');
      let extension = split[split.length - 1] as string;
      if (extension === 'zip') {
        extension = `${split[split.length - 2]}.${split[split.length - 1]}`;
      }

      if (!this.formats[extension]) {
        reject({
          msg: '@pry.widget.map.importError',
          val: { extension, authorizedFormats: Object.keys(this.formats).join(', ') }
        });
        return;
      }

      this.formats[extension].withMap(this.map).apply(file, resolve, reject);
    });
  }
}
