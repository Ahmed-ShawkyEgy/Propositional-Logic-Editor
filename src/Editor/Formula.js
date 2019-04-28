import React, { Component } from 'react';
import { Card,Collapse,CardBody } from 'reactstrap';
import ParserUtil from '../Util/ParserUtility'
import { Row,Col } from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';

class Formula extends Component{

  constructor(props){
    super(props);
    this.state = {collapse:true};
    // console.log(ParserUtil.infixNotation(null));
  }

  toggle()
  {
    this.setState({collapse:!this.state.collapse});
  }

  render()
  {
    var subFormulas = "";
    if(this.props.subFormulas)
      subFormulas = this.props.subFormulas.slice().map((tree,idx)=>{
        var treeIndex = Array.isArray(tree.index)?tree.index[0]:tree.index;
        return(
          <Row>
            <Col lg="11">
           <div

             className="sub-formula"
             onMouseOver={()=>{this.props.onSubFormulaHover(treeIndex)}}
             onMouseOut={()=>{this.props.onSubFormulaOut(treeIndex)}}
             >
              Ф<sub>{idx}</sub> = {ParserUtil.infixNotation(tree)}<br/>
          </div>
          </Col>
          <Col lg="1"
            >
            <div
              className="fa fa-times-circle sub-formula-remove "
              aria-hidden="true"
              onMouseOver={()=>{this.props.onSubFormulaHover(treeIndex)}}
              onMouseOut={()=>{this.props.onSubFormulaOut(treeIndex)}}
              onClick={()=>{this.props.onSubFormulaRemove(tree)}}
              >
            </div>
          </Col>
        </Row>
        )}) ;


    return (
      <div className="step">
        <a onClick={(e) => {e.preventDefault(); this.toggle();}} href="#" className="step-header">{this.props.header}</a>
        <Collapse isOpen={this.state.collapse}>
        <Card className="step-body">
          <CardBody>
          <div>
              {this.props.body}
          </div>
          {subFormulas.length>0?<hr/>:""}
          {subFormulas}
      </CardBody>
        </Card>
      </Collapse>
      </div>
    );
  }
}

export default Formula;
