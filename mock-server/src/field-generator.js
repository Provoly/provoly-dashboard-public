const casual = require('casual');
const data = require('./data');
const { fields } = require('./data');

casual.define('point', function () {
  // [lon, lat]
  return [casual.double((from = -0.8), (to = -0.4)), casual.double((from = 44.6), (to = 44.9))];
});

casual.define('line', function () {
  const result = [];
  const nb = casual.integer((from = 3), (to = 8));
  for (let i = 0; i < nb; i++) {
    result.push(casual.point);
  }
  // [lon, lat][]
  return result;
});

casual.define('polygon', function () {
  const [first, ...others] = [...casual.line, ...casual.line];
  // [lon, lat][][]
  return [[first, ...others, first]];
});

casual.define('multiLine', function () {
  const result = [];
  const nb = casual.integer((from = 3), (to = 8));
  for (let i = 0; i < nb; i++) {
    result.push(casual.line);
  }
  // [lon, lat][][]
  return result;
});

casual.define('multiPolygon', function () {
  const result = [];
  const nb = casual.integer((from = 3), (to = 8));
  for (let i = 0; i < nb; i++) {
    result.push(casual.polygon);
  }
  // [lon, lat][][][]
  return result;
});

const metaTypes = ['string', 'keyword', 'integer', 'decimal', 'instant'];

const geoTypes = ['Point', 'MultiPoint', 'LineString', 'Polygon', 'MultiLineString', 'MultiPolygon'];

const generateMetadata = () => {
  const metas = {};
  const howMany = Math.round(Math.random() * 100) % 5;
  for (let i = 0; i < howMany; i++) {
    const metaType = metaTypes[Math.round(Math.random() * 100) % metaTypes.length];
    metas[casual.word] = generateAttrValueByFieldType({ type: metaType }, { name: 'meta' });
  }
  return metas;
};

const wrapAttribute = (attr) => {
  const visible = true;
  if (!attr.multiValued) {
    return {
      type: 'VALUE',
      value: visible ? generateFieldValue(attr) : null,
      metadata: generateMetadata(),
      visible
    };
  } else {
    const howMany = Math.round(Math.random() * 100) % 5;
    const newAttr = Object.assign({}, attr, { multiValued: false });
    const values = [...new Array(howMany)].map(() => wrapAttribute(newAttr));
    return { type: 'MULTI', values: visible ? values : undefined };
  }
};

function generateAttrValueByFieldType(type, attr) {
  switch (type.type) {
    case 'decimal':
      return casual.double((from = 0), (to = 1000));
    case 'string':
    case 'keyword':
      return casual.sentence;
    case 'integer':
      return casual.integer((from = 0), (to = 1000));
    case 'long':
      return casual.integer((from = 10000), (to = 10000000));
    case 'instant':
      return casual.unix_time;
    case 'raw':
      return '';
    case 'Point':
      return {
        type: 'Point',
        coordinates: casual.point
      };
    case 'MultiPoint':
      return {
        type: 'MultiPoint',
        coordinates: casual.line
      };
    case 'LineString':
      return {
        type: 'LineString',
        coordinates: casual.line
      };
    case 'Polygon':
      return {
        type: 'Polygon',
        coordinates: casual.polygon
      };
    case 'MultiLineString':
      return {
        type: 'MultiLineString',
        coordinates: casual.multiLine
      };
    case 'MultiPolygon':
      return {
        type: 'MultiPolygon',
        coordinates: casual.multiPolygon
      };
    default:
      console.error('Cannot generate attr value for ', attr, type.type);
      return 'Cannot generate attr value for this';
  }
}

let rotateDpt = 0;
const generateFieldValue = (attr) => {
  switch (attr.technicalName.toLocaleLowerCase()) {
    case 'latitude':
    case 'lat':
      return casual.double((from = 44.6), (to = 44.9)) + '';
    case 'longitude':
    case 'long':
    case 'lng':
      return casual.double((from = -0.8), (to = -0.4));
    case 'location-auto':
      return null;
    case 'valeur_fonciere':
    case 'valeur_notariale':
      return casual.integer((from = 10000), (to = 100000)) * 100;
    case 'num_acc':
      return casual.integer((from = 2020), (to = 2022)) * 100000000 + casual.integer((from = 0), (to = 50000));
    case 'catv':
      return casual.integer((from = 1), (to = 9));
    case 'choc':
    case 'type_terrain':
      return casual.integer((from = 1), (to = 5));
    case 'id_vehicule':
      return `${(casual.integer((from = 0), (to = 999)) + '').padStart(3, '0')} ${(
        casual.integer((from = 0), (to = 999)) + ''
      ).padStart(3, '0')} ${(casual.integer((from = 0), (to = 999)) + '').padStart(3, '0')}`;
    case 'id_mutation':
      return `${casual.integer((from = 2010), (to = 2021)) + ''}-${
        casual.integer((from = 100000), (to = 999999)) + ''
      }`;
    case 'an_nais':
      return casual.integer((from = 1940), (to = 2021));
    case 'département':
      const dpt = data.departements;
      return dpt[rotateDpt++ % dpt.length];
    case 'sexe':
    case 'type_maison':
      return casual.integer((from = 1), (to = 2));
    case 'temperature_en_degre_c':
      return casual.double((from = 5.0), (to = 30.0));
    case 'humidite':
      return casual.double((from = 0.0), (to = 100.0));
    case 'heure_utc':
    case 'creation':
      return casual.unix_time;
    case 'valeur':
      return casual.integer((from = 0), (to = 10));
    case 'entite':
      return ['Entité 1', 'Entité 2'][casual.integer((from = 0), (to = 1))];
    case 'id':
    case 'parent':
      return casual.uuid;
    case 'axe':
      return ['Crosscanal', 'Multi-canal', 'Omnicanal'][casual.integer((from = 0), (to = 2))];
    case 'is_broken':
      return casual.integer((from = 0), (to = 1));
    case 'geo_point_2d':
      return `${casual.double((from = 44.6), (to = 44.9))},${casual.double((from = -0.8), (to = -0.4))}`;
    case 'status':
      return ['Ok', 'Ok', 'Ok', 'Ok', 'A suivre', 'A suivre', 'En panne'][casual.integer((from = 0), (to = 7))];
    case 'seriesname':
      return ['typeA', 'typeB', 'typeC', 'typeD', 'typeE'][casual.integer((from = 0), (to = 4))];
    default:
      // no specific attr name value generation
      // get attr type using field
      const type = fields.get().find((f) => f.id === attr.field) || { type: attr.type ?? 'unknown' };
      return generateAttrValueByFieldType(type, attr);
  }
};

const generateItems = (classesTable, _excludeGeo) => {
  const excludeGeo = typeof _excludeGeo === 'string' ? JSON.parse(_excludeGeo) : _excludeGeo;
  const datasetId = casual.uuid;
  return classesTable.map((classId) => {
    const objectClass = data.classes.find((oClass) => oClass.id === classId);

    const attributes = objectClass.attributes
      .filter(
        (attr) =>
          excludeGeo === false ||
          excludeGeo === undefined ||
          !geoTypes.includes(data.fields.get().find((field) => field.id === attr.field)?.type)
      )
      .map((attr) => ({ [attr.technicalName]: wrapAttribute(attr) }))
      .reduce((p, c) => Object.assign(p, c), {});

    return {
      id: `${casual.uuid}@${datasetId}`,
      oClass: classId,
      metadata: generateMetadata(),
      attributes
    };
  });
};

const generateNumberOfItems = () => {
  return casual.integer((from = 100), (to = 200));
};

const generateDelay = () => {
  return casual.integer((from = 20), (to = 1200));
};

module.exports = {
  generateFieldValue,
  generateMetadata,
  generateItems,
  generateNumberOfItems,
  generateDelay,
  geoTypes
};
