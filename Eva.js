const Environment = require('./Environment')
const Transformer = require('./transform/Transformer')
/**
 * Eva interpreter
 */
class Eva {
  constructor(global = GlobalEnviroment) {
    this.global = global;
    this._transformer = new Transformer();
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

    // -----------------
    // Block: sequence of expressions
    if (exp[0] === 'begin') {
      const blockEnv = new Environment({}, env)
      return this._evalBlock(exp, blockEnv);
    }

    // ------------------------
    // Variable declaration
    if (exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env))
    }

    // ------------------------
    // Variable declaration: (var foo 10)
    if (exp[0] === 'set') {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env))
    }

    // -------------------------
    // Variable access
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    // -------------------
    // if-expression
    if (exp[0] === 'if') {
      const [_tag, condition, consequent, alternate] = exp;

      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }

      return this.eval(alternate, env);
    }

    // -------------------
    // while expression
    if (exp[0] === 'while') {
      const [_tag, condition, body] = exp
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // --------------------
    // Function Declaration: [def, foo, [x y], [+ x y]]

    if (exp[0] === 'def') {
      // JIT-transpile to a variable declaration
      var varExp = this._transformer.transformDefToVarLambda(exp)

      return this.eval(varExp, env)
    }

    // -------------------------
    // Syntactic sugar for nested if-expression
    if (exp[0] === 'switch') {
      const ifExp = this._transformer.transformSwitchToIf(exp)

      return this.eval(ifExp, env)
    }

    // ---------------------
    // Increment: (++ foo)
    // 
    // Syntactic sugar for: (set foo (+ foo 1))
    if (exp[0] === '++') {
      const setExp = this._transformer.transformIncToSet(exp)

      return this.eval(setExp, env)
    }

    // ---------------------
    // Increment: (+= foo inc)
    // 
    // Syntactic sugar for: (set foo (+ foo inc))
    if (exp[0] === '+=') {
      const setExp = this._transformer.transformIncValToSet(exp)

      return this.eval(setExp, env)
    }

    // ---------------------
    // Decrement: (-= foo dec)
    // 
    // Syntactic sugar for: (set foo (- foo dec))
    if (exp[0] === '-=') {
      const setExp = this._transformer.transformDecToSet(exp)

      return this.eval(setExp, env)
    }

    // -------------------------
    // For-loop (for init condition modifier body)
    // Syntactic sugar for : (begin init (while condition (begin modifier body))
    if (exp[0] === 'for') {
      const whileExp = this._transformer.tanraformForToWhile(exp)

      return this.eval(whileExp, env)
    }

    // ----------------
    // Lambda function:(lambda (x) (* x y))
    if (exp[0] === 'lambda') {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env // the environment where the function is defined Closure
      }
    }

    // -------------------
    // Function calls
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);

      const args = exp
        .slice(1)
        .map(arg => this.eval(arg, env));

      // 1. Native function
      if (typeof fn == 'function') {
        return fn(...args)
      }

      // 2. User-defined function
      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      })

      const activationEnv = new Environment(
        activationRecord,
        fn.env
      );

      return this._evalBody(fn.body, activationEnv)
    }

    throw `Unimplemented ${JSON.stringify(exp)}`
  }

  _evalBody(body, env) {
    if (body[0] === 'begin') {
      return this._evalBlock(body, env)
    }

    return this.eval(body, env)
  }

  _evalBlock(exps, env) {
    let result;

    const [_tag, ...expressions] = exps;

    expressions.forEach(exp => {
      result = this.eval(exp, env);
    })

    return result;
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
}

/**
 * Defualt Global Environment
 */
const GlobalEnviroment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
  '+'(op1, op2) {
    return op1 + op2
  },
  '*'(op1, op2) {
    return op1 * op2
  },
  '-'(op1, op2 = null) {
    if (op2 == null) {
      return -op1
    }
    return op1 - op2
  },
  '/'(op1, op2) {
    return op1 / op2
  },

  // comparison
  '>'(op1, op2) {
    return op1 > op2
  },
  '<'(op1, op2) {
    return op1 < op2
  },
  '>='(op1, op2) {
    return op1 >= op2
  },
  '<='(op1, op2) {
    return op1 <= op2
  },
  '=='(op1, op2) {
    return op1 == op2
  },
  print(...args) {
    console.log(...args)
  }
})

module.exports = Eva;