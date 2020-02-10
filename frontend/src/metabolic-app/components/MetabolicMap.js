import React, { Component } from 'react';
import './MetabolicMap.css';
import AppContext from '../app-context';
import * as apiCalls from '../api-calls';

export default class MetabolicMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMapId: 'None',
      selMap: null,
    }
    this.escherBuilder = null;
  }
  static contextType = AppContext;

  componentDidMount() {
   this.loadEscher(
      this.context.getModel(this.context.getSelScen().baseModelId),
    );

   this.changeMapEscher(
      this.context.getSelScen(),
      this.context.getModel(this.context.getSelScen().baseModelId),
      this.context.respfba,
      this.state.selMap,
    )
  }


  componentDidUpdate() {
   this.changeMapEscher(
      this.context.getSelScen(),
      this.context.getModel(this.context.getSelScen().baseModelId),
      this.context.respfba,
      this.state.selMap,
    )
  }

  changeMapEscher(scen, model, respfba, selMap) {
    // Create dictionary with data for escher
    let reactionData = {}
    for (let reaction of model.reactions) {
      if (reaction.id in respfba[scen.id]) {
        reactionData[reaction.id] = respfba[scen.id][reaction.id];
      }
      else {
        reactionData[reaction.id] = 0;
      }
    }
  
    if (selMap) {
      this.escherBuilder.load_map(selMap);
      this.escherBuilder.set_reaction_data(reactionData);
    }
  
  
  
  }
  
  loadEscher(model) {
  
      // Options for escher
      let escherOptions = {
        never_ask_before_quit: true,
        // reaction_style: ['color', 'size', 'text', 'abs'],
        reaction_scale: [
          { type: 'min', color: '#c8c8c8', size: 12 },
          { type: 'max', color: '#66176d', size: 20 }
        ],
        enable_keys: false,
        enable_search: false,
        
      };
  
      if (document.querySelector("#metabolic-map-escher")) {
        // Create escher builder
        this.escherBuilder = window.escher.Builder(
          null, // map_data
          model, // model_data
          null, // embedded_css
          document.querySelector("#metabolic-map-escher"), // selection
          escherOptions, // options
        );
      }
    }
  
  clearEscher() {
    this.escherBuilder = null;
  }

  async handleMapChange(e) {
    let selMapId = e.target.value
    let selMap = {}
    if (selMapId !== "None") {
      selMap = await apiCalls.getMapFromId(selMapId);

    }
    else selMap = null;
    this.setState({ selMapId, selMap });
  }

  handleScenChange(e) {
    let scen = this.context.getScen(e.target.value);
    this.context.setSelScenId(scen.id);
  }

  getMapsSelScen() {
    return this.context.allMapIds.filter(mapId => (
      mapId.indexOf(this.context.getSelScen().baseModelId.split("_")[0])>=0
    ));
  }

  render() {
    // Define select menu for map selection
    let mapOptions = [(
      <option key={'None'} value="None">No map</option>
    )];
    
    mapOptions.push(this.getMapsSelScen().map(mapId => (
      <option key={mapId}>{mapId}</option>
    )));

    // Define options for scenarios
    let scenOptions = this.context.allScens.map(scen => (
      <option key={scen.id}>{scen.id}</option>
    ));

    return (
      <div id="MetabolicMap">
        <div id="metabolic-map-form">
          <label>
            Choose Scenario:
            <select
              value={this.context.selScenId}
              onChange={this.handleScenChange.bind(this)}
            >
              {scenOptions}
            </select>
          </label>
          <label>
            Please select a map:
            <select
              onChange={this.handleMapChange.bind(this)}
            >
              {mapOptions}
            </select>
          </label>
        </div>
        <div id="metabolic-map-escher">
          Metabolic Map
        </div>
      </div>
    );
  }
}