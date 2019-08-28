import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import '../scss/bootstrap.min.css';
import '../scss/App.css';

class SubGroupView extends React.Component
{
  constructor(props) {
    super(props);
  }

  render()
  {
    var strDirection = this.props.SubGroupDirected ? "Directed" : "NotDirected";
    var strGenedersState = this.props.GendersTogether ? "Together" : "Seperate";

    var subGroupView = "./SubGroupScheme/"+this.props.SubGroupSize+strDirection+strGenedersState+".png";
    console.log(subGroupView);
    return <div><img  className="SubGroupView" src={subGroupView}/></div>
  }
}



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
    this.changeMemberBackground = this.changeMemberBackground.bind(this);
    this.handleSubGroupsSizeChange = this.handleSubGroupsSizeChange.bind(this);
    this.handleSubGroupsDirectionChange = this.handleSubGroupsDirectionChange.bind(this);
    this.handleSubGroupsNotParticipating = this.handleSubGroupsNotParticipating.bind(this);
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

  handleSubGroupsNotParticipating(nonParticipantList)
  {

    var nNonParticipantMembers = nonParticipantList.map((nonParticipant) =>
    {return nonParticipant.value})

    this.setState({ allThatNotParticipating: nNonParticipantMembers});
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

  render()
  {  
    console.log("allThatNotParticipating: ", this.state.allThatNotParticipating);
    console.log("GendersTogether: ",this.state.GendersTogether);
    console.log("SubGroupSize: ",this.state.SubGroupSize);
    console.log("Direction: ",this.state.SubGroupDirected);
    var participants = this.props.group.groupMembers.map(member => member.name).
    filter(member => this.state.allThatNotParticipating.indexOf(member) == -1).
    join(",")

    var SubGroupDirectionPlaceHolder = this.state.SubGroupDirected ?
     <div><span className="text-secondary"> Directed</span></div> :
     <div><span className="text-secondary"> Undirected</span></div>

    return <div className="container text-secondary">

        <div className="FirstRowGroupPage row justify-content-center">
            <div className="col-12 center-block text-center">
            <h2 className="text-primary hr margin-buttom-20">
            &nbsp;&nbsp;&nbsp;{this.props.group.name}:&nbsp;&nbsp;&nbsp;
            </h2>
            </div>
        </div>

        <div className="PageRow row justify-content-center">
          <div className="col-10 center-block text-left">

            <h5 style={{paddingBottom : '5px'}}>Sub-Groups Options:</h5>

            <div className="RadioOption" onChange={event =>this.setGendersTogether(event)}>
              <label className="radio radioLabel">
              <input type="radio" name="gendersPreference" id="gendersSeperated" defaultChecked/>
              <span style={{height: '25px'}}><img style={{width: '32px', height: '18px'}} src="./images/gendersSeperate.png"></img></span>
              </label>
              <label className="radio">
              <input type="radio" name="gendersPreference" id="gendersTogether"/>
              <span style={{height: '25px'}}><img style={{width: '32px', height: '18px'}} src="./images/gendersTogether.png"></img></span>
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
                { value: '5', label: '5' },
                ]}
                />     
              </div>
            </div>

            <div className="SubGroupsDirectionOption">
              Direction:&nbsp;
              <div className="DirectionSelect">
                <Select placeholder={SubGroupDirectionPlaceHolder} onChange={this.handleSubGroupsDirectionChange} isSearchable={false}
                options={[
                { value: false, label: <div><span className="text-secondary"> Undirected</span></div> },
                { value: true, label: <div><span className="text-secondary"> Directed</span></div> },
                ]}
                />     
              </div>
            </div>

            <div className="SubGroupsNotParticipating">
              Not participating:&nbsp;
              <div className="NotParticipatingSelect">
                <ReactMultiSelectCheckboxes onChange={this.handleSubGroupsNotParticipating}
                options={
                  this.props.group.groupMembers.map((member,index) => {
                  return {value: member.name, label: member.name}       
                },this)}
                />     
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="PageRow row justify-content-center">
              <div className="ColGroupPageResults col-10 center-block text-left Results">
                <Scrollbars style={{height: 450}} autoHide> 
                  Sub-Group-Scheme:
                  <br/>
                  <SubGroupView 
                  SubGroupSize={this.state.SubGroupSize}
                  SubGroupDirected={this.state.SubGroupDirected}
                  GendersTogether={this.state.GendersTogether}
                  />
                  <span className="Participants">Participants:
                  <br/>
                  {participants}</span>
                </Scrollbars>

              </div>
           </div>
        
           <div className="PageRow row  justify-content-center" style={{ marginTop: 30 }}>
                    <div className="col-4">
                      <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#exampleModal"> 
                        Create Groups
                      </button>
                      <button type="button" className="btn btn-light btn-block" onClick={this.props.returnToSearchFromExistingGroupPage} data-toggle="modal" data-target="#exampleModal"> 
                        Search another group
                      </button>
                      <button type="button" className="btn btn-light btn-block" onClick={this.props.returnToMenuPage} data-toggle="modal" data-target="#exampleModal"> 
                        Return Home
                      </button>
                    </div>
         </div>
        
        </div>
  }
}

export default GroupPage