import React, { Component } from 'react';
import './MetabolicApp.css';
import AppContext from './app-context';
import ModelDescription from './components/ModelDescription';
import ScenOptions from './components/ScenOptions';
import Navbar from './components/Navbar'
import PlotResults from './components/PlotResults'
import TableResults from './components/TableResults'
import MetabolicMap from './components/MetabolicMap'
import * as apiCalls from './api-calls';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allModelIds: [], // Ids of available models
      allScens: [], // All defined scenarios
      selScenId: '', // selected scenario for plot with escher
      page: 'options', //can be options or results
      allModels: [] // All downloaded models
    };    
    // Definition of functions to manage context
  }
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
  addScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen=>scen.id!==selScen.id).concat([selScen]) }))
  }
  removeScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen=>scen.id !== selScen.id) }))
  }
  // returns model if it is already stored
  getModel (modelId) {
    let modelOut = this.state.allModels.filter(model=>model.id===modelId);
    if (modelOut.length>0) return modelOut[0];
    else return {}
  }
  getScen (scenId) {
    let scenOut = this.state.allScens.filter(scen=>scen.id===scenId);
    if (scenOut.length>0) return scenOut[0];
    else return {}
  }
  // Loads model if not already in allModels
  async loadModel(modelId) {
    if (!(modelId in this.state.allModels)) {
      let model = await apiCalls.getModelFromId(modelId,true);
      let allModels = this.state.allModels.filter(model=>model.id!==modelId).concat([model]) 
      this.setState({allModels});      
    }
  }
  // Switches page options vs results
  async switchMainPage() {
    if (this.state.page === 'options') {
      this.setState({page: 'results'})
      // run model
      apiCalls.simulateScenAPI(this.state.allScens[0]);
    }
    else {
      this.setState({page: 'options'})
    }
  }

  
  

  render() {
    // Definition of context for provider
    let appContext = {
      ...this.state,
      //variables
      allModels: this.state.allModels,
      //functions
      loadModel: this.loadModel.bind(this),
      setAllModels: this.setAllModels.bind(this),
      setSelScenId: this.setSelScenId.bind(this),
      getSelScen: this.getSelScen.bind(this),
      addScen: this.addScen.bind(this),
      removeScen: this.removeScen.bind(this),
      getModel: this.getModel.bind(this),
      addModifReactionToScen: this.addModifReactionToScen.bind(this),
      removeModifReactionToScen: this.removeModifReactionToScen.bind(this),
      switchMainPage: this.switchMainPage.bind(this),
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
    else if (this.state.page==='results') {
      content = (
        <div id="App">
          <Navbar />
          <div id="App-content">
            <div id="results-left">
              <PlotResults />
              <TableResults />
            </div>
            <MetabolicMap />
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