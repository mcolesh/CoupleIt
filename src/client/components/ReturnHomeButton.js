import ReactDOM from 'react-dom';
import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';

class ReturnHomeButton extends React.Component
{
    constructor(props) {
      super(props);
      this.state = {show:false}
      this.setShowaaa = this.setShowaaa.bind(this);
    }

    setShowaaa(value)
    {
      this.setState({show: value});
    }

    render(){
    
      const handleClose = () => this.setShowaaa(false);
      const handleShow = () => this.setShowaaa(true);
 
      return <div>

          <Button type="button" variant="outline-primary btn-block" onClick={handleShow}>
            Return Home
          </Button>
          <Modal 
          show={this.state.show} 
          onHide={handleClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.messageBody}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.props.returnToMenuPage}>
                Return Home
              </Button>
            </Modal.Footer>
          </Modal>
      </div>      
    }
}

export default ReturnHomeButton;
