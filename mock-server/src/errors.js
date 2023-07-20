const casual = require('casual');

const errorCodes = ['CODE_1', 'CODE_2', 'CODE_3'];
const generateErrors = (listOfCodes = errorCodes) => {
  const howMany = casual.integer((from = 40), (to = 80));
  const errors = [];

  for (let i = 0; i < howMany; i++) {
    errors.push({
      code: listOfCodes[casual.integer((from = 0), (to = listOfCodes.length - 1))],
      line: casual.integer((from = 1), (to = 2000)),
      message: casual.sentence
    });
  }

  return errors;
};

module.exports = {
  generateErrors
};
