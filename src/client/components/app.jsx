import React, { Component } from 'react';
import '../scss/bootstrap.min.css';
import '../scss/App.css';
import CreateNewGroupPage from './CreateNewGroupPage';
import SearchFromExistingGroupsPage from './SearchFromExistingGroupsPage';

window.Popper = require('popper.js').default;

const Page =
{
  MENU: 'Manu',
  SEARCH_FROM_EXISTING_GROUPS: 'Search From Existing Groups',
  CREATE_NEW_GROUP: 'Create New Group'
}

class Menu extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      currentPage:Page.SEARCH_FROM_EXISTING_GROUPS,
      isVisiable:true};
    this.moveToCreateNewGroupPage = this.moveToCreateNewGroupPage.bind(this);
    this.moveToEnterExistingGroupPage = this.moveToEnterExistingGroupPage.bind(this);
    this.returnToMenuPage = this.returnToMenuPage.bind(this);
  }
  
  moveToCreateNewGroupPage()
  {
    this.setState({currentPage:Page.CREATE_NEW_GROUP, isVisiable: false});
  }

  moveToEnterExistingGroupPage()
  {
    this.setState({currentPage:Page.SEARCH_FROM_EXISTING_GROUPS, isVisiable: false});
  }

  returnToMenuPage()
  {
    this.setState({currentPage:Page.MENU, isVisiable: true});
  }

  render() {
    
    switch(this.state.currentPage)
    {
      case Page.MENU:
        return <div className="Page container text-secondary">

        <div className="PageRow row justify-content-center">
            <div className="col-4 center-block text-center hero">
            <h1 className="text-primary">
            Couple it
            </h1>
            <p className="hr">
              Helps you to devide your group into pairs ^_^
            </p>
            </div>
        </div>

        <div className="PageRow row justify-content-center">

          <div className="col-4">

              <button type="button" className="btn btn-outline-primary btn-block" onClick={this.moveToEnterExistingGroupPage}>
              Enter Existing Group
              </button>

              <button type="button" className="btn btn-outline-primary btn-block" onClick={this.moveToCreateNewGroupPage}> 
              Create New Group   
              </button>
          </div>
        </div>

      </div>
      case Page.SEARCH_FROM_EXISTING_GROUPS:
        return <div>
        <SearchFromExistingGroupsPage returnToMenuPage={this.returnToMenuPage}/>
        </div>
      case Page.CREATE_NEW_GROUP:
        return <div>
        <CreateNewGroupPage returnToMenuPage={this.returnToMenuPage}/>
        </div>
    }
  }
}

class App extends React.Component {
 
  render() {
    return (
      <div><Menu/></div>
    );
  }
}

export default App;