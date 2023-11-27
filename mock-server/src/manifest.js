const fs = require('fs');
const casual = require('casual');

const manifests = JSON.parse(fs.readFileSync('./data/manifests.json', 'utf8')).map((manifest) => {
  manifest.id = manifest.id ?? casual.uuid;
  manifest.creationDate = new Date(casual.unix_time * 1000);
  manifest.modificationDate = new Date(casual.unix_time * 1000);
  return manifest;
});

const metadatas = JSON.parse(fs.readFileSync('./data/metadatas.json', 'utf8'));

let defaultManifest = '--no--default--manifest';

module.exports = {
  list: () => {
    return manifests.map((manifest, idx) => {
      return {
        id: manifest.id,
        name: manifest.name,
        description: manifest.description ?? `Description de ${manifest.name}`,
        manifestUrl: `/dashboard/manifest/${manifest.name}`,
        creationDate: manifest.creationDate,
        modificationDate: manifest.modificationDate,
        image: manifest.image ?? '/assets/svgs/default.svg',
        visibility: manifest.visibility ?? { type: 'PRIVATE' },
        default: manifest.id === defaultManifest,
        owner: true,
        cover: casual.boolean,
        datasource: [
          ...new Set(
            manifest.manifest.windows
              .map((window) => window.widgets.map((widget) => widget.datasource))
              .flat(3)
              .filter((dataset) => !!dataset)
          )
        ],
        metadata: [
          {
            metadataDef: {
              ...metadatas.find((metadata) => metadata.name === '_theme')
            },
            value: metadatas.find((metadata) => metadata.name === '_theme').allowedValues[
              casual.integer(0, metadatas.find((metadata) => metadata.name === '_theme').allowedValues.length - 1)
            ]
          }
        ]
      };
    });
  },
  get: (id) => {
    let manifestById = (manifests.find((manifest) => manifest.id === id) || {}).manifest;
    if (!manifestById) {
      // allow searching by name
      manifestById = (manifests.find((manifest) => manifest.name === id) || {}).manifest;
    }
    return manifestById;
  },
  delete: (id) =>
    manifests.splice(
      manifests.findIndex((manifest) => manifest.id === id),
      1
    ),
  save: (id, name, description, creationDate, modificationDate, manifest, image, visibility) => {
    console.log(JSON.stringify(manifest));
    let previous = manifests.find((m) => m.id === id);
    if (!previous) {
      manifests.push({});
      previous = manifests[manifests.length - 1];
      let date = new Date().toISOString();
      previous.creationDate = date;
      previous.modificationDate = date;
    } else {
      previous.modificationDate = new Date().toISOString();
    }
    previous.id = !!id ? id : casual.uuid;
    previous.name = name;
    previous.description = description;
    previous.manifest = manifest;
    previous.image = image;
    previous.visibility = visibility;
  },
  default: (id) => {
    defaultManifest = id;
  }
};
