import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import '../scss/bootstrap.min.css';
import '../scss/App.css';
import ModalMessage from './ModalMessage'

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
    return <div style={{margin: "15 0 0 20"}}><img  className="SubGroupView" src={subGroupView}/></div>
  }
}

class OptionsView extends React.Component
{
  constructor(props) {
    super(props);
  }

  render()
  {
    return <div>
                  <p style={{margin:"0 0 10 0", textDecoration: "underline"}}>Scheme:</p>
                  <SubGroupView 
                  SubGroupSize={this.props.SubGroupSize}
                  SubGroupDirected={this.props.SubGroupDirected}
                  GendersTogether={this.props.GendersTogether}
                  />
                  <span className="Participants">
                  <p style={{margin:"0 auto", textDecoration: "underline"}}>Participants:</p>
                  {this.props.Participants.length>0 ? this.props.Participants : "Please add some participants.."}
                  </span>
    </div>
  }
}

class SubGroupsLister extends React.Component
{
  constructor(props) {
    super(props)
  }
  render()
  {
    var isDirected = this.props.SubGroupDirected;

    return this.props.subGroups.map((subGroup) => {
      return <div>
              <br/>
              {
                subGroup.map((subGroupMember,index,subGroup) => { 
                  return <span>
                            <div className={this.props.border}>&nbsp;&nbsp;{subGroupMember}&nbsp;&nbsp;</div> {subGroup.length - 1 !== index ? 
                              isDirected ? 
                                " ⇢ "
                                :
                                " — "
                              :
                              isDirected ?
                                " ↩"
                                :
                                null
                              }
                         </span>
                  }
              )}
             </div>
   })
  }
}

class ResultsView extends React.Component
{
  constructor(props) {
    super(props);
    this.shuffle = this.shuffle.bind(this);
    this.createSubGroups = this.createSubGroups.bind(this)
    this.splitArrayIntoChunks = this.splitArrayIntoChunks.bind(this)
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  splitArrayIntoChunks(array,chunksSize)
  {
    var subGroups = [];
    var i,j,temparray,chunk = chunksSize;

    if (array.length<chunk)
    {
        subGroups.push(array)
        console.log("array.length<chunk", subGroups, array)
        return subGroups
    }

    for (i=0,j=array.length; i<j; i+=chunk) {
        subGroups.push(array.slice(i,i+chunk));
        console.log("current element",array.slice(i,i+chunk))
    }

    var lastElemet = subGroups[subGroups.length - 1];
    console.log("lastElemet",lastElemet)
    console.log("array before pop",subGroups)
    if (lastElemet.length <= chunksSize/2)
    {
      subGroups.pop();
      subGroups[subGroups.length - 1].push(lastElemet[0])
    }
    
    return subGroups;
  }

  createSubGroups(array)
  {
    var subGroups = []
    if (this.props.GendersTogether)
    {
      var membersNames = this.props.Participants.map(member => member.name)

      var shuffledMembers = this.shuffle(membersNames);

      subGroups = this.splitArrayIntoChunks(shuffledMembers, this.props.SubGroupSize);
    }
    else
    {
      var maleMembersNames = this.props.Participants.filter( member => member.sex == 'Male')
                             .map(member => member.name)
      var femaleMembersNames = this.props.Participants.filter( member => member.sex == 'Female')
                             .map(member => member.name)
      
      var suffledMaleMembers = this.shuffle(maleMembersNames)
      var suffledFemaleMembers = this.shuffle(femaleMembersNames)

      var subGroups = [this.splitArrayIntoChunks(suffledMaleMembers,this.props.SubGroupSize),
                       this.splitArrayIntoChunks(suffledFemaleMembers,this.props.SubGroupSize)]
    }
    return subGroups;
  }

  render()
  {
    var subGroups = this.createSubGroups(this.props.Participants)

    return <div>
                  Sub Groups:
                  <br/>
                  {this.props.GendersTogether ?
                  <SubGroupsLister 
                  border={"maleAndFemaleBorader"} 
                  subGroups={subGroups}
                  SubGroupDirected={this.props.SubGroupDirected}/>
                  :
                  <div className="flexContainer">
                    <div class="flexItem">
                      <p>
                        Males:
                        <br/>
                        <SubGroupsLister
                          border={"maleBorder"} 
                          subGroups={subGroups[0]}
                          SubGroupDirected={this.props.SubGroupDirected}
                        />
                      </p>
                    </div>
                    <div class="flexItem">
                      <p>
                        Females:
                        <br/>
                        <SubGroupsLister 
                        border={"femaleBorder"} 
                        subGroups={subGroups[1]}
                        SubGroupDirected={this.props.SubGroupDirected}
                        />
                      </p>
                    </div>
                  </div>
                  }          
    </div>
  }
}

class GroupPage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      allThatNotParticipating: [],
      SubGroupSize: 2,
      SubGroupDirected: false,
      GendersTogether: false,
      CreateGroupBottonClicked: false,
    }
    this.handleSubGroupsSizeChange = this.handleSubGroupsSizeChange.bind(this);
    this.handleSubGroupsDirectionChange = this.handleSubGroupsDirectionChange.bind(this);
    this.handleSubGroupsNotParticipating = this.handleSubGroupsNotParticipating.bind(this);
    this.setGendersTogether = this.setGendersTogether.bind(this);
    this.CreateGroupBottonClicked = this.CreateGroupBottonClicked.bind(this)
  }

  componentWillMount()
  {
    console.log("this.props.group:",JSON.stringify(this.props.group))
  }
  
  CreateGroupBottonClicked()
  {
    this.setState({ CreateGroupBottonClicked: true });
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

  render()
  {  
    console.log("allThatNotParticipating: ", this.state.allThatNotParticipating);
    console.log("GendersTogether: ",this.state.GendersTogether);
    console.log("SubGroupSize: ",this.state.SubGroupSize);
    console.log("Direction: ",this.state.SubGroupDirected);

    var participantsNames = this.props.group.groupMembers.map(member => member.name).
    filter(member => this.state.allThatNotParticipating.indexOf(member) == -1).
    join(",")

    console.log(participantsNames)

    var participants = this.props.group.groupMembers.
    filter(member => this.state.allThatNotParticipating.indexOf(member.name) == -1)

    var SubGroupDirectionPlaceHolder = this.state.SubGroupDirected ?
     <div><span className="text-secondary"> Directed</span></div> :
     <div><span className="text-secondary"> Undirected</span></div>

    return <div className="container text-secondary">

        <div className="FirstRowGroupPage row justify-content-center">
            <div className="col-12 center-block text-center">
            <h2 className="text-primary margin-buttom-20">
              {this.props.group.name}
            </h2>
            </div>
        </div>

        <div className="PageRow row justify-content-center">

          <div className="col-10 center-block text-left">
              <p style={{marginBottom : '13px', marginTop: '0px', fontSize: "18"}}>Sub-Groups Options:</p>
          </div>

          <div className="col-10 center-block text-left">
            Separation:&nbsp;&nbsp;
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
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
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
              Exclude:&nbsp;
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
                  {this.state.CreateGroupBottonClicked ?
                  <ResultsView
                  SubGroupSize={this.state.SubGroupSize}
                  SubGroupDirected={this.state.SubGroupDirected}
                  GendersTogether={this.state.GendersTogether}
                  Participants = {participants}
                  /> :
                  <OptionsView
                  SubGroupSize={this.state.SubGroupSize}
                  SubGroupDirected={this.state.SubGroupDirected}
                  GendersTogether={this.state.GendersTogether}
                  Participants = {participantsNames}
                  />
                  }
                </Scrollbars>

              </div>
           </div>
        
           <div className="PageRow row justify-content-center" style={{ marginTop: 30 }}>
                    <div className="col-lg-4 col-md-6 col-8">
                      <button type="button" className="btn btn-primary btn-block" onClick={this.CreateGroupBottonClicked} data-toggle="modal"> 
                        Create Groups
                      </button>
                    </div>
             </div>

             <div className="PageRow row justify-content-center">
                    <div className="col-lg-4 col-md-6 col-8">
                      <ModalMessage
                              enableModal = {this.state.CreateGroupBottonClicked}
                              buttonText = {"Search another group"}
                              pageName = {"Groups"}
                              messageBody = {"Group's division would be lost.."}
                              movePageAction = {this.props.returnToSearchFromExistingGroupPage}       
                      />
                    </div>
             </div>  

             <div className="PageRow row justify-content-center">
                    <div className="col-lg-4 col-md-6 col-8">
                      <ModalMessage
                      enableModal = {this.state.CreateGroupBottonClicked}
                      buttonText = {"Return Home"}
                      pageName = {"Home"}
                      messageBody = {"Group's division would be lost.."}
                      movePageAction = {this.props.returnToMenuPage}
                      />
                    </div>
             </div>        
        </div>
  }
}

export default GroupPage