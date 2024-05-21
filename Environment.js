/**
 * Environment: names stroage.
 */
class Environment {
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  define(name, value) {
    this.record[name] = value;
    return value;
  }

  lookup(name) {
    return this.resolve(name).record[name];
  }

  /**
   * Return specific environment in which a variable is defined, or
   * throw an error if the variable is not defined.
   */
  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent === null) {
      throw  new Error(`Undefined variable: ${name}`);
    }

    return this.parent.resolve(name);
  }

  /**
   * Updates an existing variable
   */
  assign(name, value) {
    this.resolve(name).record[name] = value;

    return value;
  }
}

module.exports = Environment;