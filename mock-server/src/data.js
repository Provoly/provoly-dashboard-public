const fs = require('fs');
const relations = require('./relations');
const casual = require('casual');

const classes = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
const classesIds = classes.map((oClass) => oClass.id);
let fields = JSON.parse(fs.readFileSync('./data/fields.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
const predicates = JSON.parse(fs.readFileSync('./data/predicates.json', 'utf8'));
const metadatas = JSON.parse(fs.readFileSync('./data/metadatas.json', 'utf8'));
const userMetadatas = JSON.parse(fs.readFileSync('./data/userMetadata.json', 'utf8'));
const rulesMetadatas = JSON.parse(fs.readFileSync('./data/rulesMetadata.json', 'utf8'));
const rules = JSON.parse(fs.readFileSync('./data/rules.json', 'utf8'));
const environments = JSON.parse(fs.readFileSync('./data/environments.json', 'utf8'));
const namedQueries = JSON.parse(fs.readFileSync('./data/namedQueries.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
const relationTypes = JSON.parse(fs.readFileSync('./data/relationTypes.json', 'utf8'));
const links = JSON.parse(fs.readFileSync('./data/links.json', 'utf8'));
const queryResponses = JSON.parse(fs.readFileSync('./data/queryResponses.json', 'utf8'));
const queryResponseTypes = JSON.parse(fs.readFileSync('./data/namedQueryReturnTypes.json', 'utf8'));
const tasksDetailed = JSON.parse(fs.readFileSync('./data/tasksDetailed.json', 'utf8'));
const procedures = JSON.parse(fs.readFileSync('./data/procedures.json', 'utf8'));
const customClassJson = JSON.parse(fs.readFileSync('./data/customClass.json', 'utf8'));
const widgetList = JSON.parse(fs.readFileSync('./data/catalog.json', 'utf8'));
let datasets = JSON.parse(fs.readFileSync('./data/datasets.json', 'utf8'));
let transfos = JSON.parse(fs.readFileSync('./data/transfos.json', 'utf8'));
let departements = JSON.parse(fs.readFileSync('./data/departements.json', 'utf8'));

const getClasses = () =>
  classes.map((oClass) => ({
    ...oClass,
    attributes: oClass.attributes.map((attr) => ({ ...attr, technicalName: attr.technicalName ?? attr.name }))
  }));

Object.keys(queryResponses).forEach((key) => {
  if (typeof queryResponses[key] === 'string') {
    queryResponses[key] = JSON.parse(fs.readFileSync(`./data/responses/${queryResponses[key]}`, 'utf8'));
  }
});

const itemsAsResultSet = (items) => {
  const classes = [...new Set(items.map((res) => res.oClass))];
  const result = {
    items: {},
    relations: [
      ...relations.generateRandomRelations(items),
      ...items.map((item) => relations.invisibleObjectRelations(item.id)).reduce((p, c) => [...p, ...c], [])
    ]
  };
  classes.forEach((classId) => (result.items[classId] = items.filter((result) => result.oClass === classId)));
  const counts = Object.keys(result.items).map((classId) => {
    const biggerRs = casual.boolean;
    const count = result.items[classId].length + (biggerRs ? casual.integer((from = 10000), (to = 100000)) : 0);
    return { [classId]: { count, accurate: count < 10000 } };
  });
  result.count = {};
  counts.forEach((c) => {
    Object.keys(c).forEach((key) => (result.count[key] = c[key]));
  }, {});
  return result;
};

const itemsAsResultSetWithRelationsTo = (items, id) => {
  const classes = [...new Set(items.map((res) => res.oClass))];
  const result = {
    items: {},
    relations: [...relations.generateRelationsTo(items, id), ...relations.invisibleObjectRelations(id)]
  };
  classes.forEach((classId) => (result.items[classId] = items.filter((result) => result.oClass === classId)));
  return result;
};

const datasetCount = () => {
  return classes.map((clazz) => ({
    id: clazz.id,
    count: casual.integer((from = 0), (to = 100))
  }));
};

const imageData = (value) => {
  if (fs.existsSync(`./images/${value}`)) {
    return fs.readFileSync(`./images/${value}`);
  }
};

const typeFromExtension = {
  png: 'image/png',
  svg: 'image/svg',
  mp4: 'video/mp4'
};

const docData = (idAndAttribute) => {
  const files = fs.readdirSync(`./docs`);
  let max = files.length - 1;
  let min = 0;

  let index = Math.round(Math.random() * (max - min) + min);
  let file = files[index];

  const splitFilename = file.split('.');

  return { type: typeFromExtension[splitFilename[splitFilename.length - 1]], data: fs.readFileSync(`./docs/${file}`) };
};

const imagesData = () => {
  const data = fs.readdirSync(`./images`);
  return data
    .map((image) => ({ image, type: 'icon' }))
    .concat(...data.map((image) => ({ image, type: 'illustration' })));
};

const customClassParams = () => {
  const params = [];
  Object.keys(customClassJson).forEach((domain) => {
    Object.keys(customClassJson[domain]).forEach((classId) => {
      params.push({
        domain: domain,
        oClass: classId,
        content: JSON.stringify(customClassJson[domain][classId])
      });
    });
  });
  return params;
};

const updateCustomClassParams = (classId, domain, payload) => {
  if (!customClassJson[domain]) {
    customClassJson[domain] = {};
  }
  customClassJson[domain][classId] = payload;
};

const getWidgets = () => {
  return widgetList.map((widget) => ({
    ...widget,
    cover: casual.boolean
  }));
};

const saveWidget = (widget) => {
  const previous = widgetList.findIndex((w) => w.id === widget.id);
  if (previous === -1) {
    widgetList.push(widget);
  } else {
    widgetList[previous] = widget;
  }
};

const getAssociations = (id) => {
  const response = {
    associations: [],
    usedElsewhere: false
  };
  const howMany = casual.integer((from = 1), (to = 5));
  for (let i = 0; i < howMany; i++) {
    response.associations.push({
      id: casual.uuid,
      name: casual.word + ' ' + casual.word,
      type: casual.random_element(['DATASET', 'FIELD', 'OCLASS', 'DASHBOARD', 'ABAC', 'LINK', 'NAMED_QUERY', 'WIDGET'])
    });
  }

  return response;
};

const getDatasetStatus = () => {
  return datasetState;
};

const getDataSetWithMetadata = () => {
  return datasets.map((dataset) => ({
    ...dataset,
    metadata: dataset.metadata.map((meta) => {
      const metadataRef = metadatas.find((metaRef) => metaRef.name === meta.metadataDef.name);
      return {
        ...meta,
        metadataDef: { ...meta.metadataDef, readOnly: metadataRef?.readOnly, system: metadataRef?.system }
      };
    })
  }));
};

const getDatasets = () => {
  return getDataSetWithMetadata();
};

const saveDatasets = (dataset) => {
  datasets.push({ ...dataset, metadata: dataset.metadata ?? [] });
};

const updateDataset = (newDataset) => {
  datasets = getDataSetWithMetadata().map((dataset) => (dataset.id === newDataset.id ? newDataset : dataset));
  return [
    undefined,
    {
      conflictGroupsByEntity: {
        's6406e7e-37cd-41ce-b5fc-36d233e6ae5c': ['conflict group', 'AUTHENTICATED'],
        'dashboard-id': ['conflict group']
      }
    }
  ][casual.integer(0, 1)];
};

const deleteDataset = (id) => {
  datasets = getDataSetWithMetadata().filter((dataset) => dataset.id !== id);
};

const getById = (id) => {
  const dataset = getDataSetWithMetadata().filter((dataset) => dataset.id === id);
  if (dataset[0]) {
    return dataset[0];
  }
  return {};
};

const getTransformations = () => {
  return transfos;
};

const getTransformation = (id) => {
  return transfos.find((transfo) => transfo.id === id);
};

const saveTransformation = (payload) => {
  if (transfos.find((transfo) => transfo.id === payload.id)) {
    transfos = transfos.map((transfo) =>
      transfo.id === payload.id ? { ...transfo, title: payload.title, description: payload.description } : transfo
    );
  } else {
    transfos.push({
      ...payload,
      creationDate: new Date().toISOString()
    });
  }
};

const activateTransformation = (id) => {
  transfos = transfos.map((transfo) =>
    transfo.id === id
      ? {
          ...transfo,
          active: true,
          jobInstanceId: casual.uuid
        }
      : transfo
  );
};
const deactivateTransformation = (id) => {
  transfos = transfos.map((transfo) =>
    transfo.id === id
      ? {
          ...transfo,
          active: false,
          jobInstanceId: null
        }
      : transfo
  );
};
const getDatasetMetadata = (id) => {
  return getDataSetWithMetadata().find((dataset) => dataset.id === id).metadata || [];
};
const addDatasetMetadata = (datasetId, metadataId, payload) => {
  if (payload) {
    let dataset = datasets.find((obj) => obj.id === datasetId);
    if (dataset) {
      let datasetMetadata = dataset.metadata.find((obj) => obj.metadataDef.id === metadataId);
      if (datasetMetadata) {
        datasetMetadata.value = payload.value;
      } else {
        let metadata = metadatas.find((x) => x.id === metadataId);
        dataset.metadata.push({ metadataDef: metadata, value: payload.value });
      }
    }
  }
};
const deleteDatasetMetadata = (datasetId, metadataId) => {
  let dataset = datasets.find((obj) => obj.id === datasetId);
  if (dataset) {
    dataset.metadata = dataset.metadata.filter((meta) => meta.metadataDef.id !== metadataId);
  }
};

const getFields = () => {
  return fields;
};

const putFields = (field) => {
  return fields.push(field);
};

const generateDatasetVersions = () => {
  return getDataSetWithMetadata()
    .map((dataset) => {
      const versions = [];
      const howMany = casual.integer((from = 5), (to = 10));
      for (let i = 1; i < howMany; i++) {
        versions.push({
          id: casual.uuid,
          dataset: dataset.id,
          oClass: dataset.oClass,
          lastModified: '2023-07-12T14:28:16.089390Z',
          version: i,
          state: i > howMany - 4 ? 'ACTIVE' : casual.random_element(['ACTIVE', 'ERROR', 'INDEXING', 'INACTIVE']),
          withFile: false,
          metadata: [],
          hasWarnings: casual.boolean
        });
      }
      return versions;
    })
    .reduce((p, c) => [...p, ...c], [])
    .sort((ds1, ds2) => ds2.version - ds1.version)
    .map((version, idx, arr) => ({
      ...version,
      lastModified:
        idx === arr.length - 2
          ? new Date(new Date() - 50 * (15 * 60 * 60 * 1000)).toISOString()
          : new Date(new Date() - idx * (15 * 60 * 60 * 1000)).toISOString()
    }));
};

let datasetVersions = generateDatasetVersions();

const getDatasetVersions = () => {
  return datasetVersions;
};

const getDatasetVersionsByDatasetId = (id) => {
  return datasetVersions.filter((version) => version.dataset === id);
};

const deactivateDatasetVersion = (id) => {
  datasetVersions.find((datasetVersion) => datasetVersion.id === id).state = 'INACTIVE';
  return datasetVersions;
};

const activateDatasetVersion = (id) => {
  datasetVersions.find((datasetVersion) => datasetVersion.id === id).state = 'ACTIVE';
  return datasetVersions;
};
const deleteField = (id) => {
  fields = fields.filter((field) => field.id !== id);
};

const getGroups = () => [
  {
    id: casual.uuid,
    name: 'ALL',
    system: true
  },
  {
    id: casual.uuid,
    name: 'AUTHENTICATED',
    system: true
  },
  {
    id: casual.uuid,
    name: 'custom group',
    system: true
  }
];

module.exports = {
  class: {
    get: getClasses,
    ids: classesIds
  },
  fields: {
    get: getFields,
    put: putFields,
    delete: deleteField
  },
  categories,
  predicates,
  metadatas,
  userMetadatas,
  rulesMetadatas,
  rules,
  imagesData,
  environments,
  namedQueries,
  users,
  relationTypes,
  links,
  queryResponses,
  tasksDetailed,
  procedures,
  queryResponseTypes,
  imageData,
  docData,
  datasetCount,
  itemsAsResultSet,
  itemsAsResultSetWithRelationsTo,
  customClassParams,
  updateCustomClassParams,
  widgets: {
    get: getWidgets,
    save: saveWidget
  },
  datasetStatus: {
    get: getDatasetStatus
  },
  dataset: {
    get: getDatasets,
    save: saveDatasets,
    update: updateDataset,
    delete: deleteDataset,
    getById: getById,
    getMetadata: getDatasetMetadata,
    addMetadata: addDatasetMetadata,
    deleteMetadata: deleteDatasetMetadata
  },
  datasetVersions: {
    get: getDatasetVersions,
    getById: getDatasetVersionsByDatasetId,
    activate: activateDatasetVersion,
    deactivate: deactivateDatasetVersion
  },
  transformations: {
    get: getTransformations,
    getById: getTransformation,
    save: saveTransformation,
    activate: activateTransformation,
    deactivate: deactivateTransformation
  },
  departements,
  association: {
    get: getAssociations
  },
  getGroups: getGroups
};
