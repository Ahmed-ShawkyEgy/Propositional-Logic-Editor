import React, { Component } from 'react';
import {Button, FormGroup, Label, Input,ButtonGroup } from 'reactstrap';

class FormulaEditor extends Component {
  render() {
    const buttons = this.props.operators.map((button)=>(
      <Button
        key={button}
        onClick={this.props.onClick}
        value={button}
        name={this.props.name}
        >{button}</Button>));

    return (
      <FormGroup>
        <Label>
          {this.props.title}
        </Label>

        <Input
          type='text'
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
          autocomplete="off"
          />

        <ButtonGroup  className="button-list">
          {buttons}
        </ButtonGroup >
    </FormGroup>
    );
  }
}

export default FormulaEditor;
