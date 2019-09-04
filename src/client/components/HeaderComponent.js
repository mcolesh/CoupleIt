import ReactDOM from 'react-dom';
import React, { Component } from 'react'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.containerClassDef = this.props.containerClassDef + " headerContainer container text-secondary";
    }

    render() {
      return <div className={this.containerClassDef}>
                  <div className="FirstRowCreateGroupPage">
                      <div className="col-12">
                          <h2 className="text-primary">
                              {this.props.headerText}
                          </h2>
                      </div>
                  </div> 
               </div>
    }
}

export default Header;
