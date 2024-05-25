const Eva = require('../Eva');
const Environment = require('../Environment');

const tests = [
  // require('./block-test'),
  // require('./math-test'),
  // require('./self-eval-test'),
  // require('./variables-test'),
  // require('./if-test'),
  // require('./build-in-function-test.js'),
  // require('./user-defined-function-test.js'),
  require('./lambda-function-test.js'),
]

const eva = new Eva();


tests.forEach((test) => {
  test(eva);
})

console.log('All tests passed!');