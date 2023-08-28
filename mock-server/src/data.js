const fs = require('fs');
const relations = require('./relations');
const casual = require('casual');

const classes = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
let datasetVersions = JSON.parse(fs.readFileSync('./data/datasetVersions.json', 'utf8'));
const classesIds = classes.map((oClass) => oClass.id);
let fields = JSON.parse(fs.readFileSync('./data/fields.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
const infrastructures = JSON.parse(fs.readFileSync('./data/infrastructures.json', 'utf8'));
const inputFlows = JSON.parse(fs.readFileSync('./data/inputFlows.json', 'utf8'));
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
const integrationErrors = JSON.parse(fs.readFileSync('./data/integrationErrors.json', 'utf8'));
const tasksDetailed = JSON.parse(fs.readFileSync('./data/tasksDetailed.json', 'utf8'));
const procedures = JSON.parse(fs.readFileSync('./data/procedures.json', 'utf8'));
const customClassJson = JSON.parse(fs.readFileSync('./data/customClass.json', 'utf8'));
const widgetList = JSON.parse(fs.readFileSync('./data/catalog.json', 'utf8'));
let datasets = JSON.parse(fs.readFileSync('./data/datasets.json', 'utf8'));
let transfos = JSON.parse(fs.readFileSync('./data/transfos.json', 'utf8'));
let departements = JSON.parse(fs.readFileSync('./data/departements.json', 'utf8'));

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

const businessData = () => {
  const idxClassWrongDate = casual.integer((from = 0), (to = classes.length - 1));
  return classes.map((clazz, idx) => ({
    id: clazz.id,
    name: clazz.name,
    icon: clazz.image,
    count: casual.integer((from = 0), (to = 10000)),
    date: idx === idxClassWrongDate ? null : casual.date('YYYY-MM-DDTHH:mm:ss.sssZ')
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
  widgetList.push(widget);
};

const importData = (file, dataset, code) => {
  const exampleErrors = [
    {
      numberOfLines: 0,
      itemErrors: { 0: [{ code: 'FILE_MANDATORY' }] }
    },
    {
      numberOfLines: 1000,
      itemErrors: {
        1: [{ code: 'CAST', params: { name: 'a2', type: 'integer' } }]
      }
    },
    {
      numberOfLines: 1,
      itemErrors: {
        0: [{ code: 'NB_ATTRIBUTES' }, { code: 'UNRECOGNIZED', params: { name: 'bad column name' } }]
      }
    },
    {
      numberOfLines: 0,
      itemErrors: {
        0: [{ code: 'ELASTIC_SEARCH', params: { elasticError: 'For input string: "a2"' } }]
      }
    }
  ];
  return code === 200
    ? { numberOfLines: 145, itemErrors: [] }
    : exampleErrors[Math.floor(Math.random() * exampleErrors.length)];
};
const getDatasetStatus = () => {
  return datasetState;
};

const getDatasets = () => {
  return datasets;
};

const saveDatasets = (dataset) => {
  datasets.push(dataset);
};

const updateDataset = (newDataset) => {
  datasets = datasets.map((dataset) => (dataset.id === newDataset.id ? newDataset : dataset));
};

const deleteDataset = (id) => {
  datasets = datasets.filter((dataset) => dataset.id !== id);
};

const getById = (id) => {
  const dataset = datasets.filter((dataset) => dataset.id === id);
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
  return datasets.find((dataset) => dataset.id === id).metadata || [];
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

const deleteField = (id) => {
  fields = fields.filter((field) => field.id !== id);
};

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

module.exports = {
  classes,
  classesIds,
  fields: {
    get: getFields,
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
  infrastructures,
  inputFlows,
  queryResponses,
  integrationErrors,
  tasksDetailed,
  procedures,
  queryResponseTypes,
  imageData,
  docData,
  datasetCount,
  businessData,
  itemsAsResultSet,
  itemsAsResultSetWithRelationsTo,
  customClassParams,
  updateCustomClassParams,
  importData,
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
  departements
};
