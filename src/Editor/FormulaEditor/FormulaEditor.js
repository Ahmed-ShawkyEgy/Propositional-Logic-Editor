import React, { Component } from 'react';
import peg from "pegjs";

class FormulaEditor extends Component{

  constructor(props){
    super(props);
  }

  render()
  {
    var excercise = this.props.excercise;
    return (
      <div className="row">
        <div className="col-m-8">
          <MainPanel/>
        </div>
        <div className="col-m-4">
          <TransformationsBar/>
        </div>
      </div>
    );
  }
}

export default FormulaEditor;
