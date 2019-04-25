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
    allScens: [], // All defined scenarios
    selScenId: '', // selected scenario for plot with escher
    selScen: {},
    page: 'options', //can be options or results
    runOK: false, // selScen in allSelScens --> Effectively added at least one scenario
  };

  // Definition of functions to manage context
  setAllModels = (allModelIds) => {
    this.setState(() => ({ allModelIds }))
  }
  setSelScenId = (selScenId) => {
    this.setState({ selScenId });
  }
  getSelScen = () => {
    if (this.state.selScenId !== '') return this.state.allScens.filter(scen=>scen.id===this.state.selScenId)[0];
    else return {};
  }
  addModifReactionToScen(scenId,reactionId, lowerBound, upperBound) {
    let scen = Object.assign({},this.state.allScens.filter(scen=>scen.id===scenId)[0]);
    scen.modifReacts = {...scen.modifReacts }
    scen.modifReacts[reactionId] = [lowerBound,upperBound];
    let allScens = this.state.allScens.map(s => {
      if(s.id===scen.id) return scen;
      else return s;
    })
    this.setState({allScens});
  }
  removeModifReactionToScen(scenId,reactionId) {
    let scen = Object.assign({},this.state.allScens.filter(scen=>scen.id===scenId)[0]);
    scen.modifReacts = {...scen.modifReacts }
    delete scen.modifReacts[reactionId]
    let allScens = this.state.allScens.map(s => {
      if(s.id===scen.id) return scen;
      else return s;
    })
    this.setState({allScens});
  }
  setRunOK = (ok) => {
    this.setState({ runOK: ok });
  }
  addScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen=>scen.id!==selScen.id).concat([selScen]) }))
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
      setAllModels: this.setAllModels.bind(this),
      setSelScenId: this.setSelScenId.bind(this),
      getSelScen: this.getSelScen.bind(this),
      addScen: this.addScen.bind(this),
      setRunOK: this.setRunOK.bind(this),
      getModel: this.getModel.bind(this),
      addModifReactionToScen: this.addModifReactionToScen.bind(this),
      removeModifReactionToScen: this.removeModifReactionToScen.bind(this),
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