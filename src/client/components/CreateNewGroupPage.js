import React, { Component } from 'react';
import '../scss/bootstrap.min.css';
import '../scss/application.scss';
import '../scss/App.css';
import { Scrollbars } from 'react-custom-scrollbars';

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
               <div class="alert alert-warning alert-dismissible fade show padding-left-8" role="alert">
                  <strong>Damn, group with same name already exists</strong>,<br /> please choose another name or delete existing..
               </div>
            }
            {this.props.isNumberOfMembersGreaterOrEqualToThree == false &&
                <div class="alert alert-info alert-dismissible fade show padding-left-8" role="alert">
                    <strong>Group should include at least three members</strong>,<br /> less, would feel lonely, dont you agree ? ^_^ 
                </div>
            }
            {this.props.fieldsAreFilled == false &&
                <div class="alert alert-danger alert-dismissible fade show padding-left-8" role="alert">
                    <strong>All fields are mandatory</strong><br /> don't forget the gender fields.. ^_^ 
                </div>
            }
            {
              this.props.groupNameIsUnique && this.props.isNumberOfMembersGreaterOrEqualToThree && this.props.fieldsAreFilled &&
              <div class="alert alert-success alert-dismissible fade show padding-left-8" role="alert">
              <strong>Group was created Succesfuly!!!</strong>,<br /> now the fun begins .. ^_^ 
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
      new GroupMember('',''),
      new GroupMember('',''),
      new GroupMember('',''),
      new GroupMember('',''),
      new GroupMember('',''),
      new GroupMember('',''),
      new GroupMember('','')
      ],
      isVisible:false,
      fieldsAreFilled: null,
      isNumberOfMembersGreaterOrEqualToThree: null,
      groupNameIsUnique: null,
      deleteButtonEnabled: false,
    };
    this.existingGroups = []
    this.handleRemove = this.handleRemove.bind(this);
    this.handleMemberNameChange = this.handleMemberNameChange.bind(this); 
    this.addMember = this.addMember.bind(this); 
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDeleteButtonSate = this.changeDeleteButtonSate.bind(this);
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

  changeDeleteButtonSate()
  {
      this.setState({deleteButtonEnabled: !this.state.deleteButtonEnabled})
  }

  handleSubmit()
  {
    var isNumberOfMembersGreaterOrEqualToThree = false
    var fieldsAreFilled = false 
    var groupNameIsUnique = false
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

    var pick = require('object.pick');
    var newGroup = JSON.stringify(pick(this.state, ['GroupName','GroupMembers']));

    this.setState({fieldsAreFilled: fieldsAreFilled, isNumberOfMembersGreaterOrEqualToThree: isNumberOfMembersGreaterOrEqualToThree, groupNameIsUnique: groupNameIsUnique});
    
    console.log(fieldsAreFilled,isNumberOfMembersGreaterOrEqualToThree,groupNameIsUnique)

    if ((fieldsAreFilled && isNumberOfMembersGreaterOrEqualToThree && groupNameIsUnique) == false)
      return;
     
    this.existingGroups.push(this.state.GroupName);

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

    return <div className="Page container-fluid text-secondary">
                  <div className="PageRow row justify-content-center">
                      <div className="col-12 center-block text-center">
                      <h2 className="text-primary hr margin-buttom-20">
                      &nbsp;&nbsp;&nbsp;Create New Group:&nbsp;&nbsp;&nbsp; 
                      </h2>
                      </div>
                  </div>
          
                  <div className="row justify-content-right">
                      <div className="col-4 offset-md-4">
                          <FieldsAreFilled groupName={this.state.GroupName} fieldsAreFilled={this.state.fieldsAreFilled}  isNumberOfMembersGreaterOrEqualToThree={this.state.isNumberOfMembersGreaterOrEqualToThree} groupNameIsUnique={this.state.groupNameIsUnique}/>  
                      </div>
                  </div>             

                  <div className="row justify-content-right">
                                  <div className="col-3 offset-md-4">
                                      <label>Group Name:</label>
                                      <input type="text" className="form-control" aria-describedby="My Group Name" onChange={(e)=>this.handleGroupNameChange(e)} value={this.state.GroupName}></input>
                                  </div>
                  </div>

                  <div className="PageRow row justify-content-right">
                      <div className="col-3 offset-md-4">
                      <label className="margin-bottom-10">Group Members:</label>
                      </div>
                  </div>
                  
                  <div className="padding-top-0 row justify-content-center">
                    <div className="col-4 padding-0">
                        <Scrollbars 
                            style={{height: 450 }}
                            renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
                            thumbSize={150}
                            >  
                            <div className="container GroupMembersContainer padding-top-0">
                              {
                              this.state.GroupMembers.map((member,index)=>{
                                  return <div className="padding-bottom-10 row">
                                                          <div className="col-9">
                                                              <div className="input-group" key={index}>
                                                              <input type="text" className="form-control" onChange={(e)=>this.handleMemberNameChange(e,index)} value={member.name}/>
                                                              </div>
                                                          </div>
                                                          <div className="col-1 Gender-inline padding-0 align-self-center">
                                                                <label className="radio">
                                                                <input type="radio" name={"Gender"+index} id={index+"Male"}/>
                                                                <span><img style={{width: '14px', height: '18px'}} src="./images/Male.jpg"></img></span>
                                                                </label>
                                                                <label className="radio">
                                                                <input type="radio" name={"Gender"+index} id={index+"Female"}/>
                                                                <span><img style={{width: '14px', height: '18px'}} src="./images/Female.jpg"></img></span>
                                                                </label>
                                                                {this.state.deleteButtonEnabled &&
                                                                <button  className="btn trashIcon" onClick={()=>this.handleRemove(index)}>
                                                                      <span padding-button="15px">
                                                                      <i class="fa fa-trash"></i></span>
                                                                </button>
                                                                }
                                                          </div>
                                          </div>
                              })
                              }
                          </div>
                        </Scrollbars>
                      </div>
                  </div>

                  <div className="PageRow row justify-content-center">
                  </div>

                  <div className="PageRow row justify-content-center">
                  <div className="col-1 text-center">
                          <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-outline-primary btn-block">
                          <span><strong><i class="fa fa-check"></i> Create</strong></span>  
                          </button>
                      </div>
                      <div className="col-1 text-center">
                          <button type="button" onClick={this.addMember} className="btn btn-outline-primary btn-block">
                          <span><strong><i class="fa fa-user-plus"></i> Add</strong></span>   
                          </button>
                      </div>
                      <div className="col-1 text-center">
                          <button type="button" onClick={this.changeDeleteButtonSate} className="btn btn-outline-primary btn-block">
                          <span><strong><i class="fa fa-times"></i> Remove</strong></span>  
                          </button>  
                      </div>
                  </div>

                  <div className="PageRow row justify-content-center">
                  </div>

                  <div className="PageRow row justify-content-center">
                  </div>

                  <div className="PageRow row justify-content-center">
                        <div className="col-3 text-center">
                            <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.props.returnToMenuPage} data-toggle="modal" data-target="#exampleModal"> 
                              Return Home
                            </button>
                        </div>

                  </div>
        </div>
  }
}

export default CreateNewGroupPage;