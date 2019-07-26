import React, { Component } from 'react';
import FormulaEditor from './FormulaEditor';
import DualListBox from 'react-dual-listbox';
import {Button, Form, FormGroup, Label, Input,Container} from 'reactstrap';
import peg from "pegjs";
import SweetAlert from 'react-bootstrap-sweetalert';

import 'react-duallist/lib/react_duallist.css'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.min.css';


class ExcerciseForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      hints:"",
      problemStatement:"",
      startingFormula:"",
      targetFormula:"",
      showToUser:true,
      transformationRules:[],
      popup:null,
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
    var excercise = {};
    Object.assign(excercise,this.state);
    excercise.hints = excercise.hints.split(/\r?\n/);
    for(var i = 0; i < excercise.transformationRules.length; i++)
    {
      var rule = {};
      Object.assign(rule,this.props.transformations[i]);
      excercise.transformationRules[i] = rule;
      excercise.transformationRules[i].value = excercise.transformationRules[i].label;
    }

    if(this.parser)
    {
      try{
        this.parser.parse(this.state.startingFormula);
      }
      catch(err){
        console.log("Failed to parse Starting Formula");
        console.log(err.message);
        this.setState({popup:(<SweetAlert
          danger
          title="Failed to parse the starting formula"
          onConfirm={() => this.onPopupClose()}
        >
        {err.message}
      </SweetAlert>
      )});

        return;
      }
      try {
        this.parser.parse(this.state.targetFormula);
      } catch (err) {
        console.log("Failed to parse Target Formula");
        console.log(err.message);

        this.setState({popup:(<SweetAlert
          danger
          title="Failed to parse the target formula"
          onConfirm={() => this.onPopupClose()}
        >
        {err.message}
      </SweetAlert>
      )});

        return;
      }
      console.log("All formulas have been successfully parsed");
      console.log(excercise);

      this.setState({popup:(<SweetAlert
        success
        title="Excercise created successfully!"
        onConfirm={() => this.onPopupClose()}
      />)});

      return;
    }
    console.log("Parser not ready");
  }


  onPopupClose()
  {
    this.setState( {popup:null} );
  }

  render() {
    const operators = this.props.operators;
    const availableTransformations = this.props.transformations.slice();
    return (
      <Container>
        {this.state.popup}
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


          <FormGroup>
            <Label for="hints">Hints</Label>
            <Input
              type="textarea"
              name="hints"
              id="hints"
              value={this.state.hints}
              onChange={this.handleChange}
              rows='4'
            />
          </FormGroup>


        <h4>
        Select Transformations
        </h4>

        <DualListBox
          options={availableTransformations}
          selected={this.state.transformationRules}
          onChange={(selected) => {
                    this.setState({transformationRules:selected});
                }}
        />

      <Button type="submit" color="primary" id="submit" size="lg" block>Submit</Button>

      </Form>
      </Container>
    );
  }
}


export default ExcerciseForm;
