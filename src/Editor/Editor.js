import React, { Component } from 'react';
import peg from "pegjs";
import { Container, Row, Col, } from 'reactstrap';
import './Editor.css';
import 'font-awesome/css/font-awesome.min.css';
import Formula from './Formula';

class Editor extends Component{

  constructor(props){
    super(props);
    this.state = {
      collapse:[true,false],
      currentFormulaHeader:"1. InitialFormula",
      currentFormula:this.props.excercise.startingFormula,

      // alphaColorArray is used to define the alpha of the highlighting color of the atoms of the formula
      alphaColorArray:new Array(props.excercise.startingFormula.length).fill(0),

      // indexArray is used to map each atom in the formula to the corresponding node in the parsing tree
      indexArray: new Array(props.excercise.startingFormula.length).fill(null)
    };

  }

  componentDidMount() {
    fetch('/Grammer/LogicParsingGrammer.txt').then((r) => r.text())
    .then(text  => {
      // Create the parser
      this.parser = peg.generate(text);
      // Generate the parsing tree
      var tree = this.parser.parse(this.state.currentFormula);
      // var formula = "(((a∨b)∧(c))∨d)∧e"
      // var tree = this.parser.parse(formula);
      // Build the indexArray
      this.buildIndexArray(tree,this.state.currentFormula)
      // this.buildIndexArray(tree,formula)

      // console.log("Complete bracket sequencing: ",this.infixNotation(tree));
      // console.log("Postfix Notation: ",this.postfixNotation(tree));
      // console.log("Minimum Bracketing: ",this.minimumBracketing(this.postfixNotation(tree)));
    })
  }


  buildIndexArray(tree,formula)
  {
    // filter out all empty spaces and brackets
    var  compressedFormula = formula.split("")
    .map((atom,index)=>{return {value:atom,index:index}})
    .filter((element)=>{return element.value!==')' && element.value!=='(' && element.value!==' '});

    var indexArray = new Array(formula.length).fill(null);

    // Map the nodes of the tree to the indexArray
    this.buildIndexArrayDfs(tree,indexArray,0,compressedFormula);
    this.setState({indexArray:indexArray});
  }

  buildIndexArrayDfs(currentNode,indexArray,currentIndex,compressedFormula)
  {
    if(!currentNode)
      return currentIndex;
    // if currentNode is leaf
    if(!currentNode.left && !currentNode.right)
    {
        // map the indicies of the atom and the node together
        indexArray[compressedFormula[currentIndex].index] = currentNode;
        currentNode.index = compressedFormula[currentIndex].index;
        return currentIndex+1;
    }
    currentIndex = this.buildIndexArrayDfs(currentNode.left,indexArray,currentIndex,compressedFormula);

    currentNode.index = compressedFormula[currentIndex].index;
    indexArray[compressedFormula[currentIndex++].index] = currentNode;

    return this.buildIndexArrayDfs(currentNode.right,indexArray,currentIndex,compressedFormula);
  }

  dfs(currentNode,fn,options)
  {
    if(!currentNode)return;
    fn(currentNode,options);
    this.dfs(currentNode.left,fn,options);
    this.dfs(currentNode.right,fn,options);
  }

  onMouseOver(index){
    var alphaColorArray = this.state.alphaColorArray.slice();
    this.dfs(
        this.state.indexArray[index],
        (node,options)=>{options.alphaColorArray[node.index] = 10;},
        {alphaColorArray:alphaColorArray});
    this.setState({alphaColorArray:alphaColorArray});
  }

  onMouseOut(index){
    var alphaColorArray = this.state.alphaColorArray.slice();
    this.dfs(
        this.state.indexArray[index],
        (node,options)=>{options.alphaColorArray[node.index] = 0;},
        {alphaColorArray:alphaColorArray});
    this.setState({alphaColorArray:alphaColorArray});
  }

  infixNotation(curNode)
  {
    if(!curNode)
      return "";
    if(!curNode.left && !curNode.right)
      return curNode.symbol;
    var leftSubTree = curNode.left? this.infixNotation(curNode.left):"";
    var rightSubTree = curNode.right? this.infixNotation(curNode.right):"";
    return "( " + leftSubTree + " " + curNode.symbol + " " + rightSubTree + " )";
  }

  postfixNotation(curNode)
  {
    if(!curNode)
      return "";
    if(!curNode.left && !curNode.right)
      return curNode.symbol;
    var leftSubTree = curNode.left? this.postfixNotation(curNode.left):"";
    var rightSubTree = curNode.right? this.postfixNotation(curNode.right):"";
    return leftSubTree+rightSubTree+curNode.symbol;
  }


  minimumBracketing(formula)
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

  render()
  {
      var currentFormula = this.state.currentFormula.split("").map((atom,index)=>{
      var alpha = this.state.alphaColorArray[index];

      return(
      <span
        key={index}
        onMouseOver={()=>this.onMouseOver(index)}
        onMouseOut={()=>this.onMouseOut(index)}
        style={{backgroundColor:"rgba(255, 212, 128,"+alpha+")"}}
        className="atom"
        >
        {atom}
        </span>
    )});
    return (
      <Container fluid={true}>
     <Row>
       <Col
         md="12"
         lg="12"
         className="main-body">

         <Row>
           <Col lg={{size:10,offset:1}}
              className="hint-bar margin">
             Hint: Try to remove all of the implications first
           </Col>
         </Row>
         <Row>
           <Col  lg={{size:10,offset:1}}
             className="feedback-bar margin">
             Status: All good!
           </Col>
         </Row>

         <Row className="margin">
           <Col
             lg={{size:10,offset:1}}
             className="editor">

             <Row>
               <Col md={{size:2,offset:10}}
                    lg={{size:2,offset:10}}
                  className="settings"
                  >

                 <button className="btn btn-xs setting"><i className="fa fa-home"></i></button>
                 <button className="btn btn-xs setting"><i className="fa fa-bars"></i></button>
                 <button className="btn btn-xs setting"><i className="fa fa-trash"></i></button>

               </Col>
             </Row>

             <Row>
               <Col
                 lg="8"
                 className="margin">
                 <Row>
                 <Col
                   lg={{size:10,offset:1}}
                   className="margin action-panel">

                   <Row>
                     <Col lg="12" className="main-panel">

                     <Formula
                       header={this.state.currentFormulaHeader}
                       body={currentFormula}
                     />


                   </Col>
                 </Row>



               </Col>
             </Row>
             </Col>

               <Col
                  lg="3"
                  className="transformation-panel-back margin">
                 <div className="transformation-panel-front margin">
                   <Row>
                     <Col lg="12">
                       <h3>Transformations</h3>
                       <hr/>
                     </Col>
                   </Row>
                   <button className="rule">a ≡ a ∨ ¬a</button>
                   <button className="rule">(a ∨ ¬a) ∧ b ≡ b</button>
                   <button className="rule">a → b ≡ ¬a ∨ b</button>
                   <button className="rule">a ∨ b ≡ b ∨ a</button>
                   <button className="rule">a ∧ (b ∧ c) ≡ a ∧ b ∧ c</button>
                   <button className="rule">a → a ≡ a</button>
                   <button className="rule">a → (b ∧ ¬b) ≡ a</button>
                 </div>
               </Col>

             </Row>

           </Col>

         </Row>
       </Col>
     </Row>
   </Container>
    );
  }
}

export default Editor;
