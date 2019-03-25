import React, { Component } from 'react';
import FormulaEditor from './FormulaEditor';
import Duallist from 'react-duallist';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';

import 'react-duallist/lib/react_duallist.css'

class ExcerciseForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      problemStatement:"",
      startingFormula:"",
      targetFormula:"",
      showToUser:true,
      availableTransformations: this.props.transformations.slice(),
      selectedTransformations:[]
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    console.log(event.target.value);
    const target = event.target;
    const value = target.type === 'radio' ? (target.value==='n'?false:true) : target.value;
    const name = target.name;
   this.setState({
     [name]: value
   });
  }

  render() {
    const operators = this.props.operators;
    var transformations = this.props.transformations.slice();
    var selectedTransformations = [];
    return (
      <Form>
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
        />

      <FormulaEditor
        operators={operators}
        title="Target Formula"
        name="targetFormula"
        value={this.state.targetFormula}
        onChange={this.handleChange}
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
        <Duallist
          available={transformations}
          selected={selectedTransformations}
          onMove={this.onMove}
          sortable={false}
          searchable={false}
        />
         <Button color="primary" id="submit" size="lg" block>Submit</Button>

      </Form>
    );
  }
}


export default ExcerciseForm;
