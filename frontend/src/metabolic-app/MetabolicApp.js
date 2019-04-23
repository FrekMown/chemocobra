import React, { Component } from 'react';
import './MetabolicApp.css';
import AppContext from './app-context';
import ModelDescription from './components/ModelDescription';
import ScenOptions from './components/ScenOptions';
import Navbar from './components/Navbar'

class App extends Component {
  state = {
    allModelIds: [], // Ids of available models
    // baseModelId: {}, // Base model from where scenarios are defined
    allScens: [], // All defined scenarios
    allSelScens: [], // All selected scenarios --> Carbon/Metabolite balance
    selScen: {}, // selected scenario for plot with escher
    page: 'options', //can be options or results
  };

  // Definition of functions to manage context
  setAllModels = (allModelIds) => {
    this.setState(state => ({ ...state, allModelIds }))
  }
  setBaseModelId = (model) => {
    this.setState(state => ({ ...state, baseModelId: model }))
  }
  setSelScen = (selScen) => {
    this.setState(state => ({ ...state, selScen: selScen }))
  }
  addSelScen = (selScen) => {
    this.setState(state => ({ ...state, allSelScens: state.selScen.concat([selScen]) }))
  }
  removeSelScen = (selScen) => {
    this.setState(state => ({ ...state, allSelScens: state.selScen.filter(scen => scen.id !== selScen.id) }))
  }
  addScen = (selScen) => {
    this.setState(state => ({ ...state, allScens: state.allScens.concat([selScen]) }))
  }
  removeScen = (selScenId) => {
    this.setState(state => ({ ...state, allScens: state.allScens.filter(scen => scen.id !== selScenId) }))
  }
  getModelFromScen = (scen) => {
    let model = Object.assign({},scen.baseModel);
    for (let reactId of Object.keys(scen.modifReacts)) {
      let reaction = model.reactions.filter(react => react.id === reactId)[0];
      reaction.lower_bound = scen.modifReacts[reactId][0];
      reaction.upper_bound = scen.modifReacts[reactId][1]
    }
    model.objective = scen.objective;
    return model;
  }
  

  render() {
    // Definition of context for provider
    let appContext = {
      ...this.state,
      setAllModels: this.setAllModels,
      setBaseModel: this.setBaseModel,
      setSelScen: this.setSelScen,
      addSelScen: this.addSelScen,
      removeSelScen: this.removeSelScen,
      addScen: this.removeScen 
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