const casual = require('casual');

const errorCodes = ['STORAGE', 'UNRECOGNIZED', 'NO_VALUES', 'NO_ATTRIBUTES', 'FORMAT_FILE_ERROR'];
const generateErrors = (listOfCodes = errorCodes) => {
  const howMany = casual.integer((from = 1), (to = 6));
  const errors = [];

  for (let i = 0; i < howMany; i++) {
    const level = casual.coin_flip ? 'ERROR' : 'WARNING';
    errors.push({
      level,
      messages: [
        {
          level,
          extractMessageCode: listOfCodes[casual.integer((from = 0), (to = listOfCodes.length - 1))],
          type: casual.sentence,
          name: casual.sentence,
          recordId: casual.uuid,
          datasetVersionId: casual.uuid
        }
      ],
      count: casual.integer((from = 1), (to = 2000))
    });
  }

  return errors;
};

module.exports = {
  generateErrors
};
