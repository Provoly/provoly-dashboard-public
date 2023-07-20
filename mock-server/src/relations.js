const casual = require('casual');
const fs = require('fs');
const relationTypes = JSON.parse(fs.readFileSync('./data/relationTypes.json', 'utf8'));

const generateLinkId = () => {
  const which = Math.round(Math.random() * 100) % relationTypes.length;
  return relationTypes[which].id;
};

const generateRandomRelations = (items) => {
  const relations = [];
  for (let i = 0; i < items.length; i++) {
    // try to create 2 external links
    const prob = casual.integer((from = 0), (to = 100));
    let nb = 0;
    if (prob > 30) {
      nb = 1;
    }
    if (prob > 95) {
      nb = 2;
    }

    for (let j = 0; j < nb; j++) {
      const targetIdx = Math.round(Math.random() * 100) % items.length;
      if (i !== targetIdx) {
        relations.push({ source: items[i].id, destination: items[targetIdx].id, relationType: generateLinkId() });
      }
    }
  }
  return relations;
};

const generateRelationsTo = (items, id) => {
  const relations = [];
  for (let i = 0; i < items.length; i++) {
    if (casual.boolean) {
      relations.push({ source: id, destination: items[i].id, relationType: generateLinkId() });
    } else {
      relations.push({ source: items[i].id, destination: id, relationType: generateLinkId() });
    }
  }
  return relations;
};

const invisibleObjectRelations = (id) => {
  const relations = [];
  const percent = casual.integer((from = 0), (to = 100));

  if (percent > 80) {
    for (let i = 0; i < casual.integer((from = 0), (to = 2)); i++) {
      if (casual.boolean) {
        relations.push({ source: id, destination: `${casual.uuid}@${casual.uuid}`, relationType: generateLinkId() });
      } else {
        relations.push({ source: `${casual.uuid}@${casual.uuid}`, destination: id, relationType: generateLinkId() });
      }
    }
  }

  return relations;
};

module.exports = {
  generateRandomRelations,
  generateLinkName: generateLinkId,
  generateRelationsTo,
  invisibleObjectRelations
};
