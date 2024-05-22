const assert = require('assert')

/**
 * (if <condition>
 *     <consequent>
 *    <alternate>)
 * )
 */
module.exports = eva => {
  assert.strictEqual(eva.eval(['+', 1, 5]), 6)
  assert.strictEqual(eva.eval(['+', ['+', 2, 3], 5]), 10)
  assert.strictEqual(eva.eval(['*', 1, 5]), 5)

  // Comparison
  assert.strictEqual(eva.eval(['>', 1, 5]), false)
  assert.strictEqual(eva.eval(['<', 1, 5]), true)

  assert.strictEqual(eva.eval(['<=', 5, 5]), true)
  assert.strictEqual(eva.eval(['>=', 5, 5]), true)
  assert.strictEqual(eva.eval(['==', 5, 5]), true)
}