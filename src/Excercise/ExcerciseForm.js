import React, { Component } from 'react';
import FormulaEditor from './FormulaEditor';
import Duallist from 'react-duallist';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';

import 'react-duallist/lib/react_duallist.css'

class ExcerciseForm extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const operators = this.props.operators;
    var transformations = this.props.transformations.slice();
    var selectedTransformations = [];
    return (
      <Form>
      <h1>Create New Excercise</h1>

      <FormGroup>
      <Label for="exampleText">Problem Statement</Label>
      <Input type="textarea" name="text" id="exampleText" rows='4' />
      </FormGroup>

      <FormulaEditor operators={operators} title="Starting Formula"/>

      <FormulaEditor operators={operators} title="Target Formula"/>

        <FormGroup tag="fieldset">
            <legend>Show Target Formula:</legend>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="showFormula" checked='checked'/>
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="showFormula"/>
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
