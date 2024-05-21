const assert = require('assert');

module.exports = (eva) => {
  assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'x', 10],
      ['begin',
        ['var', 'y', ['+', 'x', 10]],
        'y'
      ],
    ]
  ), 20);

  assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'value', 10],
      ['var', 'result', ['begin',
        ['var', 'x', ['+', 'value', 10]],
        'x'
      ]],
      'result'
    ]), 20);
}