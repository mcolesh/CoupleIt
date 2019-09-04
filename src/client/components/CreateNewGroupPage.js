import React, { Component } from 'react';
import '../scss/bootstrap.min.css';
import '../scss/application.scss';
import '../scss/App.css';
import { Scrollbars } from 'react-custom-scrollbars';
import Header from './HeaderComponent'

class GroupMember {
  constructor(name, sex) {
    this.name = name;
    this.sex = sex;
  }
}

class FieldsAreFilled extends React.Component
{
  constructor(props) {
    super(props);
  }
  
  render() {
    var lastSubmitedGroupName = this.props.groupName;

    return <div>
            {this.props.groupNameIsUnique == false &&
            <div>
               <div class="alert alert-warning alert-dismissible fade show padding-left-8" role="alert">
                  <strong>Damn, group with the same name already exists</strong>,<br /> please choose another name or delete existing..😢

               </div>
            </div>
            }

            {this.props.isNumberOfMembersGreaterOrEqualToThree == false &&
            <div>
                <div class="alert alert-info alert-dismissible fade show padding-left-8" role="alert">
                    <strong>Group should include at least three members</strong>,<br /> less, would feel lonely, don't you agree ? 😆 

                </div>
            </div>
            }

            {this.props.groupMembersAreUnique == false &&
            <div>
                <div class="alert alert-danger alert-dismissible fade show padding-left-8" role="alert">
                    <strong>All group members must be unique</strong>,<br /> we seek not the confusion 😏 

                </div>
            </div>
            }

            {this.props.fieldsAreFilled == false &&
            <div>
                <div class="alert alert-danger alert-dismissible fade show padding-left-8" role="alert">
                    <strong>All fields are mandatory</strong><br /> don't forget the gender fields.. 😏 

                </div>
            </div>
            }
            {
              this.props.groupNameIsUnique &&
              this.props.isNumberOfMembersGreaterOrEqualToThree &&
              this.props.fieldsAreFilled &&
              this.props.groupMembersAreUnique &&
              <div>
                <div class="alert alert-success alert-dismissible fade show padding-left-8" role="alert">
                  <strong>Group was created Succesfuly!!!</strong>,<br /> now the fun begins.. 😉 

                </div>
              </div>
            }
           </div>
  }
}

class CreateNewGroupPage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      GroupName: "",
      GroupMembers: [
      new GroupMember('',''),
      new GroupMember('',''),
       new GroupMember('','')
      ],
      isVisible:false,
      fieldsAreFilled: null,
      isNumberOfMembersGreaterOrEqualToThree: null,
      groupNameIsUnique: null,
      groupMembersAreUnique: null,
      deleteButtonEnabled: false,
      isGroupCreated:false,
    };
    this.existingGroups = []
    this.handleRemove = this.handleRemove.bind(this);
    this.handleMemberNameChange = this.handleMemberNameChange.bind(this); 
    this.addMember = this.addMember.bind(this); 
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeAllGroupMembers = this.removeAllGroupMembers.bind(this);
  }
  
  async componentWillMount () 
  {
    const response = await fetch('/api/groups');
    if (!response.ok)
    {
        throw Error('Groups request failed.');
    }

    const data = await response.json();
    
    for (var group of data) {
        this.existingGroups.push(group.GroupName)
    }
    
    this.setState({isVisible:true});
  }

  addMember()
  {
    this.setState({GroupMembers: [...this.state.GroupMembers,new GroupMember('','')]});
  }

  handleMemberNameChange(e,index)
  {
    this.state.GroupMembers[index].name = e.target.value;
    this.setState({GroupMembers: this.state.GroupMembers});
  }

  handleGroupNameChange(e)
  {
    this.setState({GroupName: e.target.value});
  }
  
  handleRemove(index)
  {
    this.state.GroupMembers.splice(index,1);
    console.log(this.state.GroupMembers,"CurrentGroup");
    this.setState({GroupMembers: this.state.GroupMembers});
  }

  removeAllGroupMembers()
  {
      this.setState({GroupMembers: []})
  }

  handleSubmit()
  {
    var isNumberOfMembersGreaterOrEqualToThree = false
    var fieldsAreFilled = false 
    var groupNameIsUnique = false
    var groupMembersAreUnique = false

    for (let index = 0; index < this.state.GroupMembers.length; index++)
    {
      if (document.getElementById(index+"Male").checked)
      {
        this.state.GroupMembers[index].sex = "Male";
      }

      if (document.getElementById(index+"Female").checked)
      {
        this.state.GroupMembers[index].sex = "Female";
      }
    }

    if (this.state.GroupMembers.length >= 3)
    {
      isNumberOfMembersGreaterOrEqualToThree = true;
    }

    if (this.state.GroupName !== "" && !this.state.GroupMembers.some((member => member.name === '' || member.sex === '')))
    {
      fieldsAreFilled = true;
    }

    if (!this.existingGroups.includes(this.state.GroupName))
    {
      groupNameIsUnique = true
    }

    const dupesGroupMembers = this.state.GroupMembers.map(member=>member.name).reduce((acc, v, i, arr) => arr.indexOf(v) !== i && acc.indexOf(v) === -1 ? acc.concat(v) : acc, [])

    if (!dupesGroupMembers.length)
    {
      groupMembersAreUnique = true
    }

    var pick = require('object.pick');
    var newGroup = JSON.stringify(pick(this.state, ['GroupName','GroupMembers']));

    this.setState({fieldsAreFilled: fieldsAreFilled,
                   isNumberOfMembersGreaterOrEqualToThree: isNumberOfMembersGreaterOrEqualToThree,
                   groupNameIsUnique: groupNameIsUnique,
                   groupMembersAreUnique: groupMembersAreUnique});
    
    console.log(fieldsAreFilled,isNumberOfMembersGreaterOrEqualToThree,groupNameIsUnique,groupMembersAreUnique)

    if ((fieldsAreFilled && isNumberOfMembersGreaterOrEqualToThree && groupNameIsUnique && groupMembersAreUnique) == false)
      return;
     
    this.existingGroups.push(this.state.GroupName);
    
    this.setState({isGroupCreated:true})

    fetch('/api/groups', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: newGroup,
    });

    console.dir("Created Group: " + newGroup);
  }

  render() {

    if (!this.state.isVisible)
      return null

    var tinMan = this.state.isGroupCreated ? "./images/tinManGroupCreated.png" : "./images/tinManGroupCreateNewGroup.png"

    return <div>
                <Header 
                containerClassDef={"createContainer"}
                headerText={"Create New Group"}/>
                     
                <div className="createContainer borderContainer container text-secondary">
          
                    <div className="row">

                        <div className="col-10">
                            <FieldsAreFilled 
                              groupName={this.state.GroupName}
                              fieldsAreFilled={this.state.fieldsAreFilled}
                              isNumberOfMembersGreaterOrEqualToThree={this.state.isNumberOfMembersGreaterOrEqualToThree}
                              groupNameIsUnique={this.state.groupNameIsUnique}
                              groupMembersAreUnique={this.state.groupMembersAreUnique}
                            />  
                        </div>
                    </div>             

                    <div className="row">
                                    <div className="col-10">
                                        <label>Group Name:</label>
                                        <input type="text" className="form-control" aria-describedby="My Group Name" onChange={(e)=>this.handleGroupNameChange(e)} value={this.state.GroupName}></input>
                                    </div>
                    </div>

                    <div className="PageRow">
                        <div className="col-10 padding-0">
                        <label className="margin-bottom-10">Group Members:</label>
                        </div>
                    </div>
                    
                    <div className="padding-top-0 row">
                      <div className="col-12 padding-0">
                          <Scrollbars 
                              style={{minHeight:450}}
                              renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                              renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                              renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
                              thumbSize={150}
                              >  
                              <div className="container GroupMembersContainer padding-top-0">
                                {
                                this.state.GroupMembers.map((member,index)=>{
                                    return <div className="padding-bottom-10 row">
                                                            <div className="col-10">
                                                                <div className="input-group" key={index}>
                                                                <input type="text" className="form-control" onChange={(e)=>this.handleMemberNameChange(e,index)} value={member.name}/>
                                                                </div>

                                                                <label className="radio Gender-inline">
                                                                  <input type="radio" name={"Gender"+index} id={index+"Male"}/>
                                                                  <span><img style={{width: '14px', height: '18px'}} src="./images/Male.png"></img></span>
                                                                  </label>
                                                                  <label className="radio">
                                                                  <input type="radio" name={"Gender"+index} id={index+"Female"}/>
                                                                  <span><img style={{width: '14px', height: '18px'}} src="./images/Female.png"></img></span>
                                                                  </label>
                                                                  <button  className="btn trashIcon" onClick={()=>this.handleRemove(index)}>
                                                                        <span padding-button="15px">
                                                                        <i class="fa fa-trash"></i></span>
                                                                  </button>

                                                            </div>
                                            </div>
                                })
                                }
                            </div>
                          </Scrollbars>
                        </div>
                    </div>

                    <div className="PageRow row">
                      <div className="col-4 text-center">
                              <button type="button" onClick={this.addMember} className="btn btn-outline-primary btn-block">
                              <span><strong><i class="fa fa-user-plus"></i> Add</strong></span>   
                              </button>
                      </div>

                      <div className="col-4 text-center">
                              <button type="button" onClick={this.removeAllGroupMembers} className="btn btn-outline-primary btn-block" disabled={this.state.GroupMembers.length == 0}>
                              <span><strong><i class="fa fa-times"></i> Remove All</strong></span>  
                              </button>  
                      </div>

                      <div className="col-4 padding-0 text-center">
                              <img src={tinMan} style={{maxWidth:"100%", maxHeight:"250",position:"absolute", right:"50px",margin:"-90 -30 0 0"}}></img>
                      </div>

                    </div>

                    <div className="PageRowCreateNewGroupFooter row">
                      <div className="col-8 text-center">
                              <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary btn-block">
                              <span><strong><i class="fa fa-check"></i> Create</strong></span>  
                              </button>
                      </div>
                    </div>

                    <div className="PageRow row">
                          <div className="col-8 text-center">
                              <button type="button" className="btn btn-outline-primary btn-block" onClick={this.props.returnToMenuPage}> 
                                Return Home
                              </button>
                          </div>

                    </div>
                  </div> 
    </div>
  }
}

export default CreateNewGroupPage;