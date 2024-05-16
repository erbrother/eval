const assert = require('assert')
const Environment = require('./Environment')
/**
 * Eva interpreter
 */
class Eva {
  constructor(global = new Environment()) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    // -------------------------
    // Self-evaluatin expressions
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // --------------------------
    // Math operations
    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    if (exp[0] === '*') {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    // ------------------------
    // Variable declaration
    if (exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value))
    }

    // -------------------------
    // Variable access
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented ${JSON.stringify(exp)}`
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}
// ---------------------
// Tests

const eva = new Eva(new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1'
}));

assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"Hello"'), 'Hello');

// Math: 

assert.strictEqual(eva.eval(['+', 1, 2]), 3);
assert.strictEqual(eva.eval(['+', ['+', 1, 2], 2]), 5);

// Variables:
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);

assert.strictEqual(eva.eval('x'), 10);
assert.strictEqual(eva.eval('VERSION'), '0.1');

assert.strictEqual(eva.eval(['var', 'isBool', 'true']), true);

console.log('All assertions passed!');