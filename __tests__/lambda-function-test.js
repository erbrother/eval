const assert = require('assert')

module.exports = eva => {
  assert.strictEqual(eva.eval(
    ['begin',
      ['def', 'onClick', ['callback'], [
        'begin',
        ['var', 'x', 10],
        ['var', 'y', 20],
        ['callback', ['+', 'x', 'y']],
      ]],
      ['onClick', ['lambda', ['data'], ['*', 'data', 10]]]
    ]
  ), 300);

  // Immediate-invoked lambda expression - IILE
  assert.strictEqual(eva.eval(
    ['begin',
      [['lambda', ['x'], ['*', 'x', 'x']], 2]
    ]
  ), 4);
}


