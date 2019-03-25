import React, { Component } from 'react';
import {Button, FormGroup, Label, Input,ButtonGroup } from 'reactstrap';

class FormulaEditor extends Component {
  render() {
    const buttons = this.props.operators.map((button)=><Button key={button}>{button}</Button>);

    return (
      <FormGroup>
        <Label>
          {this.props.title}
        </Label>

        <Input type='text'/>

        <ButtonGroup  className="button-list">
          {buttons}
        </ButtonGroup >
    </FormGroup>
    );
  }
}

export default FormulaEditor;
