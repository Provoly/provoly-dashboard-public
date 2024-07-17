const http = require('http');
const axios = require('axios');
const url = require('url');
const formidable = require('formidable');

const router = require('find-my-way')({
  defaultRoute: (req, res) => {
    res.statusCode = 404;
    res.end();
  },
  onBadUrl: (path, req, res) => {
    res.statusCode = 400;
    res.end(`Bad path: ${path}`);
  },
  ignoreTrailingSlash: true
});

const dataModule = require('./data');
const errorModule = require('./errors');
const manifestModule = require('./manifest');
const fieldGeneratorModule = require('./field-generator');
const pipelineCheck = require('./pipeline');
const casual = require('casual');
const fs = require('fs');

const port = 8081;
const host = 'localhost';

function readPayload(req) {
  return new Promise((resolve) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      let body = '';
      req.on('data', function (data) {
        body += data.toString();
        if (body.length > 1e6) req.connection.destroy();
      });
      req.on('end', function () {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    } else {
      resolve(null);
    }
  });
}

function readQuery(req) {
  const splitted = (req.url.split('?')[1] || '').split('&');
  const query = {};
  splitted.forEach((split) => {
    const [key, value] = split.split('=');
    query[key] = value;
  });
  return query;
}

const makeResponseOk = (res, toBeSent, code) => {
  const sendCode = !!code ? code : 200;
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, File-Content-Type'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.writeHead(sendCode);
  return res.end(JSON.stringify(toBeSent));
};

const makeResponseImageOk = (res, toBeSent, code) => {
  const sendCode = !!code ? code : 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Content-type', 'image/png');
  res.writeHead(sendCode);
  return res.end(toBeSent, 'binary');
};

router.on(['OPTIONS', 'GET'], '/ref/about/version', (req, res, params) => {
  makeResponseOk(res, { applicationVersion: 'dev-7948fe8a', chartVersion: '0.7.132' });
});
router.on(['OPTIONS', 'GET'], '/data/about/version', (req, res, params) => {
  makeResponseOk(res, { applicationVersion: 'dev-9c9476a3', chartVersion: '0.7.134' });
});
router.on(['OPTIONS', 'GET'], '/replay/about/version', (req, res, params) => {
  makeResponseOk(res, { applicationVersion: 'dev-9c9476a3', chartVersion: '0.7.134' });
});
router.on(['OPTIONS', 'GET'], '/exec/about/version', (req, res, params) => {
  makeResponseOk(res, { applicationVersion: 'dev-9c9476a3', chartVersion: '0.7.134' });
});
router.on(['OPTIONS', 'GET'], '/transfo/about/version', (req, res, params) => {
  makeResponseOk(res, { applicationVersion: 'dev-9c9476a3', chartVersion: '0.7.134' });
});
router.on(['OPTIONS', 'GET'], '/ref/model/class', (req, res, params) => {
  makeResponseOk(res, dataModule.class.get());
});

router.on(['OPTIONS', 'GET'], '/ref/model/class/:id/associations', (req, res, params) => {
  makeResponseOk(res, dataModule.association.get(params.id));
});

router.on(['OPTIONS', 'PUT'], '/ref/model/class/id/:id/attribute', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      let classIndex = dataModule.class.get().findIndex((obj) => obj.id === params.id);
      if (classIndex !== -1) {
        let attributeIndex =
          dataModule.class.get()[classIndex].attributes.length > 0
            ? dataModule.class.get()[classIndex].attributes.findIndex((obj) => obj.id === payload.id)
            : -1;
        if (attributeIndex !== -1) {
          dataModule.class.get()[classIndex].attributes[attributeIndex].id = payload.id;
          dataModule.class.get()[classIndex].attributes[attributeIndex].name = payload.name;
          dataModule.class.get()[classIndex].attributes[attributeIndex].technicalName = payload.technicalName;
          dataModule.class.get()[classIndex].attributes[attributeIndex].field = payload.field;
          dataModule.class.get()[classIndex].attributes[attributeIndex].category = payload.category;
        } else {
          dataModule.class.get()[classIndex].attributes.push(payload);
        }
        fs.writeFileSync('./data/classes.json', JSON.stringify(dataModule.class.get(), null, 2));
      }
    }
    makeResponseOk(res);
  });
});
router.on('POST', '/ref/model/class', (req, res, params) => {
  readPayload(req).then((payload) => {
    let classIndex = dataModule.class.get().findIndex((obj) => obj.id === payload.id);
    if (classIndex !== -1) {
      dataModule.class.get()[classIndex].id = payload.id;
      dataModule.class.get()[classIndex].name = payload.name;
      dataModule.class.get()[classIndex].attributes = payload.attributes;
    } else {
      JSON.stringify(dataModule.class.get().push(payload));
    }
    fs.writeFileSync('./data/classes.json', JSON.stringify(dataModule.class.get(), null, 2));
    makeResponseOk(res);
  });
});
router.on('GET', '/ref/model/storages', (req, res, params) => {
  readPayload(req).then((payload) => makeResponseOk(res, ['ELASTIC', 'POSTGIS']));
});
router.on(['OPTIONS', 'GET'], '/ref/model/attribute/:id/associations', (req, res, params) => {
  makeResponseOk(res, dataModule.association.get(params.id));
});

router.on(['OPTIONS', 'DELETE'], '/ref/model/class/id/:id/attribute/id/:attrId', (req, res, params) => {
  let classIndex = dataModule.class.get().findIndex((obj) => obj.id === params.id);
  if (classIndex !== -1) {
    let attributeIndex =
      dataModule.class.get()[classIndex].attributes.length > 0
        ? dataModule.class.get()[classIndex].attributes.findIndex((obj) => obj.id === params.attrId)
        : -1;
    if (attributeIndex !== -1) {
      dataModule.class.get()[classIndex].attributes.splice(attributeIndex, 1);
    }
    fs.writeFileSync('./data/classes.json', JSON.stringify(dataModule.class.get(), null, 2));
  }
  makeResponseOk(res);
});

router.on(['OPTIONS', 'DELETE'], '/ref/model/class/id/:id', (req, res, params) => {
  let classIndex = dataModule.class.get().findIndex((obj) => obj.id === params.id);
  if (classIndex !== -1) {
    dataModule.class.get().splice(classIndex, 1);
    fs.writeFileSync('./data/classes.json', JSON.stringify(dataModule.class.get(), null, 2));
  }
  makeResponseOk(res);
});

router.on(['OPTIONS'], '/ref/model/fields', (req, res, params) => {
  makeResponseOk(res);
});

router.on(['GET'], '/ref/model/fields', (req, res, params) => {
  makeResponseOk(res, dataModule.fields.get());
});

router.on(['OPTIONS', 'GET'], '/ref/model/fields/:id/associations', (req, res, params) => {
  makeResponseOk(res, dataModule.association.get(params.id));
});

router.on(['POST'], '/ref/model/fields', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      dataModule.fields.post(payload);
      fs.writeFileSync('./data/fields.json', JSON.stringify(dataModule.fields.get(), null, 2));
    }
    makeResponseOk(res);
  });
});

router.on(['PUT'], '/ref/model/fields', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      dataModule.fields.put(payload);
    }
  });
  makeResponseOk(res);
});

router.on(['OPTIONS', 'DELETE'], '/ref/model/fields/:id', (req, res, params) => {
  dataModule.fields.delete(params.id);
  makeResponseOk(res);
});

router.on(['OPTIONS', 'GET'], '/ref/model/categories', (req, res, params) => {
  makeResponseOk(res, dataModule.categories);
});

router.on(['PUT'], '/ref/model/categories', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      let categoryIndex = dataModule.categories.findIndex((obj) => obj.id === payload.id);
      if (categoryIndex !== -1) {
        dataModule.categories[categoryIndex].id = payload.id;
        dataModule.categories[categoryIndex].name = payload.name;
      } else {
        JSON.stringify(dataModule.categories.push(payload));
      }
      fs.writeFileSync('./data/categories.json', JSON.stringify(dataModule.categories, null, 2));
    }
    makeResponseOk(res);
  });
});

router.on(['OPTIONS', 'GET'], '/ref/relation-types', (req, res, params) => {
  makeResponseOk(res, dataModule.relationTypes);
});

router.on('POST', '/ref/relation-types', (req, res, params) => {
  readPayload(req).then((payload) => {
    let linkIndex = dataModule.relationTypes.findIndex((obj) => obj.id === payload.id);
    if (linkIndex !== -1) {
      dataModule.relationTypes[linkIndex].name = payload.name;
    } else {
      JSON.stringify(dataModule.relationTypes.push(payload));
    }
    fs.writeFileSync('./data/relationTypes.json', JSON.stringify(dataModule.relationTypes, null, 2));
    makeResponseOk(res);
  });
});

router.on(['OPTIONS', 'DELETE'], '/ref/relation-types/id/:id', (req, res, params) => {
  let linkIndex = dataModule.relationTypes.findIndex((obj) => obj.id === params['id']);
  if (linkIndex !== -1) {
    dataModule.relationTypes.splice(linkIndex, 1);
    fs.writeFileSync('./data/relationTypes.json', JSON.stringify(dataModule.relationTypes, null, 2));
  }
  makeResponseOk(res);
});

router.on(['OPTIONS', 'GET'], '/ref/links', (req, res, params) => {
  makeResponseOk(res, dataModule.links);
});

router.on('POST', '/ref/links', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      JSON.stringify(dataModule.links.push(payload));
    }
    fs.writeFileSync('./data/links.json', JSON.stringify(dataModule.links, null, 2));
    makeResponseOk(res);
  });
});

router.on(['OPTIONS', 'GET'], '/ref/predicates', (req, res, params) => {
  makeResponseOk(res, dataModule.predicates);
});
router.on('POST', '/ref/predicates', (req, res, params) => {
  readPayload(req).then((payload) => {
    let predicateIndex = dataModule.predicates.findIndex((obj) => obj.id === payload.id);
    if (predicateIndex !== -1) {
      dataModule.predicates[predicateIndex].name = payload.name;
      dataModule.predicates[predicateIndex].value = payload.value;
    } else {
      JSON.stringify(dataModule.predicates.push(payload));
    }
    fs.writeFileSync('./data/predicates.json', JSON.stringify(dataModule.predicates, null, 2));
    makeResponseOk(res);
  });
});
router.on(['OPTIONS', 'GET'], '/ref/predicates/id/:id', (req, res, params) => {
  makeResponseOk(
    res,
    dataModule.predicates.find((pred) => pred.id === params.id)
  );
});

router.on(['OPTIONS', 'GET'], '/ref/users', (req, res, params) => {
  makeResponseOk(res, dataModule.users);
});

router.on(['OPTIONS', 'GET'], '/ref/users/id/:userId/metadata', (req, res, params) => {
  let userProfile = dataModule.users.find((user) => user.id === params['userId']).metadata || [];
  makeResponseOk(res, userProfile);
});

router.on(['OPTIONS', 'PUT'], '/ref/users/id/:userId/metadata/id/:metadataId', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      let userIndex = dataModule.users.findIndex((obj) => obj.id === params['userId']);
      if (userIndex !== -1) {
        let metaUserIndex = dataModule.users[userIndex].metadata.findIndex(
          (obj) => obj.userProfile.id === params['metadataId']
        );
        if (metaUserIndex !== -1) {
          dataModule.users[userIndex].metadata[metaUserIndex].value = payload.value;
        } else {
          let meta = dataModule.userMetadatas.find((x) => x.id === params['metadataId']);
          dataModule.users[userIndex].metadata.push({ userProfile: meta, value: payload.value });
        }
      }
      fs.writeFileSync('./data/users.json', JSON.stringify(dataModule.users, null, 2));
    }
    makeResponseOk(res);
  });
});

router.on(['DELETE'], '/ref/users/id/:userId/metadata/id/:metadataId', (req, res, params) => {
  let userIndex = dataModule.users.findIndex((obj) => obj.id === params['userId']);
  if (userIndex !== -1) {
    dataModule.users[userIndex].metadata = dataModule.users[userIndex].metadata.filter(
      (meta) => meta.userProfile.id !== params['metadataId']
    );
    fs.writeFileSync('./data/users.json', JSON.stringify(dataModule.users, null, 2));
  }
  makeResponseOk(res);
});

router.on(['OPTIONS', 'GET'], '/ref/users/metadata', (req, res, params) => {
  makeResponseOk(res, dataModule.userMetadatas);
});
router.on(['OPTIONS', 'GET'], '/ref/users/metadata/:uuid', (req, res, params) => {
  makeResponseOk(
    res,
    dataModule.userMetadatas.find((x) => x.id === params.uuid)
  );
});
router.on(
  'POST',
  '/ref/users/metadata',
  (req, res, params) => {
    readPayload(req).then((payload) => {
      let metadataIndex = dataModule.userMetadatas.findIndex((obj) => obj.id === payload.id);
      if (metadataIndex !== -1) {
        dataModule.userMetadatas[metadataIndex].name = payload.name;
        dataModule.userMetadatas[metadataIndex].type = payload.type;
        dataModule.userMetadatas[metadataIndex].allowedValues = payload.allowedValues;
        dataModule.userMetadatas[metadataIndex].description = payload.description;
      } else {
        JSON.stringify(dataModule.userMetadatas.push(payload));
      }
      fs.writeFileSync('./data/userMetadata.json', JSON.stringify(dataModule.userMetadatas, null, 2));
      makeResponseOk(res);
    });
  },
  '/ref/user/metadata'
);
router.on(['OPTIONS', 'GET'], '/ref/metadata', (req, res, params) => {
  makeResponseOk(res, dataModule.metadatas);
});

router.on(['OPTIONS', 'GET'], '/ref/metadata/id/:uuid', (req, res, params) => {
  makeResponseOk(
    res,
    dataModule.metadatas.find((x) => x.id === params.uuid)
  );
});

router.on(
  'POST',
  '/ref/metadata',
  (req, res, params) => {
    readPayload(req).then((payload) => {
      let metadataIndex = dataModule.metadatas.findIndex((obj) => obj.id === payload.id);
      if (metadataIndex !== -1) {
        dataModule.metadatas[metadataIndex].name = payload.name;
        dataModule.metadatas[metadataIndex].type = payload.type;
        dataModule.metadatas[metadataIndex].allowedValues = payload.allowedValues;
        dataModule.metadatas[metadataIndex].description = payload.description;
      } else {
        JSON.stringify(dataModule.metadatas.push(payload));
      }
      fs.writeFileSync('./data/metadatas.json', JSON.stringify(dataModule.metadatas, null, 2));
      makeResponseOk(res);
    });
  },
  '/ref/metadata'
);

router.on(['OPTIONS', 'GET'], '/ref/meta-provisioning', (req, res, params) => {
  makeResponseOk(res, dataModule.rulesMetadatas);
});

router.on(['OPTIONS', 'GET'], '/ref/meta-provisioning/id/:uuid', (req, res, params) => {
  makeResponseOk(
    res,
    dataModule.rulesMetadatas.find((x) => x.id === params.uuid)
  );
});

router.on(
  'POST',
  '/ref/meta-provisionning',
  (req, res, params) => {
    readPayload(req).then((payload) => {
      let metadataIndex = dataModule.rulesMetadatas.findIndex((obj) => obj.id === payload.id);
      if (metadataIndex !== -1) {
        dataModule.rulesMetadatas[metadataIndex].name = payload.name;
        dataModule.rulesMetadatas[metadataIndex].userProfile = payload.userProfile;
        dataModule.rulesMetadatas[metadataIndex].metadata = payload.metadata;
      } else {
        const userProfile = dataModule.userMetadatas.find((obj) => obj.id === payload.userProfile);
        const metadata = dataModule.metadatas.find((obj) => obj.id === payload.metadata);
        const rulesMetadata = {
          id: payload.id,
          name: payload.name,
          userProfile,
          metadata
        };
        JSON.stringify(dataModule.rulesMetadatas.push(rulesMetadata));
      }
      fs.writeFileSync('./data/rulesMetadata.json', JSON.stringify(dataModule.rulesMetadatas, null, 2));
      makeResponseOk(res);
    });
  },
  '/ref/meta-provisioning'
);

router.on(['DELETE'], '/ref/meta-provisioning/id/:id', (req, res, params) => {
  const toDeleteIndex = dataModule.rulesMetadatas.findIndex((nq) => nq.id === params.id);
  if (toDeleteIndex >= 0) {
    dataModule.rulesMetadatas.splice(toDeleteIndex, 1);
  }
  makeResponseOk(res);
});

router.on(['OPTIONS', 'GET'], '/ref/abac/rules/id/:id', (req, res, params) => {
  const rules = dataModule.rules;
  const rule = rules.find((rule) => rule.id === params.id);
  makeResponseOk(res, rule);
});
router.on(['OPTIONS', 'GET'], '/ref/abac/rules', (req, res, params) => {
  makeResponseOk(res, dataModule.rules);
});

router.on(
  'POST',
  '/ref/abac/rules',
  (req, res, params) => {
    readPayload(req).then((payload) => {
      let ruleIndex = dataModule.rules.findIndex((obj) => obj.id === payload.id);
      if (ruleIndex !== -1) {
        dataModule.rules[ruleIndex] = payload;
      } else {
        JSON.stringify(dataModule.rules.push(payload));
      }
      fs.writeFileSync('./data/rules.json', JSON.stringify(dataModule.rules, null, 2));
      makeResponseOk(res);
    });
  },
  '/ref/abac/rules'
);
router.on(['OPTIONS', 'GET'], '/ref/abac/context', (req, res, params) => {
  makeResponseOk(res, dataModule.environments);
});
router.on('PUT', '/ref/abac/context', (req, res, params) => {
  readPayload(req).then((payload) => {
    let envIndex = dataModule.environments.findIndex((obj) => obj.name === payload.name);
    if (envIndex !== -1) {
      dataModule.environments[envIndex].type = payload.type;
      dataModule.environments[envIndex].value = payload.value;
    } else {
      JSON.stringify(dataModule.environments.push(payload));
    }
    fs.writeFileSync('./data/environments.json', JSON.stringify(dataModule.environments, null, 2));
    makeResponseOk(res);
  });
});
router.on(['OPTIONS', 'GET'], '/ref/abac/context/:name', (req, res, params) => {
  for (let env of dataModule.environments) {
    if (env.name === params.name) {
      makeResponseOk(res, env);
    }
  }
});

router.on(['DELETE'], '/ref/abac/context/:name', (req, res, params) => {
  let envIndex = dataModule.environments.findIndex((obj) => obj.name === params.name);
  if (envIndex !== -1) {
    dataModule.environments.splice(envIndex, 1);
    fs.writeFileSync('./data/environments.json', JSON.stringify(dataModule.environments, null, 2));
    makeResponseOk(res);
  }
});

router.on(['OPTIONS', 'GET'], '/ref/model/class/datasets/count', (req, res, params) => {
  makeResponseOk(res, dataModule.datasetCount());
});
router.on(['OPTIONS', 'GET'], '/ref/dataset-versions', (req, res, params) => {
  res.setHeader('X-Total-Count', '500');
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  makeResponseOk(res, dataModule.datasetVersions.get());
});
router.on(['OPTIONS', 'GET'], '/ref/datasets/id/:id/dataset-versions', (req, res, params) =>
  makeResponseOk(res, dataModule.datasetVersions.getById(params.id))
);

router.on('POST', '/data/items/search', (req, res, params) => {
  readPayload(req).then((payload) => {
    const number = fieldGeneratorModule.generateNumberOfItems();
    if (payload.type === 'MONO_CLASS') {
      const { oClass } = payload;
      const tableOfClasses = new Array(number).fill(oClass, 0, number);
      makeResponseOk(
        res,
        dataModule.itemsAsResultSet(fieldGeneratorModule.generateItems(tableOfClasses, readQuery(req).excludeGeo))
      );
    } else {
      const tableOfClasses = [...new Array(number)].map(
        () => dataModule.class.ids[Math.round(Math.random() * 100) % dataModule.class.ids.length]
      );
      makeResponseOk(
        res,
        dataModule.itemsAsResultSet(fieldGeneratorModule.generateItems(tableOfClasses, readQuery(req).excludeGeo))
      );
    }
  });
});

router.on(['OPTIONS', 'POST'], '/data/relations', (req, res, params) => {
  readPayload(req).then((payload) => {
    // relations are generated
    makeResponseOk(res);
  });
});

router.on(['OPTIONS', 'POST'], '/data/items', (req, res, params) => {
  readPayload(req).then((payload) => {
    // items are generated
    const tableOfClasses = [0].map(
      () => dataModule.class.ids[Math.round(Math.random() * 100) % dataModule.class.ids.length]
    );
    makeResponseOk(
      res,
      payload && payload.length > 0
        ? [payload[0]]
        : [fieldGeneratorModule.generateItems(tableOfClasses, readQuery(req).excludeGeo)[0]]
    );
  });
});

router.on(['OPTIONS', 'GET'], '/data/data-sources/id/:id/items', (req, res, params) => {
  if (params.id === '007') {
    makeResponseOk(res, null, 404);
  } else {
    setTimeout(() => {
      const fixedResponse = dataModule.queryResponses[params.id];
      if (fixedResponse) {
        makeResponseOk(res, fixedResponse);
      } else {
        const responseTypesLimited = dataModule.queryResponseTypes[params.id]?.classes || dataModule.class.ids;
        const number = dataModule.queryResponseTypes[params.id]?.number ?? fieldGeneratorModule.generateNumberOfItems();
        const tableOfClasses = [...new Array(number)].map(
          () => responseTypesLimited[Math.round(Math.random() * 100) % responseTypesLimited.length]
        );
        const result = dataModule.itemsAsResultSet(
          fieldGeneratorModule.generateItems(tableOfClasses, readQuery(req).excludeGeo)
        );
        makeResponseOk(res, result);
      }
    }, fieldGeneratorModule.generateDelay());
  }
});

router.on(['OPTIONS', 'GET'], '/data/data-sources/id/:id/items/aggregate', (req, res, params) => {
  const query = readQuery(req);
  if (params.id === '007') {
    makeResponseOk(res, null, 404);
  } else {
    setTimeout(() => {
      const fixedResponse = dataModule.aggregationResponses[params.id];
      if (fixedResponse) {
        makeResponseOk(res, fixedResponse);
      } else {
        if (query.operation === 'extent') {
          makeResponseOk(res, {
            operation: 'extent',
            values: [
              {
                key: 'result',
                value: {
                  bottom_right: {
                    lon: -0.4505967056970596,
                    lat: 44.739590024032775
                  },
                  top_left: {
                    lon: -0.8907467289975025,
                    lat: 45.044559749692354
                  }
                }
              }
            ]
          });
          return;
        }

        const abscissaAttr = dataModule.class
          .get()
          .map((clazz) => clazz.attributes.find((attr) => attr.id === query.aggregatedBy))
          .find((attr) => !!attr);
        const abscissaField = dataModule.fields.get().find((field) => field.id === abscissaAttr?.field.id);
        const ordinateAttr = dataModule.class
          .get()
          .map((clazz) => clazz.attributes.find((attr) => attr.id === query.valueField))
          .find((attr) => !!attr);
        const ordinateField = dataModule.fields.get().find((field) => field.id === ordinateAttr?.field.id);

        let series = [];
        if (query.groupBy) {
          const groupByAttr = dataModule.class
            .get()
            .map((clazz) => clazz.attributes.find((attr) => attr.id === query.groupBy))
            .find((attr) => !!attr);
          const groupByField = dataModule.fields.get().find((field) => field.id === groupByAttr?.field.id);
          const nbSeries = casual.integer((from = 3), (to = 7));
          for (let i = 0; i < nbSeries; i++) {
            series[i] = fieldGeneratorModule.generateFieldValue(groupByField);
          }
        }

        const result = {
          operation: query.operation,
          values: []
        };
        if (!!abscissaField && (!!ordinateField || query.operation === 'count' || query.operation === 'cardinality')) {
          for (let i = 0; i < casual.integer((from = 10), (to = 40)); i++) {
            if (query.groupBy) {
              result.values[i] = {
                key: fieldGeneratorModule.generateFieldValue(abscissaField),
                groupBy: []
              };
              for (let j = 0; j < series.length; j++) {
                result.values[i].groupBy[j] = {
                  key: series[j],
                  value:
                    query.operation === 'count' || query.operation === 'cardinality'
                      ? casual.integer((from = 10), (to = 40))
                      : fieldGeneratorModule.generateFieldValue(ordinateField)
                };
              }
            } else {
              result.values[i] = {
                key: fieldGeneratorModule.generateFieldValue(abscissaField),
                value:
                  query.operation === 'count' || query.operation === 'cardinality'
                    ? casual.integer((from = 10), (to = 40))
                    : fieldGeneratorModule.generateFieldValue(ordinateField)
              };
            }
          }
        } else {
          console.warn('abscissa or ordinate not found', query);
        }
        makeResponseOk(res, result);
      }
    }, fieldGeneratorModule.generateDelay());
  }
});
router.on(['OPTIONS', 'POST'], '/data/data-sources/values', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      const { attributes = [], value = '', limit = 10 } = payload;

      const attrId = attributes[0]?.attribute || { attribute: '-----' };
      const attr = dataModule.class
        .get()
        .find((cl) => cl.attributes.find((attr) => attr.id === attrId))
        .attributes.find((attr) => attr.id === attrId);
      const attrType = dataModule.fields.get().find((field) => field.id === attr?.type)?.type || 'number';

      const result = [];
      for (let i = 0; i < limit; i++) {
        result.push(value + '' + (['number', 'decimal'].includes(attrType) ? casual.integer((from = 0)) : casual.word));
      }
      result.sort();
      setTimeout(() => {
        makeResponseOk(res, result);
      }, 1000);
    } else {
      makeResponseOk(res, ['']);
    }
  });
});

router.on(['OPTIONS', 'GET'], '/ref/users/me/namedquery', (req, res, params) => {
  makeResponseOk(res, dataModule.namedQueries);
});

router.on(['DELETE'], '/ref/users/me/namedquery/:id/favorite', (req, res, params) => {
  const isPresent = dataModule.namedQueries.find((name) => name.id === params.id);
  if (isPresent) {
    isPresent.favorite = false;
  }
  makeResponseOk(res);
});

router.on(['OPTIONS', 'POST'], '/ref/users/me/namedquery/:id/favorite', (req, res, params) => {
  const isPresent = dataModule.namedQueries.find((name) => name.id === params.id);
  if (isPresent) {
    isPresent.favorite = true;
  }
  makeResponseOk(res);
});

router.on('POST', '/ref/users/me/namedquery', (req, res, params) => {
  readPayload(req).then((payload) => {
    const { name, id, request, color, favorite, description } = payload;
    const namedQuery = {
      name,
      description,
      id,
      request,
      color,
      favorite,
      owner: true,
      lastExecutionDate: new Date().getTime()
    };
    const isPresent = dataModule.namedQueries.find((name) => name.id === id);
    if (isPresent) {
      isPresent.name = namedQuery.name;
      isPresent.description = namedQuery.description;
      isPresent.request = namedQuery.request;
      isPresent.color = namedQuery.color;
      isPresent.favorite = namedQuery.favorite;
      isPresent.owner = true;
    } else {
      dataModule.namedQueries.push(namedQuery);
    }
    makeResponseOk(res);
  });
});

router.on(['DELETE'], '/ref/users/me/namedquery/:id', (req, res, params) => {
  const toDeleteIndex = dataModule.namedQueries.findIndex((nq) => nq.id === params.id);
  if (toDeleteIndex >= 0) {
    dataModule.namedQueries.splice(toDeleteIndex, 1);
  }
  makeResponseOk(res);
});
router.on(['OPTIONS'], '/ref/users/me/namedquery/:id', (req, res, params) => {
  makeResponseOk(res);
});

router.on(['OPTIONS', 'GET'], '/data/items/:id', (req, res, params) => {
  const randomClass = dataModule.class.ids[Math.round(Math.random() * 100) % dataModule.class.ids.length];
  const item = fieldGeneratorModule.generateItems([randomClass], readQuery(req).excludeGeo);
  item[0].id = params.id;
  makeResponseOk(res, item[0]);
});

router.on(['OPTIONS', 'GET'], '/data/items/id/:id/relations', (req, res, params) => {
  const tableOfClasses = [...new Array(casual.integer((from = 1), (to = 5)))].map(
    () => dataModule.class.ids[Math.round(Math.random() * 100) % dataModule.class.ids.length]
  );
  makeResponseOk(
    res,
    dataModule.itemsAsResultSetWithRelationsTo(
      fieldGeneratorModule.generateItems(tableOfClasses, readQuery(req).excludeGeo),
      params.id
    )
  );
});

router.on(['OPTIONS', 'GET'], '/ref/users/me/dashboards', (req, res, params) => {
  makeResponseOk(res, manifestModule.list());
});
router.on(['OPTIONS', 'GET'], '/ref/users/me/dashboards/id/:id/manifest', (req, res, params) => {
  makeResponseOk(res, manifestModule.get(params.id));
});
router.on('OPTIONS', '/ref/users/me/dashboards/id/:id/default', (req, res, params) => {
  makeResponseOk(res);
});
router.on('PUT', '/ref/users/me/dashboards/id/:id/default', (req, res, params) => {
  manifestModule.default(params.id);
  makeResponseOk(res, { name: params.id });
});
router.on('POST', '/ref/users/me/dashboards', (req, res, params) => {
  readPayload(req).then((payload) => {
    const { id, name, description, creationDate, modificationDate, manifest, image, groups, additionalInformation } =
      payload;
    makeResponseOk(
      res,
      manifestModule.save(
        id,
        name,
        description,
        creationDate,
        modificationDate,
        manifest,
        image,
        groups,
        additionalInformation
      ),
      200
    );
  });
});
router.on(['OPTIONS', 'DELETE'], '/ref/users/me/dashboards/default', (req, res, params) => {
  manifestModule.default();
  makeResponseOk(res, { name: params.id });
});

router.on('OPTIONS', '/ref/users/me/dashboards/id/:id', (req, res, params) => {
  makeResponseOk(res);
});
router.on('DELETE', '/ref/users/me/dashboards/id/:id', (req, res, params) => {
  manifestModule.delete(params.id);
  makeResponseOk(res);
});

router.on(
  ['OPTIONS', 'PUT'],
  '/ref/users/me/dashboards/id/:presentationId/metadata/id/:metadataId',
  (req, res, params) => {
    readPayload(req).then((payload) => {
      makeResponseOk(res);
    });
  }
);

router.on(['DELETE'], '/ref/users/me/dashboards/id/:presentationId/metadata/id/:metadataId', (req, res, params) => {
  makeResponseOk(res);
});

router.on(['GET'], '/ref/groups', (req, res, params) => {
  makeResponseOk(res, dataModule.getGroups());
});

router.on(['OPTIONS', 'GET'], '/data/file/icons', (req, res, params) => {
  makeResponseOk(res, dataModule.imagesData());
});

router.on(['OPTIONS', 'GET'], '/data/file/icons/:id', (req, res, params) => {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, File-Content-Type'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  makeResponseImageOk(res, dataModule.imageData(params.id));
});

router.on(['OPTIONS', 'GET'], '/data/file/id/:idAndAttribute', (req, res, params) => {
  const toSend = dataModule.docData(params.idAndAttribute);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Content-Type', toSend.type);
  return res.end(toSend.data, 'binary');
});

router.on(['POST'], '/data/file/icons', (req, res, params) => {
  // Does not really store file right now
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    if (err) {
      console.error(err.message);
      return;
    }
    fs.copyFile(file.file.filepath, './images/' + file.file.originalFilename, (err) => {
      if (err) {
        console.error(err);
      }
    });
    const newImageName = file.file.originalFilename;
    makeResponseOk(res, newImageName);
  });
});

router.on(['OPTIONS', 'GET'], '/data/file/tasksDetailed', (req, res, params) => {
  makeResponseOk(res, dataModule.tasksDetailed);
});

router.on(['OPTIONS', 'GET'], '/json/tasksDetailed.json', (req, res, params) => {
  makeResponseOk(res, dataModule.tasksDetailed);
});

router.on(['OPTIONS', 'GET'], '/data/file/procedures', (req, res, params) => {
  makeResponseOk(res, dataModule.procedures);
});

router.on(['OPTIONS', 'GET'], '/ref/customclass/all/param', (req, res, params) => {
  makeResponseOk(res, dataModule.customClassParams());
});

router.on(['OPTIONS', 'PUT'], '/ref/customclass/id/:class/param/:domain', (req, res, params) => {
  readPayload(req).then((payload) => {
    makeResponseOk(res, dataModule.updateCustomClassParams(params.class, params.domain, payload));
  });
});

router.on(['OPTIONS', 'GET'], '/ref/widget/catalog', (req, res, params) => {
  makeResponseOk(res, dataModule.widgets.get());
});

router.on('POST', '/ref/widget/catalog', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.widgets.save(payload);
    makeResponseOk(res, undefined, 204);
  });
});
router.on(['PUT'], '/transfo/transfos', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.transformations.save(payload);
    makeResponseOk(res, pipelineCheck.pipelineCheck(payload));
  });
});
router.on(['OPTIONS', 'GET'], '/transfo/transfos', (req, res, params) => {
  makeResponseOk(res, dataModule.transformations.get());
});
router.on(['OPTIONS', 'GET'], '/transfo/transfos/id/:id', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.transformations.get(payload.id);
    makeResponseOk(res, undefined, 200);
  });
});
router.on(['OPTIONS', 'POST'], '/transfo/transfos/id/:id/activation', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.transformations.activate(params.id);
    makeResponseOk(res, undefined, 200);
  });
});
router.on(['DELETE'], '/transfo/transfos/id/:id/activation', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.transformations.deactivate(params.id);
    makeResponseOk(res, undefined, 200);
  });
});
router.on(['OPTIONS', 'PUT'], '/exec/job/instances/id/:id/start', (req, res, params) => {
  readPayload(req).then((payload) => {
    makeResponseOk(res, undefined, 200);
  });
});

router.on(['OPTIONS', 'GET'], '/ref/datasets/:id/associations', (req, res, params) => {
  makeResponseOk(res, dataModule.association.get(params.id));
});

router.on(['GET'], '/ref/dataset-versions/id/:id/previews', (req, res, params) => {
  makeResponseOk(res, errorModule.generateErrors());
});
router.on(['OPTIONS', 'GET'], '/ref/datasets', (req, res, params) => {
  makeResponseOk(res, dataModule.dataset.get());
});
router.on('POST', '/ref/datasets', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.dataset.save(payload);
    makeResponseOk(res, undefined, 204);
  });
});
router.on('PUT', '/ref/datasets', (req, res, params) => {
  readPayload(req).then((payload) => {
    makeResponseOk(res, dataModule.dataset.update(payload));
  });
});
router.on(['DELETE'], '/ref/datasets/id/:id', (req, res, params) => {
  dataModule.dataset.delete(params.id);
  makeResponseOk(res, undefined, 204);
});
router.on(['OPTIONS', 'GET'], '/ref/datasets/id/:id', (req, res, params) => {
  makeResponseOk(res, dataModule.dataset.getById(params.id));
});
router.on(['OPTIONS', 'PUT'], '/ref/datasets/id/:datasetId/metadata/id/:metadataId', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.dataset.addMetadata(params['datasetId'], params['metadataId'], payload);
    makeResponseOk(res);
  });
});
router.on(['GET'], '/ref/datasets/categories', (req, res, params) => {
  makeResponseOk(res, dataModule.categories);
});
router.on(['OPTIONS', 'PUT'], '/ref/datasets/categories', (req, res, params) => {
  readPayload(req).then((payload) => {
    if (payload) {
      JSON.stringify(dataModule.categories.push(payload));
      fs.writeFileSync('./data/categories.json', JSON.stringify(dataModule.categories, null, 2));
    }
    makeResponseOk(res);
  });
});
router.on(['POST'], '/ref/dataset-versions/id/:datasetVersionId/deactivate', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.datasetVersions.deactivate(params['datasetVersionId']);
    makeResponseOk(res);
  });
});
router.on(['POST'], '/ref/dataset-versions/id/:datasetVersionId/activate', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.datasetVersions.activate(params['datasetVersionId']);
    makeResponseOk(res);
  });
});
router.on(['OPTIONS', 'PUT'], '/ref/dataset-versions/id/:datasetVersionId', (req, res, params) => {
  readPayload(req).then((payload) => {
    dataModule.datasetVersions.update(params['datasetVersionId'], payload);
    makeResponseOk(res, {}, 204);
  });
});

router.on('DELETE', '/ref/dataset-versions/id/:datasetVersionId', (req, res, params) => {
  dataModule.datasetVersions.delete(params['datasetVersionId']);
  makeResponseOk(res, {}, 204);
});

router.on(['DELETE'], '/ref/datasets/id/:datasetId/metadata/id/:metadataId', (req, res, params) => {
  dataModule.dataset.deleteMetadata(params['datasetId'], params['metadataId']);
  makeResponseOk(res);
});
router.on(['GET'], '/ref/datasets/:datasetId/dataset-versions/latest', (req, res, params) => {
  makeResponseOk(res, dataModule.datasetVersions.getLatestActiveVersion(params['datasetId']));
});
router.on(['OPTIONS', 'DELETE'], '/ref/notification/me/id/:id', (req, res, params) => {
  makeResponseOk(res, {}, 204);
});
router.on(['OPTIONS', 'DELETE'], '/ref/notification/me', (req, res, params) => {
  makeResponseOk(res, {}, 204);
});
router.on(['OPTIONS'], '/data/imports/dataset/id/:id', (req, res, params) => {
  makeResponseOk(res, {}, 204);
});
router.on(['POST'], '/data/imports/dataset/id/:id', (req, res, params) => {
  makeResponseOk(res, {}, 204);
});
router.on(['OPTIONS', 'GET'], '/external/style.json', (req, res, params) => {
  makeResponseOk(res, JSON.parse(fs.readFileSync('./data/style.json', 'utf8')));
});

const server = http.createServer((req, res) => {
  router.lookup(req, res);
});
server.listen(port, host, (err) => {
  if (err) throw err;
  console.log(`Server is running on http://${host}:${port}`);
});

module.exports = { server, router };
