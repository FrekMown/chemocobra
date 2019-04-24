import React, { Component } from 'react';
import './ModelForm.css';
import AppContext from '../app-context';
import PT from 'prop-types';

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selScenId: 'newScen',
      newScenId: 'New Scenario',
      newScenBaseModelId: 'None',
      newScenObjectiveId: '',
      objectiveOK: false
    }
  }
  static contextType = AppContext;

  static propTypes = {
    changeBaseModel: PT.func.isRequired,
  }

  handleSelScenChange(e) {
    this.setState({selScenId: e.target.value});
    let currentScen;
    if (e.target.value !== "newScen") {
      currentScen = this.context.allScens.filter(scen => scen.id === e.target.value)[0]
      this.context.setCurrentScen(currentScen);
      this.context.setSelScen(currentScen);
    }
    else {
      // Reset currentScen
      this.context.setCurrentScen({
        id: 'New Scenario',
        modifReacts: {},
        baseModel: {},
        objective: ''
      });
      // Reset state variables
      this.setState({
        newScenId: 'New Scenario',
        newScenBaseModelId: 'None',
        newScenObjectiveId: '',
        objectiveOK: false,
      })
    }
  }

  handleChangeBaseModel(e) {
    this.setState({ newScenBaseModelId: e.target.value });
    if (e.target.value !== "None") this.props.changeBaseModel(e.target.value);
  }
  handleObjectiveChange(e) {
    let newScenObjectiveId = e.target.value;
    let objectiveOK = false;
    if ("reactions" in this.context.currentScen.baseModel) {
      objectiveOK = this.context.currentScen.baseModel.reactions.filter(r => r.id === newScenObjectiveId).length > 0;
      if (objectiveOK) {
        this.context.setCurrentScen({ ...this.context.currentScen, objective: e.target.value });
      }
    }
    this.setState({ newScenObjectiveId, objectiveOK });
  }
  handleChangeScenId(e) {
    this.setState({ newScenId: e.target.value });
    this.context.setCurrentScen({ ...this.context.currentScen, id: e.target.value });
  }
  handleSaveButton() {
    this.context.addScen(this.context.currentScen);
    this.context.addSelScen(this.context.currentScen);
    this.context.setSelScen(this.context.currentScen);
    this.setState({ selScenId: this.context.currentScen.id });
  }

  render() {
    // Selected Scen Options
    let selScenMenuOptions = [(
      <option key={"newScen"} value="newScen">New Scenario</option>
    )];
    selScenMenuOptions.push(this.context.allSelScens.map(scen => (
      <option key={scen.id}>{scen.id}</option>
    )));
    // Submit Button active only if Base model selected and Objective ok --> verify form
    let formOK = (this.state.objectiveOK && this.state.newScenBaseModelId !== "None");

    // If Objective function does not exist, background color is red
    let objectiveStyle = {};
    if (!this.state.objectiveOK) objectiveStyle = { backgroundColor: '#fc9b8a' };

    // If New Scen selected --> ask for info for new scen
    let newScenForm;
    if (this.state.selScenId === "newScen") {
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



    return (
      <div id="ModelForm">
        <label>
          Selected Scenario:
          <select
            value={this.state.selScenId}
            onChange={this.handleSelScenChange.bind(this)}> {selScenMenuOptions}
          </select>
        </label>
        {newScenForm}
      </div>
    );
  }
}



export default ModelForm;