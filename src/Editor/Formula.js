import React, { Component } from 'react';
import { Card,Collapse,CardBody } from 'reactstrap';

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
    return (
      <div className="step">
        <a onClick={() => {this.toggle();}} href="#">{this.props.header}</a>
        <Collapse isOpen={this.state.collapse}>
        <Card className="step-body">
          <CardBody>
          {this.props.body}
          <hr/>
          Ф<sub>1</sub> = ( a → b )
          </CardBody>
        </Card>
      </Collapse>
      </div>
    );
  }
}

export default Formula;
