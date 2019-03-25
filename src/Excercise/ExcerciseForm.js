import React, { Component } from 'react';
import FormulaEditor from './FormulaEditor';
import Duallist from 'react-duallist';

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
      <form>
        <FormulaEditor operators={operators} title="Starting Formula"/>

        <div>
          <label>
            Show Target Formula:
            <input type="radio" name="show" value="yes" checked="checked"/> Yes
            <input type="radio" name="show" value="no"/> No
          </label>
        </div>

        <div>
          <textarea  rows="5" cols="50">Problem Statement</textarea>
        </div>

        <FormulaEditor operators={operators} title="Target Formula"/>


        <Duallist
          available={transformations}
          selected={selectedTransformations}
          onMove={this.onMove}
          sortable={false}
          searchable={false}
        />

        <input type="submit" value="Submit" />

      </form>
    );
  }
}


export default ExcerciseForm;
