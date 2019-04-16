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

      // colors is used to define the alpha of the highlighting color of the atoms of the formula
      colors:new Array(props.excercise.startingFormula.length).fill(0),

      // mapArray is used to map each atom in the formula to the corresponding node in the parsing tree
      mapArray: new Array(props.excercise.startingFormula.length).fill(null)
    };

  }

  componentDidMount() {
    fetch('/Grammer/ExtendedLogicParsingGrammer.txt').then((r) => r.text())
    .then(text  => {
      // Create the parser
      this.parser = peg.generate(text);
      // Generate the parsing tree
      var tree = this.parser.parse(this.state.currentFormula);
      console.log(tree);
      // var formula = "(((a∨b)∧(c))∨d)∧e"
      // var tree = this.parser.parse(formula);
      // Build the mapArray
      this.buildMap(tree,this.state.currentFormula)
      // this.buildMap(tree,formula)

      // console.log(this.state.mapArray);
      // console.log("Complete bracket sequencing: ",this.infixNotation(tree));
      // console.log("Postfix Notation: ",this.postfixNotation(tree));
      // console.log("Minimum Bracketing: ",this.minimumBracketing(this.postfixNotation(tree)));
    })
  }


  buildMap(tree,formula)
  {
    // filter out all empty spaces
    var  compressedFormula = formula.split("")
    .map((atom,index)=>{return {value:atom,index:index}})
    .filter((element)=>{return element.value!==' '});

    var mapArray = new Array(formula.length).fill(null);

    console.log(compressedFormula);
    console.log(tree);
    // Map the nodes of the tree to the mapArray
    this.buildMapDfs(tree,mapArray,0,compressedFormula);
    this.setState({mapArray:mapArray});
  }

  buildMapDfs(currentNode,mapArray,currentIndex,compressedFormula)
  {
    if(!currentNode)
      return currentIndex;
    // if currentNode is leaf
    if(currentNode.left===null && currentNode.right===null )
    {
        // map the indicies of the atom and the node together
        mapArray[compressedFormula[currentIndex].index] = currentNode;
        currentNode.index = compressedFormula[currentIndex].index;
        return currentIndex+1;
    }
    else if(currentNode.symbol==="()")
    {
      mapArray[compressedFormula[currentIndex].index] = currentNode;
      currentNode.index = [compressedFormula[currentIndex++].index];

      currentIndex = this.buildMapDfs(currentNode.right,mapArray,currentIndex,compressedFormula);

      mapArray[compressedFormula[currentIndex].index] = currentNode;
      currentNode.index.push(compressedFormula[currentIndex++].index);
      return currentIndex;
    }
    else{
      currentIndex = this.buildMapDfs(currentNode.left,mapArray,currentIndex,compressedFormula);

      currentNode.index = compressedFormula[currentIndex].index;
      mapArray[compressedFormula[currentIndex++].index] = currentNode;

      return this.buildMapDfs(currentNode.right,mapArray,currentIndex,compressedFormula);
    }
  }

  dfs(currentNode,fn,params)
  {
    if(!currentNode)return;
    fn(currentNode,params);
    this.dfs(currentNode.left,fn,params);
    this.dfs(currentNode.right,fn,params);
  }

  onMouseOver(index){
    var colors = this.state.colors.slice();
    this.dfs(
        this.state.mapArray[index],
        (node,options)=>
        {
          if(node.symbol==="()")
          {
            options.colors[node.index[0]] = "rgb(255, 212, 128)";
            options.colors[node.index[1]] = "rgb(255, 212, 128)";
          }
          options.colors[node.index] = "rgb(255, 212, 128)";
        },
        {colors:colors});
    this.setState({colors:colors});
  }

  onMouseOut(index){
    var colors = this.state.colors.slice();
    this.dfs(
        this.state.mapArray[index],
        (node,options)=>{
          if(node.symbol==="()")
          {
            options.colors[node.index[0]] = "rgb(255,255,255)";
            options.colors[node.index[1]] = "rgb(255,255,255)";
          }
          options.colors[node.index] = "rgb(255,255,255)";
        },
        {colors:colors});
    this.setState({colors:colors});
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
      var alpha = this.state.colors[index];

      return(
      <span
        key={index}
        onMouseOver={()=>this.onMouseOver(index)}
        onMouseOut={()=>this.onMouseOut(index)}
        style={{backgroundColor:alpha}}
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
