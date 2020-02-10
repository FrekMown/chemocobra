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
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

class ModelDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Creation of a new scen
      newScenId: "",
      newScenBaseModelId: "",
      newScenObjectiveReaction: null,
      // Choose an existing scenario
      editingScen: null,
    }
  }
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  componentDidUpdate(_, prevState) {
    // Deal with objective reaction when base model changes
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

    // If editing a scenario, at the beginning change values in form
    if (this.context.createNewScen && this.state.editingScen !== null) {
      this.setState({ editingScen: null });
    }
    else if (!(this.context.createNewScen)) {
      if (this.state.editingScen === null || this.state.editingScen.id !== this.context.selScenId) {
        const scen = this.context.getScen(this.context.selScenId);
        this.setState({
          editingScen: scen,
          newScenId: scen.id,
          newScenBaseModelId: scen.baseModelId,
          newScenObjectiveReaction: this.context.getObjectiveReactionScen(scen),
        });
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

  handleSaveButton() {
    // Create new scen and add it to context.allScens
    // set newScen as new selScen.

    let newScen = {
      id: this.state.newScenId,
      modifReacts: [],
      objective: this.state.newScenObjectiveReaction.id,
      baseModelId: this.state.newScenBaseModelId,
      baseModelName: this.context.allModelIds[this.state.newScenBaseModelId]
    };
    this.context.addScen(newScen);
    this.context.setSelScenId(this.state.newScenId);
    this.context.setCreateNewScen(false);

  }

  handleAddScenario() {
    this.setState({
      newScenId: '',
      newScenBaseModelId: '',
      newScenObjectiveReaction: null,
    });
    this.context.setCreateNewScen(true);
  }

  handleClearButton(){
    this.context.removeScen(this.context.getSelScen());
    this.context.setCreateNewScen(true);
    this.setState({
      newScenId: "",
      newScenBaseModelId: "",
      newScenObjectiveReaction: null,
      // Choose an existing scenario
      editingScen: null,
    })
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
          style={{ minWidth: 400 }}
          disabled={!(this.context.createNewScen)}
          disableClearable={true}
        />
      );
    }



    const secondForm = (
      <form>
        {/* Base Model */}
        <FormControl
            disabled={!(this.context.createNewScen)}
        
        >
          <FormLabel component="legend">Please Choose a Model</FormLabel>
          <RadioGroup
            value={this.state.newScenBaseModelId}
            onChange={this.handleChangeBaseModelId.bind(this)}
          >
            {Object.keys(this.context.allModelIds).map(mapId => (
              <FormControlLabel
                value={mapId}
                control={<Radio />}
                label={`${mapId} - ${this.context.allModelIds[mapId]}`}
                key={mapId}
              />
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
          style={{ minWidth: 400 }}
          disabled={!(this.context.createNewScen)}
        />
        {/* Objective Function */}
        {objReaction}
      </form>
    );

    const title = (
      <div id="title">
        {this.context.createNewScen ?
          `Create new scenario ${this.state.newScenId}` :
          `Edit Scenario: ${this.context.selScenId}`}
      </div>
    );

    const buttonSave = this.context.createNewScen ?
      (
        <Button
          variant="contained"
          color="primary"
          id="save-button"
          disabled={this.state.newScenId.length === 0 || this.state.newScenBaseModelId.length === 0}
          onClick={this.handleSaveButton.bind(this)}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      ) : null;

    const clearButton = this.context.createNewScen ? null :
      (
        <Button
          variant="contained"
          color="secondary"
          id="clear-button"
          startIcon={<DeleteIcon />}
          onClick={this.handleClearButton.bind(this)}
        >
          Delete
        </Button>
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
          {buttonSave}
          {clearButton}


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