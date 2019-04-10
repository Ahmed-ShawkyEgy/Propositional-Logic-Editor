import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import { Container, Row, Col,Card,Collapse,CardBody } from 'reactstrap';
import peg from "pegjs";

class Formula extends Component{

  constructor(props){
    super(props);
    this.state = {collapse:true};
  }

  toggle()
  {
    this.setState({collapse:!this.state.collapse});
  }

  render()
  {
    var excercise = this.props.excercise;
    return (
      <div className="step">
        <a onClick={() => {this.toggle();}} href="#">10. Initial formula</a>
        <Collapse isOpen={this.state.collapse}>
        <Card className="step-body">
          <CardBody>
          {this.props.body}
          </CardBody>
        </Card>
      </Collapse>
      </div>
    );
  }
}

export default Formula;
