const assert = require('assert')

module.exports = eva => {
  assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'x', 10],
      ['switch', [['==', 'x', 10], 100],
        [['>', 'x', 10], 200],
        ['else', 300]
      ]
    ]
  ), 100);
}



