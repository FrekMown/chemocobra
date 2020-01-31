import React, { Component } from 'react';
import './MetabolicApp.css';
import AppContext from './app-context';
import ModelDescription from './components/ModelDescription';
import ScenOptions from './components/ScenOptions';
import Navbar from './components/Navbar'
import ReactionResults from './components/ReactionResults'
import MetaboliteResults from './components/MetaboliteResults'
import MetabolicMap from './components/MetabolicMap'
import * as apiCalls from './api-calls';
import './components/slack.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allModelIds: [], // Ids of available models
      allMapIds: [],
      allScens: [], // All defined scenarios
      selScenId: '', // selected scenario for plot with escher
      page: 'options', //can be options or results
      allModels: [], // All downloaded models
      respfba: {}, // scen -> object with keys reactions and values object with reactions->flux
    };
    // Definition of functions to manage context
  }

  async componentDidMount() {
    let allModelIds = await apiCalls.getAvailableModels();
    let allMapIds = await apiCalls.getAvailableMaps();
    this.setState({ allModelIds, allMapIds });
  }

  // thr --> sum of absolute values to keep. To be implemented.
  getMetaboliteBalance(metId, thr) {
    // metBalAllScens ==> list of objects, each for one scen, containing scenId and all reactions
    let reactsTotalFlux = {};
    let metBalAllScens = {};
    for (let scen of this.state.allScens) {
      metBalAllScens[scen.id] = {};
      let model = this.getModel(scen.baseModelId);
      model.reactions.forEach(r => {
        if (metId in r.metabolites && r.id in this.state.respfba[scen.id]) {
          let flux = r.metabolites[metId] * this.state.respfba[scen.id][r.id];
          metBalAllScens[scen.id][r.id] = +flux.toFixed(2);
          // add this reaction to reactsTotalFlux
          if (r.id in reactsTotalFlux) reactsTotalFlux[r.id] += Math.abs(metBalAllScens[scen.id][r.id]);
          else reactsTotalFlux[r.id] = Math.abs(metBalAllScens[scen.id][r.id]);
        }
      });
    }

    // console.log('metBalAllScens', metBalAllScens);

    // Select reactions ok
    let reactsOK = Object.keys(reactsTotalFlux).sort((x, y) => reactsTotalFlux[y] - reactsTotalFlux[x]).filter(rId => (
      (reactsTotalFlux[rId] >= thr)
    ));

    // metBalReacts ==> list of objects, one for reaction, if sum abs >= thr
    let metBalReacts = reactsOK.map(rId => {
      let reaction = (rId.length < 20 ? rId : rId.slice(0, 20) + '...')
      let metBalR = { reaction }
      for (let scen of this.state.allScens) {
        if (rId in metBalAllScens[scen.id]) metBalR[scen.id] = metBalAllScens[scen.id][rId];
        else metBalR[scen.id] = 0;
      }
      return metBalR;
    })

    return metBalReacts;

    // return metaboliteBalance;
  }

  // Returns sorted list of metabolites in current models
  getMetaboliteIds() {
    let modelIds = this.state.allScens.map(scen => scen.baseModelId);
    modelIds = Array.from(new Set(modelIds));
    let metabolites = [];
    modelIds.forEach(modelId => {
      let model = this.getModel(modelId)
      let metabolitesModel = model.metabolites.map(m => m.id);
      metabolites = metabolites.concat(metabolitesModel);
    });
    metabolites = Array.from(new Set(metabolites));
    metabolites.sort();
    return metabolites;
  }

  // Returns a metabolite object from the first occurence
  getMetaboliteFromId(metaboliteId) {
    let modelIds = this.state.allScens.map(scen => scen.baseModelId);
    modelIds = Array.from(new Set(modelIds));
    let metaboliteOut = {};
    modelIds.forEach(modelId => {
      let model = this.getModel(modelId);
      let metabolite = model.metabolites.filter(m => m.id === metaboliteId);
      if (metabolite.length > 0) metaboliteOut = metabolite[0];
    });
    return metaboliteOut
  }

  // Returns a reaction object from the first occurence
  getReactionFromId(reactId) {
    let modelIds = this.state.allScens.map(scen => scen.baseModelId);
    modelIds = Array.from(new Set(modelIds));
    let reactOut = {};
    modelIds.forEach(modelId => {
      let model = this.getModel(modelId);
      let react = model.reactions.filter(r => r.id === reactId);
      if (react.length > 0) reactOut = react[0];
    });
    return reactOut;
  }

  // Returns sorted list of reactions in current models
  getReactionsIds() {
    let modelIds = this.state.allScens.map(scen => scen.baseModelId);
    modelIds = Array.from(new Set(modelIds));
    let reactions = [];
    modelIds.forEach(modelId => {
      let model = this.getModel(modelId)
      let reactionsModel = model.reactions.map(r => r.id);
      reactions = reactions.concat(reactionsModel);
    });
    reactions = Array.from(new Set(reactions));
    reactions.sort();
    return reactions;
  }

  setSelScenId = (selScenId) => {
    this.setState({ selScenId });
  }

  getSelScen = () => {
    if (this.state.selScenId !== '') return this.state.allScens.filter(scen => scen.id === this.state.selScenId)[0];
    else return {};
  }

  addModifReactionToScen(scenId, reactionId, lowerBound, upperBound) {
    let scen = Object.assign({}, this.state.allScens.filter(scen => scen.id === scenId)[0]);
    scen.modifReacts = { ...scen.modifReacts }
    scen.modifReacts[reactionId] = [lowerBound, upperBound];
    let allScens = this.state.allScens.map(s => {
      if (s.id === scen.id) return scen;
      else return s;
    })
    this.setState({ allScens });
  }

  removeModifReactionToScen(scenId, reactionId) {
    let scen = Object.assign({}, this.state.allScens.filter(scen => scen.id === scenId)[0]);
    scen.modifReacts = { ...scen.modifReacts }
    delete scen.modifReacts[reactionId]
    let allScens = this.state.allScens.map(s => {
      if (s.id === scen.id) return scen;
      else return s;
    })
    this.setState({ allScens });
  }
  addScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen => scen.id !== selScen.id).concat([selScen]) }))
  }
  removeScen = (selScen) => {
    this.setState(state => ({ allScens: state.allScens.filter(scen => scen.id !== selScen.id) }))
  }
  // returns model if it is already stored
  getModel(modelId) {
    let modelOut = this.state.allModels.filter(model => model.id === modelId);
    if (modelOut.length > 0) return modelOut[0];
    else return {}
  }
  getScen(scenId) {
    let scenOut = this.state.allScens.filter(scen => scen.id === scenId);
    if (scenOut.length > 0) return scenOut[0];
    else return {}
  }
  // Loads model if not already in allModels
  async loadModel(modelId) {
    if (!(modelId in this.state.allModels)) {
      let model = await apiCalls.getModelFromId(modelId, true);
      let allModels = this.state.allModels.filter(model => model.id !== modelId).concat([model])
      this.setState({ allModels });
    }
  }
  // Switches page options vs results
  async switchMainPage() {
    if (this.state.page === 'options') {
      // change page
      this.setState({ page: 'results' })
      // run model
      let respfba = {};
      for (let scen of this.state.allScens) {
        let res = await apiCalls.runpFBA(scen);
        respfba[scen.id] = res;
      }
      this.setState({ respfba });
    }
    else {
      this.setState({ page: 'options', respfba: {} });
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
      setSelScenId: this.setSelScenId.bind(this),
      getSelScen: this.getSelScen.bind(this),
      addScen: this.addScen.bind(this),
      removeScen: this.removeScen.bind(this),
      getModel: this.getModel.bind(this),
      addModifReactionToScen: this.addModifReactionToScen.bind(this),
      removeModifReactionToScen: this.removeModifReactionToScen.bind(this),
      switchMainPage: this.switchMainPage.bind(this),
      getScen: this.getScen.bind(this),
      getReactionsIds: this.getReactionsIds.bind(this),
      getReactionFromId: this.getReactionFromId.bind(this),
      getMetaboliteIds: this.getMetaboliteIds.bind(this),
      getMetaboliteFromId: this.getMetaboliteFromId.bind(this),
      getMetaboliteBalance: this.getMetaboliteBalance.bind(this),
    }

    // Definition of main content
    let content;
    if (this.state.page === 'options') {
      // window.clearEscher();
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

    else if (this.state.page === 'results' && Object.keys(this.state.respfba).length === 0) {
      content = (
        <div id="App">
          <Navbar />
          <div id="App-content">
            <div className="slack">
              <span className="slack-dot slack-dot--a"></span>
              <span className="slack-dot slack-dot--b"></span>
              <span className="slack-dot slack-dot--c"></span>
              <span className="slack-dot slack-dot--d"></span>
            </div>
          </div>
        </div>
      );
    }

    else if (this.state.page === 'results' && Object.keys(this.state.respfba).length === this.state.allScens.length) {
      content = (
        <div id="App">
          <Navbar />
          <div id="App-content">
            <div id="results-left">
              <ReactionResults />
              <MetaboliteResults />
            </div>
            <MetabolicMap />
          </div>
        </div>
      );
    }

    // For debug !!
    // content = <ReactionResults />


    return (
      <AppContext.Provider value={appContext}>
        {content}
      </AppContext.Provider >
    )
  }
}

export default App;