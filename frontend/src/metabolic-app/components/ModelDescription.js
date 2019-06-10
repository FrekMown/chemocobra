import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
import "react-table/react-table.css";
import ModelTable from './ModelTable';


class ModelDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createNewScen: true,
      // Creation of a new scen
      newScenId: 'New Scenario', 
      newScenBaseModelId: 'noModel',
      newScenObjectiveId: '',
      objectiveOK: false,
      // Choose an existing scenario
      chosenScenId: '',
    }
  }
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  // **************************************
  // Functions 
  // **************************************
  // async changeBaseModel(modelId) {
  //   let baseModel = await this.context.getModel(modelId);
  //   this.setState({ chosenBaseModel: baseModel });
  // }
  handleChangeCreateScen(e) {
    this.setState({createNewScen: !this.state.createNewScen});
  }
  handleChangeScenId(e) {
    this.setState({newScenId: e.target.value});
  }
  async handleChangeBaseModelId(e) {
    this.setState({ newScenBaseModelId: e.target.value });
    if (e.target.value !== "noModel") this.context.loadModel(e.target.value);
  }
  handleObjectiveChange(e) {
    let newScenObjectiveId = e.target.value;
    let objectiveOK = false;
    if (this.state.createNewScen && this.state.newScenBaseModelId!=="noModel") {
      objectiveOK = this.context.getModel(this.state.newScenBaseModelId).reactions.filter(r => (
        r.id === newScenObjectiveId
      )).length > 0;
    }
    this.setState({ newScenObjectiveId, objectiveOK });
  }
  handleSaveButton() {
    // Create new scen and add it to context.allScens
    // set newScen as new selScen.
    let newScen = {
      id: this.state.newScenId,
      modifReacts: [],
      objective: this.state.newScenObjectiveId,
      baseModelId: this.state.newScenBaseModelId,
    }
    this.context.addScen(newScen);
    this.context.setSelScenId(this.state.newScenId);
    this.setState({createNewScen: false});
    // Reset state variables
    this.setState({
      newScenId: 'New Scenario',
      newScenBaseModelId: 'noModel',
      newScenObjectiveId: '',
      objectiveOK: false,
    })
  }

  // ***************************************
  render() {
    // Create scen for table
    let tableScen={};
    if (this.state.createNewScen) {
      tableScen = {
        id: this.state.newScenId,
        baseModelId: this.state.newScenBaseModelId,
        objectiveId: this.state.newScenObjectiveId,
        modifReacts: [],
      }
    }
    else {
      tableScen = this.context.getSelScen();
    }

    // Submit Button active only if Base model selected and Objective ok --> verify form
    let formOK = (this.state.objectiveOK && this.state.newScenBaseModelId !== "noModel");

    // If Objective function does not exist, background color is red
    let objectiveStyle = {};
    if (!this.state.objectiveOK) objectiveStyle = { backgroundColor: '#fc9b8a' };


    let secondForm;
    // if create new scen --> ask for info for new scen
    if(this.state.createNewScen) {
      let baseModelOptions = [(
        <option value={"noModel"} key="noModel">Please Choose a Model</option>
      )];      
      baseModelOptions.push(this.context.allModelIds.map(mapId => (
        <option key={mapId}>{mapId}</option>
      )));
      secondForm = (
        <div id="new-scen-form">
          <div id="new-scen-form-title">
            Create Scenario
          </div>
          <label>
            Scenario Name
            <input
              type="text"
              value={this.state.newScenId}
              onChange={this.handleChangeScenId.bind(this)}
            />
          </label>
          <label>
            Base Model
            <select
              value={this.state.newScenBaseModelId}
              onChange={this.handleChangeBaseModelId.bind(this)}
            >
              {baseModelOptions}
            </select>
          </label>
          <label>
            Objective
            <input
              type="text"
              value={this.state.newScenObjectiveId}
              onChange={this.handleObjectiveChange.bind(this)}
              style={objectiveStyle}
            />
          </label>
          <button
            disabled={!formOK}
            onClick={this.handleSaveButton.bind(this)}
          >
            Save
          </button>
        </div>
      );      
    }
    else {
      let scenOptions = this.context.allScens.map(scen => (
        <option key={scen.id}>{scen.id}</option>
      ))
      secondForm = (
        <label>
          Choose Scenario:
          <select
            value={this.context.selScenId}
            onChange={e => this.context.setSelScenId(e.target.value)}
          >
            {scenOptions}
          </select>
        </label>
      )
    }

    return (
      <div id="ModelDescription">
        <div id="ModelForm">
          <label>
            Create new Scenario ?
            <input 
              type="checkbox"
              value={this.state.createNewScen}
              onChange={this.handleChangeCreateScen.bind(this)}
              checked={this.state.createNewScen}
            />
          </label>
          {secondForm}
        </div>

        <div id="model-table">
          <ModelTable 
            tableScen={tableScen}
          />
        </div>
      </div>
    );

  }
}

export default ModelDescription;