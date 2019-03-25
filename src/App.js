import React, { Component } from 'react';
import ExcerciseForm from './Excercise/ExcerciseForm.js';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const operators = ['v','^','->','<->'];
    const transformations = [
      {label:"a->b = -avb", value:"0"},
      {label:"avb = bva", value:"1"},
      {label:"-(avb) = -a^-b", value:"2"}
    ];
    return (
      <ExcerciseForm
        operators={operators}
        transformations={transformations}
        />
    );
  }
}

export default App;
