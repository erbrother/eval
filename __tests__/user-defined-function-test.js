const assert = require('assert')

module.exports = eva => {
  assert.strictEqual(eva.eval(
    ['begin',
      ['def', 'square', ['x'], 
        ['*', 'x', 'x']
      ],
      ['square', 2]
    ]
  ), 4);
}


