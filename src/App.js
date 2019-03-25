import React, { Component } from 'react';
import ExcerciseForm from './Excercise/ExcerciseForm.js';

class App extends Component {

  render() {
    const operators = ['∨','∧','→','↔','⊤','⊥','¬'];
    const transformations = [
      {label:"a→b = ¬a∨b", value:"0"},
      {label:"a∨b = b∨a", value:"1"},
      {label:"¬(a∨b) = ¬a∧-b", value:"2"}
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
