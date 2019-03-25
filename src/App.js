import React, { Component } from 'react';
import ExcerciseForm from './Excercise/ExcerciseForm.js';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const operators = ['∨','∧','→','↔','⊤','⊥','¬'];
    const transformations = [
      {label:"a->b = -avb", value:"0"},
      {label:"avb = bva", value:"1"},
      {label:"-(avb) = -a^-b", value:"2"}
    ];
    return (
      <div className="container">
      <ExcerciseForm
        operators={operators}
        transformations={transformations}
        />
      </div>
    );
  }
}

export default App;
