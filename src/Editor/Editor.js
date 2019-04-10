import React, { Component } from 'react';
import peg from "pegjs";
import Collapsible from 'react-collapsible';
import { Container, Row, Col,Card,Collapse,CardBody } from 'reactstrap';
import './Editor.css';
import 'font-awesome/css/font-awesome.min.css';

class Editor extends Component{

  constructor(props){
    super(props);
    this.state = {collapse:[true,false]};
    this.toggle = this.toggle.bind(this);
  }

  toggle(index) {
    var modifiedCollapse = this.state.collapse.slice();
    console.log(index);
    modifiedCollapse[index] = !modifiedCollapse[index];
    this.setState({ collapse: modifiedCollapse });
  }

  render()
  {
    var excercise = this.props.excercise;
    return (
      <Container fluid={true}>
     <Row>
       <Col
         md="12"
         lg="12"
         className="main-body">

         <Row>
           <Col lg={{size:10,offset:1}}
              className="hint-bar margin">
             Hint: Try to remove all of the implications first
           </Col>
         </Row>
         <Row>
           <Col  lg={{size:10,offset:1}}
             className="feedback-bar margin">
             Status: All good!
           </Col>
         </Row>

         <Row className="margin">
           <Col
             lg={{size:10,offset:1}}
             className="editor">

             <Row>
               <Col md={{size:2,offset:10}}
                    lg={{size:2,offset:10}}
                  className="settings"
                  >

                 <button className="btn btn-xs setting"><i className="fa fa-home"></i></button>
                 <button className="btn btn-xs setting"><i className="fa fa-bars"></i></button>
                 <button className="btn btn-xs setting"><i className="fa fa-trash"></i></button>

               </Col>
             </Row>

             <Row>
               <Col
                 lg="8"
                 className="margin">
                 <Row>
                 <Col
                   lg={{size:10,offset:1}}
                   className="margin action-panel">

                   <Row>
                     <Col lg="12">

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>

                       <div className="step">
                         <a onClick={() => {this.toggle(0);}} href="#">1. Initial formula</a>
                         <Collapse isOpen={this.state.collapse[0]}>
                         <Card className="step-body">
                           <CardBody>
                             ( D → B ) ∧ ( B → ( D ∧ U ) ) ∧ ¬( B ∧ D ∧ U ) ∧ D
                           </CardBody>
                         </Card>
                       </Collapse>
                       </div>
                   </Col>
                 </Row>



               </Col>
             </Row>
             </Col>

               <Col
                  lg="3"
                  className="transformation-panel-back margin">
                 <div className="transformation-panel-front margin">
                   <Row>
                     <Col lg="12">
                       <h3>Transformations</h3>
                       <hr/>
                     </Col>
                   </Row>
                   <button className="rule">a ≡ a ∨ ¬a</button>
                   <button className="rule">(a ∨ ¬a) ∧ b ≡ b</button>
                   <button className="rule">a → b ≡ ¬a ∨ b</button>
                   <button className="rule">a ∨ b ≡ b ∨ a</button>
                   <button className="rule">a ∧ (b ∧ c) ≡ a ∧ b ∧ c</button>
                   <button className="rule">a → a ≡ a</button>
                   <button className="rule">a → (b ∧ ¬b) ≡ a</button>
                 </div>
               </Col>

             </Row>

           </Col>

         </Row>
       </Col>
     </Row>
   </Container>
    );
  }
}

export default Editor;
