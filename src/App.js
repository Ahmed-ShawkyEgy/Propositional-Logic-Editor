import React, { Component } from 'react';
import ExcerciseForm from './Excercise/ExcerciseForm.js';
import Editor from './Editor/Editor.js';
class App extends Component {


  render() {
    const operators = ['∨','∧','→','↔','⊤','⊥','¬'];
    const transformations = [
      {value:"0", label:"¬¬a≡a", comment:"Double Negation Resolved"},
      {value:"1" , label:"a→b≡¬(a)∨(b)",comment:"Implication Resolved"},
      {value:"2", label:"a↔b≡(¬(a)∨b)∧(¬(b)∨a)", comment:"Equivilance Resolved"},
      {value:"3", label:"a∨(b∧c)≡(a∨b)∧(a∨c)", comment:"Distributivity Applied"},
      {value:"4", label:"a∧(b∨c)≡(a∧b)∨(a∧c)", comment:"Distributivity Applied"},
      {value:"5",label:"¬(a∧b)≡(¬(a)∨¬(b))", comment:"Negation Distributed"},
      {value:"6",label:"¬(a∨b)≡(¬(a)∧¬(b))",comment:"Negation Distributed"},

      {value:"7", label:"a∨b≡b∨a"},
      {value:"8",label:"a∧(b∧c)≡a∧b∧c"},
      {value:"9",label:"(b∧c)∧a≡b∧c∧a"},
      {value:"10",label:"a∨(b∨c)≡a∨b∨c"},
      {value:"11",label:"(a∨b)∨c≡a∨b∨c"},
      // {label:"(Ф<sub>0</sub>)≡Ф<sub>0</sub>", value:"(a)≡a"},
    ];

    let Excercise = {
      problemStatement:"Your task in this excercise is to use the transformation rules on the right and apply them on the given formula to reach at the end a formula that is in valid conjiunctive normal form",
      startingFormula:"a*(b+c)-(b+a)",
      targetFormula:"a*(c+b)-b-a",
      showToUser:true,
      hints:[
        "Try to distribute all the negative signs first",
        "The answer must match exactly with the target formula",
        "Extra brackets don't affect the solution",
        "Always distribute the negative sign",
      ],
      transformationRules:[
        {label:"Ф<sub>0</sub>+Ф<sub>1</sub>≡Ф<sub>1</sub>+Ф<sub>0</sub>", value:"a+b≡b+a", comment:"Associativity resolved"},
        {label:"Ф<sub>0</sub>-Ф<sub>1</sub>≡Ф<sub>1</sub>-Ф<sub>0</sub>", value:"a-b≡b-a", comment:"Associativity resolved"},
        {label:"Ф<sub>0</sub>*Ф<sub>1</sub>≡Ф<sub>1</sub>*Ф<sub>0</sub>", value:"a*b≡b*a", comment:"Associativity resolved"},
        {label:"~~Ф<sub>0</sub>≡Ф<sub>0</sub>", value:"~~a≡a", comment:"Double negation resolved"},
        {label:"Ф<sub>0</sub>-(Ф<sub>1</sub>+Ф<sub>2</sub>)≡Ф<sub>0</sub>-Ф<sub>1</sub>-Ф<sub>2</sub>", value:"a-(b+c)≡a-b-c", comment:"Negation Distributed"},
        {label:"Ф<sub>0</sub>-(Ф<sub>1</sub>-Ф<sub>2</sub>)≡Ф<sub>0</sub>-Ф<sub>1</sub>+Ф<sub>2</sub>", value:"a-(b-c)≡a-b+c", comment:"Negation Distributed"},
        // {label:"Ф<sub>0</sub>→Ф<sub>1</sub>≡¬Ф<sub>0</sub>∨Ф<sub>1</sub>" , value:"a→b≡¬(a)∨(b)",comment:"Implication Resolved"},
        // {label:"Ф<sub>0</sub>↔Ф<sub>1</sub>≡(¬Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(¬Ф<sub>1</sub>∨Ф<sub>0</sub>)", value:"a↔b≡(¬(a)∨b)∧(¬(b)∨a)", comment:"Equivilance Resolved"},
        // {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡(Ф<sub>0</sub>∨Ф<sub>1</sub>)∧(Ф<sub>0</sub>∨Ф<sub>2</sub>)", value:"a∨(b∧c)≡(a∨b)∧(a∨c)", comment:"Distributivity Applied"},
        // {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡(Ф<sub>0</sub>∧Ф<sub>1</sub>)∨(Ф<sub>0</sub>∧Ф<sub>2</sub>)", value:"a∧(b∨c)≡(a∧b)∨(a∧c)", comment:"Distributivity Applied"},
        // {label:"¬(Ф<sub>0</sub>∧Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∨¬Ф<sub>1</sub>",value:"¬(a∧b)≡(¬(a)∨¬(b))", comment:"Negation Distributed"},
        // {label:"¬(Ф<sub>0</sub>∨Ф<sub>1</sub>)≡¬Ф<sub>0</sub>∧¬Ф<sub>1</sub>",value:"¬(a∨b)≡(¬(a)∧¬(b))",comment:"Negation Distributed"},

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

        // {label:"Ф<sub>0</sub>∨Ф<sub>1</sub>≡Ф<sub>1</sub>∨Ф<sub>0</sub>", value:"a∨b≡b∨a"},
        // {label:"Ф<sub>0</sub>∧(Ф<sub>1</sub>∧Ф<sub>2</sub>)≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"a∧(b∧c)≡a∧b∧c"},
        // {label:"(Ф<sub>0</sub>∧Ф<sub>1</sub>)∧Ф<sub>2</sub>≡Ф<sub>0</sub>∧Ф<sub>1</sub>∧Ф<sub>2</sub>",value:"(b∧c)∧a≡b∧c∧a"},
        // {label:"Ф<sub>0</sub>∨(Ф<sub>1</sub>∨Ф<sub>2</sub>)≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"a∨(b∨c)≡a∨b∨c"},
        // {label:"(Ф<sub>0</sub>∨Ф<sub>1</sub>)∨Ф<sub>2</sub>≡Ф<sub>0</sub>∨Ф<sub>1</sub>∨Ф<sub>2</sub>",value:"(a∨b)∨c≡a∨b∨c"},
        // {label:"(Ф<sub>0</sub>)≡Ф<sub>0</sub>", value:"(a)≡a"},
      ],
    };
    return (
      <div>
        {

          // <ExcerciseForm
          //   operators={operators}
          //   transformations={transformations}
          //   />
        }

      <Editor
        excercise={Excercise}/>

    </div>
    );
  }
}

export default App;
