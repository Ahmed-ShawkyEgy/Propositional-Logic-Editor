import React, { Component } from 'react';

class FormulaEditor extends Component {
  render() {
    const buttons = this.props.operators.map((button)=><button>{button}</button>);

    return (
      <div>
        <label>
          {this.props.title}:
          <FormulaText/>
        </label>
        <div class="button-list">
          {buttons}
        </div>
      </div>
    );
  }
}

class FormulaText extends Component{
  render(){
    return (
      <input type='text'/>
    );
  }
}

export default FormulaEditor;
