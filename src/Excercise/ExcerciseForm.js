import React, { Component } from 'react';
import FormulaEditor from './FormulaEditor';
import DualListBox from 'react-dual-listbox';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import peg from "pegjs";

import 'react-duallist/lib/react_duallist.css'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.min.css';


class ExcerciseForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      problemStatement:"",
      startingFormula:"",
      targetFormula:"",
      showToUser:true,
      selectedTransformations:[]
    };
    this.parser = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/Grammer/LogicParsingGrammer.txt').then((r) => r.text())
    .then(text  => {
      this.parser = peg.generate(text);
    })
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === 'radio' ? (target.value==='n'?false:true) : target.value;
    const name = target.name;
   this.setState({
     [name]: value
   });
  }

  handleButtonClick(event){
    const newValue = this.state[event.target.name] + event.target.value;
    this.setState({
      [event.target.name]:newValue
    });
  }

  onSubmit(e){
    e.preventDefault();
    console.log(this.state.selectedTransformations);
    if(this.parser)
    {
      try{
        this.parser.parse(this.state.startingFormula);
      }
      catch(err){
        console.log("Failed to parse Starting Formula");
        console.log(err.message);
        return;
      }
      try {
        this.parser.parse(this.state.targetFormula);
      } catch (err) {
        console.log("Failed to parse Target Formula");
        console.log(err.message);
        return;
      }
      console.log("Successfull login");
      return;
    }
    console.log("Parser not ready");
  }

  render() {
    const operators = this.props.operators;
    const availableTransformations = this.props.transformations.slice();
    return (
      <Form onSubmit={this.onSubmit}>
      <h1>Create New Excercise</h1>

      <FormGroup>
        <Label for="problemStatement">Problem Statement</Label>
        <Input
          type="textarea"
          name="problemStatement"
          id="problemStatement"
          value={this.state.problemStatement}
          onChange={this.handleChange}
          rows='4'
        />
      </FormGroup>

      <FormulaEditor
        operators={operators}
        title="Starting Formula"
        name="startingFormula"
        value={this.state.startingFormula}
        onChange={this.handleChange}
        onClick={this.handleButtonClick}
        />

      <FormulaEditor
        operators={operators}
        title="Target Formula"
        name="targetFormula"
        value={this.state.targetFormula}
        onChange={this.handleChange}
        onClick={this.handleButtonClick}
        />

        <FormGroup tag="fieldset">
            <legend>Show Target Formula:</legend>
            <FormGroup check>
              <Label check>
                <Input
                type="radio"
                name="showToUser"
                value="y"
                onChange={this.handleChange}
                checked={this.state.showToUser}/>
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                type="radio"
                name="showToUser"
                value="n"
                onChange={this.handleChange}
                checked={!this.state.showToUser}/>
                No
              </Label>
            </FormGroup>
          </FormGroup>


        <h4>
        Select Transformations
        </h4>

        <DualListBox
          options={availableTransformations}
          selected={this.state.selectedTransformations}
          onChange={(selected) => {
                    this.setState({selectedTransformations:selected});
                }}
        />

      <Button type="submit" color="primary" id="submit" size="lg" block>Submit</Button>

      </Form>
    );
  }
}


export default ExcerciseForm;
