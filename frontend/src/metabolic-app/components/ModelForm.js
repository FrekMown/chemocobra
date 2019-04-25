import React, { Component } from 'react';
import './ModelForm.css';
import AppContext from '../app-context';
import PT from 'prop-types';

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selScenId: 'createNewScen', // Choose between New Scenario or an existing one
      createNewScen: true,
      // Creation of a new scen
      newScenId: 'New Scenario', 
      newScenBaseModelId: {},
      newScenObjectiveId: '',
      objectiveOK: false,
      // Choose an existing scenario
      chosenScenId: '',
    }
  }
  static contextType = AppContext;

  static propTypes = {
    changeBaseModel: PT.func.isRequired,
    chosenBaseModel: PT.object.isRequired,
  }

  handleSelScenChange(e) {
    this.setState({selScenId: e.target.value});
    // if choose an existing scenario ==> set it as selScen
    if (e.target.value !== "createNewScen") {
      this.context.setSelScenId(e.target.value);
    }
  }
  handleChangeBaseModel(e) {
    this.setState({ newScenBaseModelId: e.target.value });
    if (e.target.value !== "None") this.props.changeBaseModel(e.target.value);
  }
  handleObjectiveChange(e) {
    let newScenObjectiveId = e.target.value;
    let objectiveOK = this.props.chosenBaseModel.reactions.filter(r => r.id === newScenObjectiveId).length > 0;
    this.setState({ newScenObjectiveId, objectiveOK });
  }
  handleSaveButton() {
    let newScen = {
      id: this.state.newScenId,
      modifReacts: [],
      objective: this.state.newScenObjectiveId,
      baseModel: this.props.chosenBaseModel,
    }
    this.context.addScen(newScen);
    this.context.setSelScenId(this.context.currentScen.id);
    // this.context.setCurrentScen(this.context.getSelScen());
    // Reset state variables
    this.setState({
      newScenId: 'New Scenario',
      newScenBaseModelId: 'None',
      newScenObjectiveId: '',
      objectiveOK: false,
    })
    this.setState({ selScenId: this.context.currentScen.id });
  }
  handleChangeCreateScen(e) {
    this.setState({createNewScen: !this.state.createNewScen});
  }
  handleChangeChosenScenId(e) {
    this.setState({chosenScenId: e.target.value});
    this.context.setSelScenId(e.target.value);
  }
  handleChangeScenId(e) {
    this.setState({newScenId: e.target.value});
  }

  render() {
    // Selected Scen Options
    let selScenMenuOptions = [(
      <option key={"newScen"} value="createNewScen">Create New Scenario</option>
    )];
    selScenMenuOptions.push(this.context.allScens.map(scen => (
      <option key={scen.id}>{scen.id}</option>
    )));
    // Submit Button active only if Base model selected and Objective ok --> verify form
    let formOK = (this.state.objectiveOK && this.state.newScenBaseModelId !== "None");

    // If Objective function does not exist, background color is red
    let objectiveStyle = {};
    if (!this.state.objectiveOK) objectiveStyle = { backgroundColor: '#fc9b8a' };

    let secondForm;
    // If create new scen --> ask for info for new scen
    if (this.state.createNewScen) {
      // Set Base Model Options
      let baseModelOptions = [(
        <option key="None">None</option>
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
              onChange={this.handleChangeBaseModel.bind(this)}
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
          <div>
            <button
              disabled={!formOK}
              onClick={this.handleSaveButton.bind(this)}
            >
              Save
            </button>
          </div>

        </div>
      )
    }
    else {
      let scenOptions = this.context.allScens.map(scen => (
        <option key={scen.id}>{scen.id}</option>
      ))
      secondForm = (
        <label>
          Choose Scenario:
          <select
            value={this.state.chosenScenId}
            onChange={this.handleChangeChosenScenId.bind(this)}
          >
            {scenOptions}
          </select>
        </label>
      )
    }


    return (
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
    );
  }
}



export default ModelForm;