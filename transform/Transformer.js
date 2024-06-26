/**
 * AST Transformer
 */

class Transformer {
  /**
   * Translates `def ` - expression (function declaration)
   * into a variable declaration with a lambda expression
   */
  transformDefToVarLambda(defExp) {
    const [_tag, name, params, body] = defExp

    return ['var', name, ['lambda', params, body]]

  }

  /**
   * Translates `switch` to nested `if` -expression
   */
  transformSwitchToIf(switchExp) {
    const [_tag, ...cases] = switchExp;

    const ifExp = ['if', null, null, null];

    let current = ifExp;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCondition, currentBlock] = cases[i];

      current[1] = currentCondition;
      current[2] = currentBlock;

      const next = cases[i + 1]

      const [nextCondition, nextBlock] = next

      current[3] = nextCondition === 'else' 
        ? nextBlock 
        : ['if'];

      current = current[3];
    }

    return ifExp;
  }
}

module.exports = Transformer