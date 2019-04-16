import React, { Component } from 'react';
// import ExcerciseForm from './Excercise/ExcerciseForm.js';
import Editor from './Editor/Editor.js';
class App extends Component {


  render() {
    // const operators = ['∨','∧','→','↔','⊤','⊥','¬'];
    // const transformations = [
    //   {label:"a→b = ¬a∨b", value:"0"},
    //   {label:"a∨b = b∨a", value:"1"},
    //   {label:"¬(a∨b) = ¬a∧-b", value:"2"}
    // ];

    let Excercise = {
      problemStatement:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      startingFormula:"(a→b) ∨ (c→d)",
      // startingFormula:"(a→b)",
      targetFormula:"¬a∨b"
    };
    return (
      <div className="container">
      {
        //<ExcerciseForm
          //operators={operators}
          //transformations={transformations}
          ///>
      }
      <Editor
        excercise={Excercise}
        />
      </div>
    );
  }
}

export default App;
