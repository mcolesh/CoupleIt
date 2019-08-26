import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import '../scss/bootstrap.min.css';
import '../scss/App.css';

class GroupPage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      allThatNotParticipating: [],
      SubGroupSize: '2',
      SubGroupDirected: false,
      GendersTogether: false
    }
    this.addRemoveParticipant = this.addRemoveParticipant.bind(this);
    this.changeMemberBackground = this.changeMemberBackground.bind(this);
    this.handleSubGroupsSizeChange = this.handleSubGroupsSizeChange.bind(this);
    this.handleSubGroupsDirectionChange = this.handleSubGroupsDirectionChange.bind(this);
    this.setGendersTogether = this.setGendersTogether.bind(this);
  }

  componentWillMount()
  {
    console.log("this.props.group:",JSON.stringify(this.props.group))
  }
  
  handleSubGroupsSizeChange(newSubGroupSize)
  {
    this.setState({ SubGroupSize: newSubGroupSize.value });
  }

  handleSubGroupsDirectionChange(newDirection)
  {
    this.setState({ SubGroupDirected: newDirection.value });
  }

  setGendersTogether(event)
  {
    console.log("Set GendersTogether",event.target.id)
    this.setState( {GendersTogether: event.target.id === "gendersTogether"} )
    console.log("Set GendersTogether",event.target)
  }

  changeMemberBackground(event)
  {
    console.log(event.target.classList.contains('LiMemberBaseState'));

    if (event.target.classList.contains('LiMemberBaseState'))
    {
      event.target.classList.remove('LiMemberBaseState')
      event.target.classList.add('LiMemberClicked')
    }
    else
    {
      event.target.classList.remove('LiMemberClicked')
      event.target.classList.add('LiMemberBaseState')
    }

    console.log(event.target.classList);
  }

  addRemoveParticipant(event, member){

    this.changeMemberBackground(event);

    var isNotParticipating = this.state.allThatNotParticipating.some( noneParticipant => noneParticipant === member.name);

    if (isNotParticipating)
    {
      this.setState({allThatNotParticipating: this.state.allThatNotParticipating.filter( noneParticipant => { return noneParticipant!=member.name})})
      return;
    }

    this.setState({allThatNotParticipating: [...this.state.allThatNotParticipating,member.name] })
  }

  render()
  {  
    console.log("allThatNotParticipating: ", this.state.allThatNotParticipating);
    console.log("GendersTogether: ",this.state.GendersTogether);
    console.log("SubGroupSize: ",this.state.SubGroupSize);
    console.log("Direction: ",this.state.SubGroupDirected);
    
    var SubGroupDirectionPlaceHolder = this.state.SubGroupDirected ?
     <div><img src="./images/DirectedGraph.png" height="28px" width="30px"/><span className="text-secondary"> Directed</span></div> :
     <div><img src="./images/UnDirectedGraph.png" height="28px" width="30px"/><span className="text-secondary"> Undirected</span></div>

    return <div className="Page container-fluid text-secondary">

        <div className="PageRow row justify-content-center">
            <div className="col-12 center-block text-center">
            <h2 className="text-primary hr margin-buttom-20">
            &nbsp;&nbsp;&nbsp;{this.props.group.name}:&nbsp;&nbsp;&nbsp;
            </h2>
            </div>
        </div>

        <div className="PageRow row justify-content-center">
          <div className="col-8 center-block text-left">

            <h5 style={{paddingBottom : '5px'}}>Sub-Groups Options:</h5>

            <div className="RadioOption" onChange={event =>this.setGendersTogether(event)}>
              <label className="radio radioLabel">
              <input type="radio" name="gendersPreference" id="gendersSeperated" defaultChecked/>
              <span style={{height: '25px'}}><img style={{width: '32px', height: '18px'}} src="./images/gendersSeperate.jpg"></img></span>
              </label>
              <label className="radio">
              <input type="radio" name="gendersPreference" id="gendersTogether"/>
              <span style={{height: '25px'}}><img style={{width: '32px', height: '18px'}} src="./images/gendersTogether.jpg"></img></span>
              </label>
            </div>

            <div className="SubGroupsSizeOption">
              Size:&nbsp;
              <div className="SubGroupSelect">
                <Select placeholder={this.state.SubGroupSize} onChange={this.handleSubGroupsSizeChange} value={this.state.SubGroupSize} isSearchable={false}
                options={[
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                ]}
                />     
              </div>
            </div>

            <div className="SubGroupsDirectionOption">
              Direction:&nbsp;
              <div className="DirectionSelect">
                <Select placeholder={SubGroupDirectionPlaceHolder} onChange={this.handleSubGroupsDirectionChange} isSearchable={false}
                options={[
                { value: false, label: <div><img src="./images/UnDirectedGraph.png" height="28px" width="30px"/><span className="text-secondary"> Undirected</span></div> },
                { value: true, label: <div><img src="./images/DirectedGraph.png" height="28px" width="30px"/><span className="text-secondary"> Directed</span></div> },
                ]}
                />     
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="PageRow row justify-content-center">
              <div className="ColGroupPageResults col-7 center-block text-left Results">
                <Scrollbars style={{height: 450}} autoHide> 
                Generated Sub-Groups:
                </Scrollbars>

              </div>
              <div className="col-1 center-block text-left">
                <p align="left">Members:</p>
                <Scrollbars style={{height: 430}} autoHide autoHideTimeout={500}> 
                    <ul class="list-group list-group-flush members">
                      {this.props.group.groupMembers.map((member,index) => {
                        return <li class="GroupOfItems LiMemberBaseState ColGroupPageMembers list-group-item" onClick={(e) => this.addRemoveParticipant(event, member)}>
                                    {member.name}
                              </li>              
                      },this)}
                    </ul>
                  </Scrollbars>    
              </div>
           </div>
        
           <div className="PageRow row" style={{ marginTop: 30 }}>
                    <div className="col-4 m-4"></div>
                    <div className="col-3">
                      <button type="button" className="btn btn-outline-primary btn-block" data-toggle="modal" data-target="#exampleModal"> 
                        Create Groups
                      </button>
                      <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.props.returnToSearchFromExistingGroupPage} data-toggle="modal" data-target="#exampleModal"> 
                        Search another group
                      </button>
                      <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.props.returnToMenuPage} data-toggle="modal" data-target="#exampleModal"> 
                        Return Home
                      </button>
                    </div>
         </div>
        
        </div>
  }
}

export default GroupPage