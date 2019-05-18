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
      problemStatement:"Your task in this excercise is to use the transformation rules on the right and apply them on the given formula to reach at the end a formula that is in valid conjiunctive normal form",
      startingFormula:"(d→b)∧(b→(d∧u))∧¬((b∧d)∧u)∧d",
      // startingFormula:"((((((d→b))))))",
      targetFormula:"(¬d∨b)∧(¬b∨d)∧(¬b∨u)∧(¬b∨¬d∨¬u)∧d",
      showToUser:true,
      transformationRules:[
        {label:"¬¬Ф<sub>0</sub>≡Ф<sub>0</sub>", value:"¬¬a≡a", comment:"Double Negation Resolved"},
        {label:"Ф<sub>0</sub>→Ф<sub>1</sub>≡¬Ф<sub>0</sub>∨Ф<sub>1</sub>" , value:"a→b≡¬(a)∨(b)",comment:"Implication Resolved"},
        {label:"Ф<sub>0</sub>↔Ф<sub>1</sub>≡(¬Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(¬Ф<sub>1</sub>∨Ф<sub>0</sub>)", value:"a↔b≡(¬(a)∨b)∧(¬(b)∨a)", comment:"Equivilance Resolved"},
        {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡(Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(Ф<sub>0</sub>∨Ф<sub>2</sub>)", value:"a∨(b∧c)≡(a∨b)∧(a∨c)", comment:"Distributivity Applied"},
        {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡(Ф<sub>0</sub>∧Ф<sub>1</sub>)∨(Ф<sub>0</sub>∧Ф<sub>2</sub>)", value:"a∧(b∨c)≡(a∧b)∨(a∧c)", comment:"Distributivity Applied"},
        {label:"¬(Ф<sub>0</sub>∧Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∨¬Ф<sub>1</sub>",value:"¬(a∧b)≡(¬(a)∨¬(b))", comment:"Negation Distributed"},
        {label:"¬(Ф<sub>0</sub>∨Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∧¬Ф<sub>1</sub>",value:"¬(a∨b)≡(¬(a)∧¬(b))",comment:"Negation Distributed"},

        // {label:"⊥∧Ф<sub>0</sub>≡⊥",value:"⊥∧a≡⊥"},
        // {label:"Ф<sub>0</sub>∧⊥≡⊥",value:"a∧⊥≡⊥"},
        // {label:"⊥∨Ф<sub>0</sub>≡Ф<sub>0</sub>",value:"⊥∨a≡a"},
        // {label:"Ф<sub>0</sub>∨⊥≡Ф<sub>0</sub>",value:"a∨⊥≡a"},
        //
        // {label:"⊤∧Ф<sub>0</sub>≡Ф<sub>0</sub>",value:"⊤∧a≡a"},
        // {label:"Ф<sub>0</sub>∧⊤≡Ф<sub>0</sub>",value:"a∧⊤≡a"},
        // {label:"⊤∨Ф<sub>0</sub>≡⊤",value:"⊤∨a≡⊤"},
        // {label:"Ф<sub>0</sub>∨⊤≡⊤",value:"a∨⊤≡⊤"},
        //
        // {label:"¬⊥≡⊤",value:"¬⊥≡⊤"},
        // {label:"¬⊤≡⊥",value:"¬⊤≡⊥"},

        {label:"Ф<sub>0</sub>∨Ф<sub>1</sub>≡Ф<sub>1</sub>∨Ф<sub>0</sub>", value:"a∨b≡b∨a"},
        {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"a∧(b∧c)≡a∧b∧c"},
        {label:"(Ф<sub>0</sub>∧Ф<sub>1</sub>)∧Ф<sub>2</sub>≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"(b∧c)∧a≡b∧c∧a"},
        {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"a∨(b∨c)≡a∨b∨c"},
        {label:"(Ф<sub>0</sub>∨Ф<sub>1</sub>)∨Ф<sub>2</sub>≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"(a∨b)∨c≡a∨b∨c"},
        // {label:"(Ф<sub>0</sub>)≡Ф<sub>0</sub>", value:"(a)≡a"},
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
