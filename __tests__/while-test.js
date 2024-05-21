const assert = require('assert')

module.exports = eva => {
  assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'i', 0],
      ['while', ['<', 'i', 10],
        ['begin',
          ['set', 'i', ['+', 'i', 1]],
        ]
      ],
      'i'
    ]
  ), 10)
}