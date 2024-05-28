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

  // Recursive function: 
  assert.strictEqual(eva.eval(
    ['begin',
      ['def', 'factorial', ['n'],
        ['if', ['==', 'n', 1], 1, ['*', 'n', ['factorial', ['-', 'n', 1]]]]
      ],
      ['factorial', 5]
    ]
  ), 120);
}
