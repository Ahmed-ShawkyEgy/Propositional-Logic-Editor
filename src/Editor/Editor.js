import React, { Component } from 'react';
import peg from "pegjs";
import { Container, Row, Col, } from 'reactstrap';
import './Editor.css';
import 'font-awesome/css/font-awesome.min.css';
import Formula from './Formula';

class Editor extends Component{

  constructor(props){
    super(props);

    this.onSubFormulaMouseOver = this.onSubFormulaMouseOver.bind(this);
    this.onSubFormulaMouseOut = this.onSubFormulaMouseOut.bind(this);

    this.state = {
      currentFormulaHeader:"1. InitialFormula",
      currentFormula:this.props.excercise.startingFormula,

      // colors is used to define the highlighting color of the sub-formulas
      colors:new Array(props.excercise.startingFormula.length).fill(0),

      // mapArray is used to map each atom in the formula to the corresponding node in the parsing tree
      mapArray: new Array(props.excercise.startingFormula.length).fill(null),

      subFormulas: [],
    };

    this.statics = {
      HIGHLIGHT_COLOR:"rgb(255,212,128)",
      SELECT_COLOR:"rgb(170, 240,190)",
      DESELECT_COLOR:"rgb(255,255,255)"
    }

  }

  componentDidMount() {
    fetch('/Grammer/ExtendedLogicParsingGrammer.txt').then((r) => r.text())
    .then(text  => {
      // Create the parser
      this.parser = peg.generate(text);
      // Generate the parsing tree
      var tree = this.parser.parse(this.state.currentFormula);
      // console.log(tree);
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

  // A generic dfs function that runs a dfs traversal at a given node and applies the function fn
  // on each node while passing the object params to fn
  dfs(currentNode,fn,params)
  {
    if(!currentNode)return;
    fn(currentNode,params);
    this.dfs(currentNode.left,fn,params);
    this.dfs(currentNode.right,fn,params);
  }

  select(root , subFormulas){
    subFormulas.push(root);
    this.dfs(root,(node,params)=>{
      node.isSelected = true;
      node.subFormulaIndex = params.subFormulaIndex;
    },{subFormulaIndex:subFormulas.length});
  }

  deSelect(root , subFormulas){
    console.log(root);
    this.dfs(root,
      (node,params)=>{
        node.isSelected = false;
      }
    );
    for (var i = 0; i < subFormulas.length; i++) {
      if(!subFormulas[i].isSelected)
      {
        subFormulas.splice(i--,1);
      }
    }
  }


  onSubFormulaClick(index){
    var root = this.state.mapArray[index];
    if(!root)return;
    if(!root.isSelected)
    {
      var subFormulas = this.state.subFormulas.slice();
      this.deSelect(root,subFormulas);
      this.select(root,subFormulas);
      this.setState({subFormulas:subFormulas})
    }

  }

  onSubFormulaMouseOver(index){
    var colors = this.state.colors.slice();
    this.dfs(
        this.state.mapArray[index],
        (node,params)=>
        {
          if(node.symbol==="()")
          {
            params.colors[node.index[0]] = this.statics.HIGHLIGHT_COLOR;
            params.colors[node.index[1]] = this.statics.HIGHLIGHT_COLOR;
          }
          params.colors[node.index] = this.statics.HIGHLIGHT_COLOR;
        },
        {colors:colors});
    this.setState({colors:colors});
  }

  onSubFormulaMouseOut(index){
    var colors = this.state.colors.slice();
    this.dfs(
        this.state.mapArray[index],
        (node,params)=>{
          if(node.symbol==="()")
          {
            params.colors[node.index[0]] = this.statics.DESELECT_COLOR;
            params.colors[node.index[1]] = this.statics.DESELECT_COLOR;

            if(node.isSelected)
            {
              params.colors[node.index[0]] = this.statics.SELECT_COLOR;
              params.colors[node.index[1]] = this.statics.SELECT_COLOR;
            }
          }
          params.colors[node.index] = this.statics.DESELECT_COLOR;
          if(node.isSelected)
          {
            params.colors[node.index] = this.statics.SELECT_COLOR;
          }
        },
        {colors:colors});
    this.setState({colors:colors});
  }

  render()
  {
      var currentFormula = this.state.currentFormula.split("").map((atom,index)=>{
        var color = this.state.colors[index];

        return(
        <span
          key={index}
          onMouseOver={()=>this.onSubFormulaMouseOver(index)}
          onMouseOut={()=>this.onSubFormulaMouseOut(index)}
          onClick={()=>this.onSubFormulaClick(index)}
          style={{backgroundColor:color}}
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
                       subFormulas={this.state.subFormulas}
                       onSubFormulaHover={this.onSubFormulaMouseOver}
                       onSubFormulaOut={this.onSubFormulaMouseOut}
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
