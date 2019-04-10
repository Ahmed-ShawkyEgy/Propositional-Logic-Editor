import React, { Component } from 'react';
import peg from "pegjs";

class MainPanel extends Component{

  constructor(props){
    super(props);
  }

  render()
  {
    var excercise = this.props.excercise;
    return (
      <div className="row">
        <div className="col-m-8">

        </div>
        <div className="col-m-4">

        </div>
      </div>
    );
  }
}

export default MainPanel;
