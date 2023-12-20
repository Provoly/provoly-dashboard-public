const casual = require('casual');
const { classes, fields } = require('./data');

const globalErrors = [
  { code: 'LOOP_IN_TASK', params: ['ids'] },
  { code: 'MISSING_NODE', params: ['value'] },
  { code: 'DUPLICATE_NODE', params: ['id'] }
];

const nodeErrors = {
  default: [
    { code: 'NO_INPUT', params: [] },
    { code: 'NO_INPUT_MODEL', params: [] }
  ],
  'com.onepoint.pry.common.transfo.Filter': [
    { code: 'MISSING_PROPERTY_IN_INPUT_ATTRIBUTE', params: [] },
    { code: 'BAD_TYPE', params: ['attributeName'] }
  ]
};

const generateParams = (name) => {
  let value = undefined;
  switch (name) {
    case 'id':
    case 'value':
      value = casual.uuid;
      break;
    case 'ids':
      value = [casual.uuid, casual.uuid, casual.uuid, casual.uuid];
      break;
    case 'attributeName':
      value = casual.word;
      break;
  }
  return { [name]: value };
};

const pipeline = (payload) => {
  const result = {
    id: payload?.id ?? null,
    errors: [],
    status: []
  };
  if (payload) {
    const allNodes = [
      ...payload.nodes,
      ...payload.nodes
        .filter((node) => !!node.subgraph)
        .map((node) => node.subgraph.nodes)
        .reduce((p, c) => [...p, ...c], [])
    ].filter((node) => !!node);

    allNodes.forEach((node) => {
      // Take a random class and give its attributes
      const attributes = classes[casual.integer((from = 0), (to = classes.length - 1))].attributes;

      result.status.push({
        nodeId: node.id,
        outModel: {
          attributes: attributes.map((attr) => ({
            technicalName: attr.technicalName,
            type: fields.get().find((field) => field.id === attr.field)?.type ?? 'string'
          }))
        },
        errors: []
      });
    });

    // randomly generates errors
    const hasErrors = casual.integer((from = 0), (to = 1000)) < 700;
    if (hasErrors) {
      const errorInstance = globalErrors[casual.integer((from = 0), (to = globalErrors.length - 1))];
      result.errors.push({
        ...errorInstance.params.map(generateParams).reduce((p, c) => ({ ...p, ...c }), {}),
        code: errorInstance.code
      });

      const nb = casual.integer((from = 1), (to = 3));
      for (let idx = 0; idx <= nb; idx++) {
        if (payload.nodes.length > 0) {
          const whichNode = payload.nodes[casual.integer((from = 0), (to = payload.nodes.length - 1))];
          const possibleErrors = nodeErrors[whichNode.type]
            ? [...nodeErrors.default, ...nodeErrors[whichNode.type]]
            : nodeErrors.default;
          const nodeErrorInstance = possibleErrors[casual.integer((from = 0), (to = possibleErrors.length - 1))];
          const nodeStatus = result.status.find((status) => status.nodeId === whichNode.id);
          nodeStatus.errors.push({
            ...nodeErrorInstance.params.map(generateParams).reduce((p, c) => ({ ...p, ...c }), {}),
            nodeId: whichNode.id,
            code: nodeErrorInstance.code
          });
        }
      }
    }
  }
  return result;
};

module.exports = {
  pipelineCheck: pipeline
};
