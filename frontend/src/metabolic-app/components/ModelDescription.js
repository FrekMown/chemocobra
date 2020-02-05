import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
import "react-table/react-table.css";
import ModelTable from './ModelTable';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

class ModelDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Creation of a new scen
      newScenId: "",
      newScenBaseModelId: "",
      newScenObjectiveReaction: null,
      objectiveOK: false,
      // Choose an existing scenario
      chosenScenId: '',
    }
  }
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  componentDidUpdate(_, prevState) {
    const modelChanged = prevState.newScenBaseModelId !== this.state.newScenBaseModelId;
    if (modelChanged) {
      this.setState({ newScenObjectiveReaction: null });
    }

    if (this.state.newScenObjectiveReaction === null && this.state.newScenBaseModelId !== "") {
      const model = this.context.getModel(this.state.newScenBaseModelId)
      if (model) {
        this.setState({ newScenObjectiveReaction: this.context.getObjectiveReaction(model) });
      }
    }


  }



  // **************************************
  // Functions 
  // **************************************
  // handleChangeCreateScen(e) {
  //   this.setState({createNewScen: !this.state.createNewScen});
  // }
  handleChangeScenId(e) {
    this.setState({ newScenId: e.target.value });
  }

  async handleChangeBaseModelId(e) {
    this.setState({ newScenBaseModelId: e.target.value });
    if (e.target.value !== "") this.context.loadModel(e.target.value);
  }

  handleObjectiveChange(e) {
    let newScenObjectiveId = e.target.value;
    // let objectiveOK = false;
    // if (this.context.createNewScen && this.state.newScenBaseModelId !== "") {
    //   objectiveOK = this.context.getModel(this.state.newScenBaseModelId).reactions.filter(r => (
    //     r.id === newScenObjectiveId
    //   )).length > 0;
    // }
    this.setState({ newScenObjectiveId });
  }

  handleSaveButton() {
    // Create new scen and add it to context.allScens
    // set newScen as new selScen.
    let newScen = {
      id: this.state.newScenId,
      modifReacts: [],
      objective: this.state.newScenObjectiveReaction.id,
      baseModelId: this.state.newScenBaseModelId,
    }
    this.context.addScen(newScen);
    this.context.setSelScenId(this.state.newScenId);
    this.context.setCreateNewScen(false);
    // this.setState({createNewScen: false});
    // Reset state variables
    // this.setState({
    //   newScenId: 'New Scenario',
    //   newScenBaseModelId: 'noModel',
    //   newScenObjectiveReaction: null,
    //   // objectiveOK: false,
    // })
  }

  handleAddScenario() {
    this.setState({
      newScenId: '',
      newScenBaseModelId: '',
      newScenObjectiveReaction: null,
    });
    this.context.setCreateNewScen(true);
  }


  // ***************************************
  render() {
    // Create scen for table
    let tableScen = {};
    if (this.context.createNewScen) {
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

    // Add autocomplete reaction only if model is loaded
    let objReaction = null;
    const model = this.context.getModel(this.state.newScenBaseModelId);
    if (this.state.newScenObjectiveId !== "" && model) {
      objReaction = (
        <Autocomplete
          id="objective-reaction"
          options={model.reactions}
          getOptionLabel={reaction => `${reaction.id}: ${reaction.name}`}
          renderInput={params => (<TextField {...params} label="Objective Function" variant="outlined" fullWidth />)}
          value={this.state.newScenObjectiveReaction}
          onChange={(_, val) => this.setState({ newScenObjectiveReaction: val })}
          style={{ minWidth: 500 }}
        />
      );
    }


    const secondForm = (
      <form>
        {/* Base Model */}
        <FormControl>
          <FormLabel component="legend">Please Choose a Model</FormLabel>
          <RadioGroup
            value={this.state.newScenBaseModelId}
            onChange={this.handleChangeBaseModelId.bind(this)}
          >
            {this.context.allModelIds.map(mapName => (
              <FormControlLabel value={mapName} control={<Radio />} label={mapName} key={mapName} />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Scenario Name */}
        <TextField
          variant="outlined"
          id="scenario-name"
          label="  Scenario Name / Id"
          value={this.state.newScenId}
          onChange={this.handleChangeScenId.bind(this)}
          style={{ minWidth: 500 }}
        />
        {/* Objective Function */}
        {objReaction}
      </form>
    );

    // if (this.context.createNewScen) {
    //   let baseModelOptions = [(
    //     <option value={"noModel"} key="noModel">Please Choose a Model</option>
    //   )];

    //   baseModelOptions.push(this.context.allModelIds.map(mapId => (
    //     <option key={mapId}>{mapId}</option>
    //   )));



    //   secondForm = (
    //     <div id="new-scen-form">
    //       <label>
    //         Scenario Name
    //         <input
    //           type="text"
    //           value={this.state.newScenId}
    //           onChange={this.handleChangeScenId.bind(this)}
    //         />
    //       </label>
    //       <label>
    //         Base Model
    //         <select
    //           value={this.state.newScenBaseModelId}
    //           onChange={this.handleChangeBaseModelId.bind(this)}
    //         >
    //           {baseModelOptions}
    //         </select>
    //       </label>
    //       <label>
    //         Objective
    //         <input
    //           type="text"
    //           value={this.state.newScenObjectiveId}
    //           onChange={this.handleObjectiveChange.bind(this)}
    //           style={objectiveStyle}
    //         />
    //       </label>
    //       <button
    //         disabled={!formOK}
    //         onClick={this.handleSaveButton.bind(this)}
    //       >
    //         Save
    //       </button>
    //     </div>
    //   );
    // }
    // else {
    //   let scenOptions = this.context.allScens.map(scen => (
    //     <option key={scen.id}>{scen.id}</option>
    //   ))
    //   secondForm = (
    //     <label>
    //       Choose Scenario:
    //       <select
    //         value={this.context.selScenId}
    //         onChange={e => this.context.setSelScenId(e.target.value)}
    //       >
    //         {scenOptions}
    //       </select>
    //     </label>
    //   )
    // }

    const title = (
      <div id="title">
        {this.context.createNewScen ?
          `Create new scenario ${this.state.newScenId}` :
          `Edit Scenario: ${this.context.selScenId}`}
      </div>
    );


    return (
      <div id="ModelDescription">
        <div className="first-line">
          {title}
          <div id="add-scenario" onClick={this.handleAddScenario.bind(this)}>
            <AddCircleOutlineIcon fontSize="large" />
            Add Scenario
        </div>
        </div>
        {secondForm}

        <div id="buttons">
          <Button
            variant="contained"
            color="primary"
            id="save-button"
            disabled={this.state.newScenId.length === 0 || this.state.newScenBaseModelId.length === 0}
            onClick={this.handleSaveButton.bind(this)}
          >
            Save
        </Button>

          <Button variant="contained" color="secondary" id="clear-button">
            Clear
        </Button>

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