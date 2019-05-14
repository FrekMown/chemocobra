import React, { Component } from 'react';
import './MetabolicMap.css';
import AppContext from '../app-context';
import * as apiCalls from '../api-calls';
import * as escher from 'escher-vis';
import './builder.css';
// import escher from './escher';

export default class MetabolicMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMapId: 'None',
      selMap: [],
    }
    this.escherRef = React.createRef();
  } 
  static contextType = AppContext;

  async handleMapChange(e) {
    let selMapId = e.target.value
    let selMap = {}
    if (selMapId!=="None"){
      selMap = await apiCalls.getMapFromId(selMapId);
      
    }
    this.setState({selMapId, selMap});
  }

  handleScenChange(e) {
    let scen = this.context.getScen(e.target.value)
    this.context.setSelScenId(scen.id);
  }
  
  render() {
    // Define select menu for map selection
    let mapOptions = [(
      <option key={'None'}>No map</option>
    )];
    mapOptions.push(this.context.allMapIds.map(mapId => (
      <option key={mapId}>{mapId}</option>
    )));

    // Define options for scenarios
    let scenOptions = this.context.allScens.map(scen => (
      <option key={scen.id}>{scen.id}</option>
    ));

    // Model
    let scen = this.context.getSelScen();
    let model = this.context.getModel(scen.baseModelId);

    // Create dictionary with data for escher
    let reactionData = {}
    for (let reaction of model.reactions) {
      if (reaction.id in this.context.respfba[this.context.selScenId]) {
        reactionData[reaction.id] = this.context.respfba[this.context.selScenId][reaction.id];
      }
      else {
        reactionData[reaction.id] = 0;
      }
    }

    // Escher
    let escherOptions = {
      never_ask_before_quit: true,
      reaction_style: ['color', 'size', 'text', 'abs'],
    };
    if (this.state.selMap.length>0) {
      // Create escher builder
      let escherBuilder = escher.Builder(
        this.state.selMap, // map_data
        model, // model_data
        null, // embedded_css
        this.escherRef.current, // selection
        escherOptions, // options
      );

      escherBuilder.set_reaction_data([reactionData])
      
      // escherBuilder.view_mode();
    }

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
        <div id="metabolic-map-escher" ref={this.escherRef}>
          Metabolic Map
        </div>
      </div>
    );
  }
}