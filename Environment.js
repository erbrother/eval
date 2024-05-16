/**
 * Environment: names stroage.
 */
class Environment {
  constructor(record = {}) {
    this.record = record;
  }

  define(name, value) {
    this.record[name] = value;
    return value;
  }

  lookup(name) {
    if (Object.prototype.hasOwnProperty.call(this.record, name)) {
      return this.record[name];
    }
    throw new Error(`Undefined variable: ${name}`);
  }
}

module.exports = Environment;