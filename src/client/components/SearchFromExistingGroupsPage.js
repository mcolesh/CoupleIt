import React, { Component } from 'react';
import '../scss/bootstrap.min.css';
import '../scss/App.css';
import GroupPage from './GroupPage';
import { Scrollbars } from 'react-custom-scrollbars';

class Group {
    constructor(name) {
        this.name = name;
        this.groupMembers = [];
        this.addMember = this.addMember.bind(this);
      }
    
    addMember(member)
    {
        this.groupMembers.push(member)
    }
}

class GroupMember {
    constructor(name, sex) {
      this.name = name;
      this.sex = sex;
    }
}


const Page =
{
  SEARCH_MENU: 'Searh Manu',
  CHOSEN_GROUP: 'Chosen Group',
  CHOSEN_GROUP_TEST: 'Easly Help To Develop Group Page'
}

class SearchFromExistingGroupsPage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
        search: '',
        deleteButtonEnabled: false,
        currentPage: Page.SEARCH_MENU,
        groups: [],
        chosenGroup : null
    }
    this.updateSearch = this.updateSearch.bind(this);
    this.changeDeleteButtonSate = this.changeDeleteButtonSate.bind(this);
    this.moveToGroupPage = this.moveToGroupPage.bind(this);
    this.returnToSearchFromExistingGroupPage = this.returnToSearchFromExistingGroupPage.bind(this);
  }

  async componentWillMount () 
  {
    const response = await fetch('/api/groups');
    if (!response.ok)
    {
        throw Error('Groups request failed.');
    }

    const data = await response.json();
    var allGroups = []
    for (var group of data) {
        var currentGroup = new Group(group.GroupName);
        for (var groupMember in group.GroupMembers)
        {
            currentGroup.addMember(new GroupMember(group.GroupMembers[groupMember].name,group.GroupMembers[groupMember].sex)); 
        }
        allGroups.push(currentGroup)
    }
    
    this.setState({groups: allGroups});
  }

  updateSearch(event)
  {
    this.setState({search: event.target.value});
  }

  async removeGroup(group)
  {  

    var groupMarkedForDeletion = group;

    console.log("Deleting "+ groupMarkedForDeletion);

    const response = await fetch('/api/groups/'+ groupMarkedForDeletion, 
    { method: 'DELETE'});

    if (!response.ok)
    {
        throw Error('Failed deleting group '+ groupMarkedForDeletion);
    }

    this.setState({groups: this.state.groups.filter(group => group.name != groupMarkedForDeletion)});
  }
  
  changeDeleteButtonSate()
  {
      this.setState({deleteButtonEnabled: !this.state.deleteButtonEnabled})
  }

  moveToGroupPage(group)
  {
    if (this.state.deleteButtonEnabled)
        return
        
    this.setState({chosenGroup: group, currentPage: Page.CHOSEN_GROUP})
  }

  returnToSearchFromExistingGroupPage()
  {
    this.setState({currentPage: Page.SEARCH_MENU})
  }

  render() {
    switch(this.state.currentPage)
    {
        case Page.SEARCH_MENU:
            let filteredGroups = this.state.groups.filter((group) =>
            {
                return group.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            })
            
            return <div className="Page container text-center">
                            <div className="PageRow row justify-content-center">
                                    <div className="col-4  center-block text-center">
                                    <h2 className="text-primary hr">
                                    &nbsp;&nbsp;&nbsp;Choose your Group:&nbsp;&nbsp;&nbsp; 
                                    </h2>
                                    </div>
                            </div>

                            <div className="PageRow row justify-content-center">
                                    <div className="col-4 center-block text-center">
                                    <input className="form-control search-form" type="text" placeholder="Search.." value={this.state.search} onChange={this.updateSearch}/>
                                    </div>
                            </div>

                            <div className="PageRow row justify-content-center">
                                <div className="col-4 text-left">
                                            <Scrollbars 
                                            style={{height: 300 }}
                                            renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
                                            thumbSize={150}>
                                              <ul className="list-group">
                                                  {filteredGroups.map((group,index) => {
                                                            return <li class="GroupOfItems list-group-item TextColorAndSize" onClick={() => this.moveToGroupPage(group)}>
                                                                        {group.name}
                                                                        {this.state.deleteButtonEnabled && 
                                                                        <button type="button" key={index} class="DeleteButton btn border-0" onClick={this.removeGroup.bind(this, group.name)}>
                                                                        <span padding-button="15px"><i class="fa fa-trash"></i></span>
                                                                        </button>}
                                                                    </li>              
                                                    },this)}
                                              </ul>     

                                            </Scrollbars>
                                </div>
                            </div>

                            <div className="PageRow row justify-content-center">
                                <div className="col-4">
                                    <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.changeDeleteButtonSate} data-toggle="modal" data-target="#exampleModal"> 
                                        Edit Groups
                                    </button>
                                </div>
                            </div>

                            <div className="PageRow row justify-content-center">
                                <div className="col-4">
                                    <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.props.returnToMenuPage} data-toggle="modal" data-target="#exampleModal"> 
                                        Return Home
                                    </button>
                                </div>
                            </div>

                    </div>
        
        case Page.CHOSEN_GROUP:
            return <div><GroupPage group={this.state.chosenGroup} returnToMenuPage={this.props.returnToMenuPage} returnToSearchFromExistingGroupPage={this.returnToSearchFromExistingGroupPage}/></div>
      
        case Page.CHOSEN_GROUP_TEST:
            if (this.state.groups === undefined || this.state.groups.length == 0)
                   return null;   

            return <div><GroupPage group={this.state.groups[1]} returnToMenuPage={this.props.returnToMenuPage} returnToSearchFromExistingGroupPage={this.returnToSearchFromExistingGroupPage}/></div>
    }
  }
}

export default SearchFromExistingGroupsPage