import React, { Component } from 'react';
import peg from "pegjs";
import { Container, Row, Col,Button, } from 'reactstrap';
import './Editor.css';
import 'font-awesome/css/font-awesome.min.css';
import Formula from './Formula';
import ParserUtil from '../Util/ParserUtility'

class Editor extends Component{

  constructor(props){
    super(props);

    this.onSubFormulaMouseOver = this.onSubFormulaMouseOver.bind(this);
    this.onSubFormulaMouseOut = this.onSubFormulaMouseOut.bind(this);
    this.onSubFormulaRemove = this.onSubFormulaRemove.bind(this);
    this.onRuleClick = this.onRuleClick.bind(this);
    this.transformationIsValid = this.transformationIsValid.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.reset = this.reset.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.statics = {
      HIGHLIGHT_COLOR:"rgb(255,212,128)",
      SELECT_COLOR:"rgb(170, 240,190)",
      DESELECT_COLOR:"rgb(255,255,255)"
    }

    this.state = {
      history:[],

      historyIndex:-1,

      // colors is used to define the highlighting color of the sub-formulas
      colors:new Array(props.excercise.startingFormula.length).fill(this.statics.DESELECT_COLOR),

      // mapArray is used to map each atom in the formula to the corresponding node in the parsing tree
      mapArray: new Array(props.excercise.startingFormula.length).fill(null),

      subFormulas: [],
    };

    this.transformationRules = this.props.excercise.transformationRules.slice();
    this.transformationRulesTrees = [];

  }

  componentDidMount() {
    fetch('/Grammer/ExtendedLogicParsingGrammer.txt').then((r) => r.text())
    .then(text  => {
      // Create the parser
      this.parser = peg.generate(text);
      this.setNewFormula("Initial Formula",this.props.excercise.startingFormula);
      this.parseTransformationRules();
    });

  }

  setNewFormula(formulaHeader,formula)
  {
    if(!formulaHeader)
      formulaHeader = "Applied Transformation"
    formulaHeader = this.state.historyIndex+2+". "+formulaHeader;
    var tree = this.parser.parse(formula);
    while(tree.symbol==="()")
      tree = tree.right;
    ParserUtil.attachParentsToTree(tree);
    ParserUtil.removeUselessBrackets(tree);
    formula = ParserUtil.infixNotation(tree);
    var mapArray = this.buildMap(tree,formula);
    this.root = tree;

    var history = this.state.history.slice(0,this.state.historyIndex+1);
    history.push(
      {
        currentFormulaHeader:formulaHeader,
        currentFormula:formula
      });

    this.setState({
      history:history,

      historyIndex:this.state.historyIndex+1,

      // colors is used to define the highlighting color of the sub-formulas
      colors:new Array(formula.length).fill(this.statics.DESELECT_COLOR),

      mapArray:mapArray,

      subFormulas: [],
    });
    this.deSelect(this.root,this.state.subFormulas);
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
    // this.setState({mapArray:mapArray});
    return mapArray;
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
    else if(currentNode.rightParent && currentNode.rightParent.symbol==="()")
    {
      currentIndex = this.buildMapDfs(currentNode.left,mapArray,currentIndex,compressedFormula);

      var parent = currentNode.rightParent;
      currentNode.index = compressedFormula[currentIndex].index;
      mapArray[compressedFormula[currentIndex++].index] = parent;

      return this.buildMapDfs(currentNode.right,mapArray,currentIndex,compressedFormula);
    }
    else{
      currentIndex = this.buildMapDfs(currentNode.left,mapArray,currentIndex,compressedFormula);

      currentNode.index = compressedFormula[currentIndex].index;
      mapArray[compressedFormula[currentIndex++].index] = currentNode;

      return this.buildMapDfs(currentNode.right,mapArray,currentIndex,compressedFormula);
    }
  }

  parseTransformationRules()
  {
    for(var i  = 0; i < this.transformationRules.length;i++)
    {
      var rule = this.transformationRules[i].value;
      var index = rule.indexOf('≡');
      var leftHandSide = rule.substring(0,index);
      var rightHandSide = rule.substring(index+1);
      var tree = {
        leftHandSide:this.parser.parse(leftHandSide),
        rightHandSide:this.parser.parse(rightHandSide)
      };
      this.transformationRulesTrees.push(tree);
    }
  }


  select(root , subFormulas){
    subFormulas.push(root);
    root.isSubFormulaRoot = true;
    ParserUtil.dfs(root,(node,params)=>{
      node.isSelected = true;
      node.subFormulaIndex = params.subFormulaIndex;
    },{subFormulaIndex:subFormulas.length});
  }

  deSelect(root , subFormulas){
    ParserUtil.dfs(root,
      (node,params)=>{
        node.isSelected = false;
        node.isSubFormulaRoot = false;
        node.subFormulaIndex = null;
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

  onSubFormulaRemove(root)
  {
    var subFormulas = this.state.subFormulas.slice();
    this.deSelect(root,subFormulas);
    this.setState({subFormulas:subFormulas})
    this.onSubFormulaMouseOut(Array.isArray(root.index)?root.index[0]:root.index);
  }

  onSubFormulaMouseOver(index){
    var colors = this.state.colors.slice();
    ParserUtil.dfs(
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
    ParserUtil.dfs(
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

  onRuleClick(ruleIndex){
    var transformationStatus = this.transformationIsValid(ruleIndex);
    if(transformationStatus)
    {
      console.log("Valid !!!");
      this.applyTransformation(ruleIndex,transformationStatus.subFormulaRoot,transformationStatus.transformationMap);
      return;
    }
    console.log("transformation is Invalid");
  }

  transformationIsValid(ruleIndex)
  {
    var ruleTree = this.transformationRulesTrees[ruleIndex].leftHandSide;
    // Check if the number of selected subFormulas is the same as the number of atoms
    // of the transformation rule
    if(this.state.subFormulas.length !== ParserUtil.countLeaves(ruleTree))
      return false;
    var transformationAtoms = ParserUtil.getFormulaAtoms(ruleTree);

    return this.checkTransformationMatching(this.root,ruleTree,transformationAtoms);
  }

  checkTransformationMatching(formulaNode,transformationTree,transformationAtoms)
  {
    if(!formulaNode)return null;
    var transformationMap = {};
    for(var i = 0; i < transformationAtoms.length;i++)
      transformationMap[transformationAtoms[i]] = null;
    if(this.checkTransformationMatchingHelper(formulaNode,transformationTree,transformationMap))
    {
      // console.log(transformationMap);
      return {subFormulaRoot:formulaNode,transformationMap:transformationMap};
    }
    return this.checkTransformationMatching(formulaNode.left,transformationTree,transformationAtoms)
    || this.checkTransformationMatching(formulaNode.right,transformationTree,transformationAtoms)
  }

  checkTransformationMatchingHelper(formulaNode,transformationNode,transformationMap)
  {
    if(!transformationNode || !formulaNode)return true;
    // if this is a transformation atom
    if(!transformationNode.left && !transformationNode.right)
    {
      if(!formulaNode.isSubFormulaRoot)return false;
      if(!transformationMap[transformationNode.symbol])
      {
        transformationMap[transformationNode.symbol] = ParserUtil.cloneTree(formulaNode);
        return true;
      }
      else {
        return ParserUtil.compareTrees(transformationMap[transformationNode.symbol] , formulaNode);
      }
    }
    else{
      if(formulaNode.symbol !== transformationNode.symbol)return false;
      return this.checkTransformationMatchingHelper(formulaNode.left,transformationNode.left,transformationMap)
      && this.checkTransformationMatchingHelper(formulaNode.right,transformationNode.right,transformationMap)
    }
  }

  applyTransformation(ruleIndex,subFormulaRoot,transformationMap)
  {
    var ruleTree = ParserUtil.cloneTree(this.transformationRulesTrees[ruleIndex].rightHandSide);
    ParserUtil.attachParentsToTree(ruleTree);

    if(!ruleTree.left && !ruleTree.right)
      ruleTree = transformationMap[ruleTree.symbol];
    else
      this.applyTransformationHelper(ruleTree,transformationMap);

    if(subFormulaRoot.leftParent)
    {
        subFormulaRoot.leftParent.left = ruleTree;
    }
    else if(subFormulaRoot.rightParent)
    {
      subFormulaRoot.rightParent.right = ruleTree;
    }
    else {
      this.root = ruleTree;
    }
    ParserUtil.attachParentsToTree(this.root);

    this.setNewFormula(this.transformationRules[ruleIndex].comment,ParserUtil.infixNotation(this.root));
  }

  applyTransformationHelper(node,transformationMap)
  {
    if(!node)return;
    if(!node.left && !node.right)
    {
      var transformedNode = ParserUtil.cloneTree(transformationMap[node.symbol]);
      if(node.leftParent)
        node.leftParent.left = transformedNode;
      else if(node.rightParent)
        node.rightParent.right = transformedNode;

    }
    else
    {
        this.applyTransformationHelper(node.left,transformationMap);
        this.applyTransformationHelper(node.right,transformationMap);
    }
  }

  undo()
  {
    var index = this.state.historyIndex;
    var history = this.state.history;
    if(index > 0)
    {
      var currentFormula = history[index-1].currentFormula;
      this.root = this.parser.parse(currentFormula);
      ParserUtil.attachParentsToTree(this.root);
      var newMapArray = this.buildMap(this.root,currentFormula);
      this.setState({
        historyIndex:index - 1,
        colors:new Array(history[index-1].currentFormula.length).fill(this.statics.DESELECT_COLOR),
        mapArray: newMapArray,
      });
    }
  }

  redo()
  {
    var index = this.state.historyIndex;
    var history = this.state.history;
    if(index + 1 < history.length)
    {
      var currentFormula = history[index + 1].currentFormula;
      this.root = this.parser.parse(currentFormula);
      ParserUtil.attachParentsToTree(this.root);
      var newMapArray = this.buildMap(this.root,currentFormula);
      this.setState({
        historyIndex:index + 1,
        colors:new Array(history[index + 1].currentFormula.length).fill(this.statics.DESELECT_COLOR),
        mapArray: newMapArray,
      });
    }
  }

  reset()
  {
    var index = 0;
    var history = [this.state.history[0]];
    var currentFormula = history[index].currentFormula;
    this.root = this.parser.parse(currentFormula);
    ParserUtil.attachParentsToTree(this.root);
    var newMapArray = this.buildMap(this.root,currentFormula);
    this.setState({
      history:history,
      historyIndex:index,
      colors:new Array(history[index].currentFormula.length).fill(this.statics.DESELECT_COLOR),
      mapArray: newMapArray,
      subFormulas:[],
    });
  }

  onSubmit()
  {
    if(ParserUtil.isCNF(this.root))
    {
      console.log("Is CNF !!");
    }
    else{
      console.log("Not CNF :*(");
    }
  }

  render()
  {
    var history = this.state.history;
    var historyIndex = this.state.historyIndex;
    var previousFormulas = [];
    var currentFormula = "";
    for(var i = 0; i < historyIndex ;i++)
    {
      previousFormulas.push(
        <Formula
          header={history[i].currentFormulaHeader}
          body={history[i].currentFormula.split("").map((atom,index)=>{
            return(
              <span
                key={index}
                className="atom"
                >
                {atom}
              </span>
            )})}
        />
      );
    }

      if(history.length>0)
      {
        currentFormula = history[historyIndex].currentFormula.split("").map((atom,index)=>{
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
      }

      var transformationRules = this.transformationRules.map((rule,index)=>{return (
        <button
          onClick={()=>this.onRuleClick(index)}
          key={index}
          value={rule.value}
          className="rule"
          dangerouslySetInnerHTML={{__html:rule.label}}></button>
      )});


    var targetFormula = !this.props.excercise.showToUser? "":(
      <div className="sticky-top">
          <Row>
          <Col lg={{size:6,offset:3}}>
            <h2 id="target-formula-header">
              Target Formula
            </h2>
          </Col>
        </Row>
        <Row >
        <Col lg={{size:6,offset:3}}  id="target-formula">
          <h2>
            {this.props.excercise.targetFormula}
          </h2>
        </Col>
      </Row>
    </div>
    );

    return (
      <Container fluid={false}>
     <Row>
       <Col
         md="12"
         lg="12"
         className="main-body">

         <Row>
           <Col lg={{size:10,offset:1}}>
           <h1>
             Problem Statement
           </h1>
           <article id="problem-statement">
             {this.props.excercise.problemStatement}
           </article>
           </Col>
         </Row>

         {targetFormula}

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

                  <button className="btn btn-xs setting shadow-none" onClick={this.undo}><i className="fa fa-undo"></i></button>
                  <button className="btn btn-xs setting shadow-none" onClick={this.redo}><i className="fa fa-repeat"></i></button>
                  <button className="btn btn-xs setting shadow-none" onClick={this.reset}><i className="fa fa-trash"></i></button>

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

                    {previousFormulas}

                     <Formula
                       header={historyIndex!==-1?history[historyIndex].currentFormulaHeader:""}
                       body={currentFormula}
                       subFormulas={this.state.subFormulas}
                       onSubFormulaHover={this.onSubFormulaMouseOver}
                       onSubFormulaOut={this.onSubFormulaMouseOut}
                       onSubFormulaRemove={this.onSubFormulaRemove}
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
                   {transformationRules}
                 </div>
               </Col>

             </Row>

             <Row className="margin">
               <Col lg="12">
               <button id="submit" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
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
