import React, { Component } from 'react';
import './MetabolicApp.css';
import AppContext from './app-context';
import ModelDescription from './components/ModelDescription';
import ScenOptions from './components/ScenOptions';
import Navbar from './components/Navbar'
import * as apiCalls from './api-calls';

class App extends Component {
  state = {
    allModelIds: [], // Ids of available models
    allModels:{}, // All downloaded models
    // baseModelId: {}, // Base model from where scenarios are defined
    allScens: [], // All defined scenarios
    allSelScens: [], // All selected scenarios --> Carbon/Metabolite balance
    selScen: {}, // selected scenario for plot with escher
    page: 'options', //can be options or results
    runOK: false, // selScen in allSelScens --> Effectively added at least one scenario
    currentScen: {
      id:'New Scenario',
      modifReacts:[],
      baseModel:{},
      objective:''
    }, // scenario used in ModelDescription
  };

  // Definition of functions to manage context
  setAllModels = (allModelIds) => {
    this.setState(() => ({ allModelIds }))
  }
  setBaseModelId = (model) => {
    this.setState(() => ({ baseModelId: model }))
  }
  setSelScen = (selScen) => {
    this.setState(() => ({ selScen: selScen }))
  }
  setCurrentScen = (scen) => {
    this.setState(() => ({ currentScen: scen }))
  }
  addSelScen = (selScen) => {
    this.setState((state) => ({ allSelScens: state.allSelScens.concat([selScen]) }))
  }
  removeSelScen = (selScen) => {
    this.setState(state => ({ allSelScens: state.selScen.filter(scen => scen.id !== selScen.id) }))
  }
  setRunOK = (ok) => {
    this.setState({ runOK: ok });
  }
  addScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.concat([selScen]) }))
  }
  removeScen = (selScenId) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen => scen.id !== selScenId) }))
  }
  getModelFromScen = (scen) => {
    let model = Object.assign({},scen.baseModelId);
    for (let reactId of Object.keys(scen.modifReacts)) {
      let reaction = model.reactions.filter(react => react.id === reactId)[0];
      reaction.lower_bound = scen.modifReacts[reactId][0];
      reaction.upper_bound = scen.modifReacts[reactId][1]
    }
    model.objective = scen.objective;
    return model;
  }
  // returns model if it is already stored
  // otherwise it makes a call and returns the model from backend
  getModel = async function(modelId) {
    let modelOut;
    let allModels = Object.assign({}, this.state.allModels)
    
    if (modelId in allModels) modelOut = this.state.allModels[modelId]
    else {
      modelOut = await apiCalls.getModelFromId(modelId,true);
      allModels[modelId] = modelOut;
      this.setState({ allModels });
    } 
    return modelOut;    
  }
  

  render() {
    // Definition of context for provider
    let appContext = {
      ...this.state,
      setAllModels: this.setAllModels,
      setBaseModel: this.setBaseModel,
      setSelScen: this.setSelScen,
      setCurrentScen: this.setCurrentScen,
      addSelScen: this.addSelScen,
      removeSelScen: this.removeSelScen,
      addScen: this.addScen,
      setRunOK: this.setRunOK,
      getModel: this.getModel.bind(this),
    }

    // Definition of main content
    let content;
    if (this.state.page === 'options') {
      content = (
        <div id="App">
          <Navbar />
          <div id="App-content">
            <ModelDescription />
            <ScenOptions />
          </div>
        </div>
      );
    }

    return (
      <AppContext.Provider value={appContext}>
        {content}
      </AppContext.Provider >
    )
  }
}

export default App;