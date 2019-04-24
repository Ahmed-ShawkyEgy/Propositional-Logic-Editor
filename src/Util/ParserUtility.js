class ParserUtil{

  // A generic dfs function that runs a dfs traversal at a given node and applies the function fn
  // on each node while passing the object params to fn
  static dfs(currentNode,fn,params)
  {
    if(!currentNode)return;
    fn(currentNode,params);
    this.dfs(currentNode.left,fn,params);
    this.dfs(currentNode.right,fn,params);
  }

  static countLeaves(tree)
  {
    var params = {leavesCount:0};
    ParserUtil.dfs(tree,(node,params)=>{if(!node.left&&!node.right)params.leavesCount++;},params);
    return params.leavesCount;
  }

  static cloneTree(currentNode)
  {
    if(!currentNode)return null;
    return {
      symbol:currentNode.symbol,
      left:ParserUtil.cloneTree(currentNode.left),
      right:ParserUtil.cloneTree(currentNode.right),
    };
  }

  static compareTrees(node1,node2)
  {
    if((!node1 && node2) || (!node2 && node1))return false;
    if(!node1 && !node2)return true;
    if(node1.symbol!==node2.symbol)return false;
    return ParserUtil.compareTrees(node1.left,node2.left) && ParserUtil.compareTrees(node1.right,node2.right);
  }

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

  static getFormulaAtoms(formulaTree)
  {
    var atoms = [];
    this.dfs(formulaTree,(node,params)=>
    {
      if(node && !node.left && !node.right )
      {
        if(!params.atoms.includes(node.symbol))
          params.atoms.push(node.symbol);
      }
    }
    ,{atoms:atoms});
    return atoms;
  }

}
export default ParserUtil;
