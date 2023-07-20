import JSZip from 'jszip';
import { Feature, Map } from 'ol';
import { KML } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export class KmzZipReader {
  reader: JSZip;
  map!: Map;
  fileInsideZipExtension: string;
  parser: KML;

  constructor() {
    this.reader = new JSZip();
    this.fileInsideZipExtension = '.kml';
    this.parser = new KML();
  }

  withMap(map: Map) {
    this.map = map;
    return this;
  }

  apply(file: any, resolve: (r: any) => void, reject: (e: any) => void) {
    this.reader.loadAsync(file).then((zip) => {
      let entry: JSZip.JSZipObject | null = null;
      let imageReplacements: Promise<{ name: string; image: string }>[] = [];
      zip.forEach((path, zipEntry) => {
        if (zipEntry.name.endsWith(this.fileInsideZipExtension)) {
          entry = zipEntry;
        }
        const split = zipEntry.name.toLowerCase().split('.');
        const extention = split[split.length - 1];

        if (['png', 'jpeg'].includes(extention)) {
          imageReplacements.push(
            new Promise((resolveS) => {
              zipEntry.async('arraybuffer').then((buffer) => {
                resolveS({
                  name: zipEntry.name,
                  image: window.URL.createObjectURL(new Blob([buffer], { type: `image/${extention}` }))
                });
              });
            })
          );
        }
      });

      if (entry === null) {
        reject({ msg: '@pry.widget.map.importNotFoundInZip', val: { extension: this.fileInsideZipExtension } });
      } else {
        Promise.all(imageReplacements).then((replacements) => {
          entry?.async('string').then((buffer) => {
            let replacedBuffer = buffer;
            replacements.forEach(
              (replacement) => (replacedBuffer = replacedBuffer.replace(replacement.name, replacement.image))
            );
            resolve(
              new VectorLayer({
                source: new VectorSource({
                  features: this.parser.readFeatures(replacedBuffer, {
                    featureProjection: this.map.getView().getProjection()
                  }) as Feature<any>[]
                })
              })
            );
          });
        });
      }
    });
  }
}
