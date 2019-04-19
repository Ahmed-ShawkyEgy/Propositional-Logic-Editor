import React, { Component } from 'react';
import { Card,Collapse,CardBody } from 'reactstrap';
import ParserUtil from '../Util/ParserUtility'
import { Row,Col } from 'reactstrap';

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
        return(
          <Row>
            <Col lg="12">
           <div

             className="sub-formula"
             onMouseOver={()=>{this.props.onSubFormulaHover(tree.index)}}
             onMouseOut={()=>{this.props.onSubFormulaOut(tree.index)}}
             >
              Ф<sub>{idx}</sub> = {ParserUtil.infixNotation(tree)}<br/>
          </div>
          </Col>
        </Row>
        )}) ;


    return (
      <div className="step">
        <a onClick={() => {this.toggle();}} href="#">{this.props.header}</a>
        <Collapse isOpen={this.state.collapse}>
        <Card className="step-body">
          <CardBody>
          {this.props.body}
          <hr/>
          {subFormulas}
      </CardBody>
        </Card>
      </Collapse>
      </div>
    );
  }
}

export default Formula;
