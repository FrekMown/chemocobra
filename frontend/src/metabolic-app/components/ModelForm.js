import React, { Component } from 'react';
import './ModelForm.css';
import AppContext from '../app-context';
import PT from 'prop-types';

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selScenId: 'New Scen',
      newScenId: '',
      newScenBaseModelId: 'None',
      newScenObjectiveId: '',
      objectiveOK: false,

    }

    this.handleSelScenChange = this.handleSelScenChange.bind(this);
    this.handleChangeBaseModel = this.handleChangeBaseModel.bind(this);
    
  }
  static contextType = AppContext;

  static propTypes = {
    currentScen: PT.object.isRequired,
    changeBaseModel: PT.func.isRequired,
    selModelReactIds: PT.arrayOf(PT.string).isRequired,
  }

  handleSelScenChange(e) {
    this.setState({selScenId:e.target.value});
  }
  handleChangeBaseModel(e) {
    this.setState({newScenBaseModelId:e.target.value});
    this.props.changeBaseModel(e);
  }
  handleObjectiveChange(e) {
    let newScenObjectiveId = e.target.value;
    let objectiveOK = this.props.selModelReactIds.includes(newScenObjectiveId)
    this.setState({newScenObjectiveId, objectiveOK});
  }

  render() {
    // Selected Scen Options
    let selScenMenuOptions = [(
      <option key={"New Scen"}>New Scenario</option>
    )];
    selScenMenuOptions.push(this.context.allScens.map(scen => (
      <option key={scen.id}>scen.id</option>
    )));
    // Submit Button active only if Base model selected and Objective ok --> verify form
    let formOK = (this.state.objectiveOK && this.state.newScenBaseModelId!=="None" && this.state.newScenId.length>1);
    
    // If Objective function does not exist, background color is red
    let objectiveStyle = {};
    if (!this.state.objectiveOK) objectiveStyle = {backgroundColor:'#fc9b8a'};

    // If New Scen selected --> ask for info for new scen
    let newScenForm;
    if (this.state.selScenId === "New Scen") {
      // Set Base Model Options
      let baseModelOptions = [(
        <option key="None">None</option>
      )];
      baseModelOptions.push(this.context.allModelIds.map(mapId => (
        <option key={mapId}>{mapId}</option>
      )));

      newScenForm = (
        <div id="new-scen-form">
          <div id="new-scen-form-title">
            Create Scenario
          </div>
          <label>
            Scenario Name
            <input 
              type="text"
              value={this.state.newScenId}
              onChange={e => this.setState({newScenId:e.target.value})}
            />
          </label>
          <label>
            Base Model
            <select 
              value={this.state.newScenBaseModelId}
              onChange={this.handleChangeBaseModel}
            >
              {baseModelOptions}
            </select>
          </label>
          <label>
            Objective
            <input
              type="text" 
              value={this.state.newScenObjectiveId}
              onChange={e => this.handleObjectiveChange(e)}
              style={objectiveStyle}
            />
          </label>
          <div>
            <button disabled={!formOK}>Save</button>
          </div>

        </div>
      )
    }
    

    return (
      <div id="ModelForm">
        <label>
          Selected Scenario:
          <select value={this.state.selScenId} onChange={this.handleSelScenChange}> 
            {selScenMenuOptions}
          </select>
        </label>
        {newScenForm}
      </div>
    );
  }
}



export default ModelForm;