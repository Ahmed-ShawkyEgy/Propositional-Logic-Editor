class ParserUtil{
  static infixNotation(curNode)
  {
    if(!curNode)
      return "";
    if(!curNode.left && !curNode.right)
      return curNode.symbol;
    var leftSubTree = curNode.left? this.infixNotation(curNode.left):"";
    var rightSubTree = curNode.right? this.infixNotation(curNode.right):"";
    if(curNode.symbol==="()")
    {
      return "( " + leftSubTree + " " + rightSubTree + " )";
    }
      return leftSubTree + " " + curNode.symbol + " " + rightSubTree;
  }

  static postfixNotation(curNode)
  {
    if(!curNode)
      return "";
    if(!curNode.left && !curNode.right)
      return curNode.symbol;
    var leftSubTree = curNode.left? this.postfixNotation(curNode.left):"";
    var rightSubTree = curNode.right? this.postfixNotation(curNode.right):"";
    return leftSubTree+rightSubTree+curNode.symbol;
  }


  static minimumBracketing(formula)
  {
    var operandStack = [] , operatorsStack = [] ,operators = ['⊤','⊥','¬','∧','∨','→','↔'];
    for(var i = 0; i < formula.length;i++)
    {
      var term = formula[i];
      // if this term is not an operator
      if(operators.indexOf(term)===-1)
      {
        operandStack.push(term);
        operatorsStack.push(null);
      }
      else if(term !== '¬')
      {
          var secondOperand = operandStack.pop() ,  firstOperand = operandStack.pop();
          var secondOperator  = operatorsStack.pop() ,firstOperator  = operatorsStack.pop();


          if(firstOperator && operators.indexOf(firstOperator) > operators.indexOf(term))
            firstOperand = "( " + firstOperand + " )";
          if(secondOperator && operators.indexOf(secondOperator) > operators.indexOf(term))
            secondOperand = "( " + secondOperand + " )";
          operandStack.push(firstOperand + " " + term + " " + secondOperand);
          operatorsStack.push(term);
      }
      else
      {
          var operand = operandStack.pop() , operator = operatorsStack.pop();


          if(operator)
            operandStack.push(term+" ( " + operand + " )" );
          else
            operandStack.push(term+" " + operand + " " );
          operatorsStack.push(term);
      }
    }
    return operandStack.pop();
  }
}
export default ParserUtil;
