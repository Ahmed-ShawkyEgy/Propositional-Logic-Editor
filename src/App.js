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
      startingFormula:"(d→b)∧(b→(d∧u))∧¬((b∧d)∧u)∧d",
      // startingFormula:"((((((d→b))))))",
      targetFormula:"¬a∨b",
      transformationRules:[
        {label:"¬¬Ф<sub>0</sub>≡Ф<sub>0</sub>", value:"¬¬a≡a", comment:"Double Negation Resolved"},
        {label:"Ф<sub>0</sub>→Ф<sub>1</sub>≡¬Ф<sub>0</sub>∨Ф<sub>1</sub>" , value:"a→b≡¬(a)∨(b)",comment:"Implication Resolved"},
        {label:"Ф<sub>0</sub>↔Ф<sub>1</sub>≡(¬Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(¬Ф<sub>1</sub>∨Ф<sub>0</sub>)", value:"a↔b≡(¬(a)∨b)∧(¬(b)∨a)", comment:"Equivilance Resolved"},
        {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡(Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(Ф<sub>0</sub>∨Ф<sub>2</sub>)", value:"a∨(b∧c)≡(a∨b)∧(a∨c)", comment:"Distributivity Applied"},
        {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡(Ф<sub>0</sub>∧Ф<sub>1</sub>)∨(Ф<sub>0</sub>∧Ф<sub>2</sub>)", value:"a∧(b∨c)≡(a∧b)∨(a∧c)", comment:"Distributivity Applied"},
        {label:"¬(Ф<sub>0</sub>∧Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∨¬Ф<sub>1</sub>",value:"¬(a∧b)≡(¬(a)∨¬(b))", comment:"Negation Distributed"},
        {label:"¬(Ф<sub>0</sub>∨Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∧¬Ф<sub>1</sub>",value:"¬(a∨b)≡(¬(a)∧¬(b))",comment:"Negation Distributed"},

        {label:"⊥∧Ф<sub>0</sub>≡⊥",value:"⊥∧a≡⊥"},
        {label:"Ф<sub>0</sub>∧⊥≡⊥",value:"a∧⊥≡⊥"},
        {label:"⊥∨Ф<sub>0</sub>≡Ф<sub>0</sub>",value:"⊥∨a≡a"},
        {label:"Ф<sub>0</sub>∨⊥≡Ф<sub>0</sub>",value:"a∨⊥≡a"},

        {label:"⊤∧Ф<sub>0</sub>≡Ф<sub>0</sub>",value:"⊤∧a≡a"},
        {label:"Ф<sub>0</sub>∧⊤≡Ф<sub>0</sub>",value:"a∧⊤≡a"},
        {label:"⊤∨Ф<sub>0</sub>≡⊤",value:"⊤∨a≡⊤"},
        {label:"Ф<sub>0</sub>∨⊤≡⊤",value:"a∨⊤≡⊤"},

        {label:"¬⊥≡⊤",value:"¬⊥≡⊤"},
        {label:"¬⊤≡⊥",value:"¬⊤≡⊥"},

        {label:"Ф<sub>0</sub>∨Ф<sub>1</sub>≡Ф<sub>1</sub>∨Ф<sub>0</sub>", value:"a∨b≡b∨a"},
        {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"a∧(b∧c)≡a∧b∧c"},
        {label:"(Ф<sub>0</sub>∧Ф<sub>1</sub>)∧Ф<sub>2</sub>≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"(b∧c)∧a≡b∧c∧a"},
        {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"a∨(b∨c)≡a∨b∨c"},
        {label:"(Ф<sub>0</sub>∨Ф<sub>1</sub>)∨Ф<sub>2</sub>≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"(a∨b)∨c≡a∨b∨c"},
        {label:"(Ф<sub>0</sub>)≡Ф<sub>0</sub>", value:"(a)≡a"},
      ],
    };
    return (
      <div >
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
