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
      // Build the indexArray
      this.setState({indexArray:this.buildIndexArray(tree,this.state.currentFormula)})
      console.log();
      console.log(tree);
    })
  }


  buildIndexArray(tree,formula)
  {
    var  compressedFormula = formula.split("")
    .map((atom,index)=>{return {value:atom,index:index}})
    .filter((element)=>{return element.value!==')' && element.value!=='(' && element.value!==' '});
    var indexArray = new Array(formula.length).fill(null);

    this.buildIndexArrayDfs(tree,indexArray,0,compressedFormula);
    return indexArray;
  }

  buildIndexArrayDfs(currentNode,indexArray,currentIndex,compressedFormula)
  {
    // console.log(currentNode,indexArray,currentIndex);
    if(!currentNode)
      return currentIndex;
    if(!currentNode.right)
    {
        indexArray[compressedFormula[currentIndex].index] = currentNode;
        currentNode.index = compressedFormula[currentIndex].index;
        return currentIndex+1;
    }
    currentIndex = this.buildIndexArrayDfs(currentNode.left,indexArray,currentIndex,compressedFormula);

    currentNode.index = compressedFormula[currentIndex].index;
    indexArray[compressedFormula[currentIndex++].index] = currentNode;

    return this.buildIndexArrayDfs(currentNode.right,indexArray,currentIndex,compressedFormula);
  }


  updateTree(currentNode,key,value)
  {
    if(!currentNode)return;
    currentNode[key] = value;
    this.updateTree(currentNode.left,key,value);
    this.updateTree(currentNode.right,key,value);
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

  render()
  {
    // var excercise = this.props.excercise;
      var currentFormula = this.state.currentFormula.split("").map((atom,index)=>{
      var alpha = this.state.alphaColorArray[index];
      // var alpha = 0;
      // if(this.state.indexArray[index])
        // alpha = this.state.indexArray[index].highlight;
      console.log(alpha);
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
