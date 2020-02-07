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
    window.loadEscher(
      // this.context.getSelScen(),
      this.context.getModel(this.context.getSelScen().baseModelId),
      // this.context.respfba,
      // this.state.selMap,
    );

    window.changeMapEscher(
      this.context.getSelScen(),
      this.context.getModel(this.context.getSelScen().baseModelId),
      this.context.respfba,
      this.state.selMap,
    )
  }

  componentDidUpdate() {
    window.changeMapEscher(
      this.context.getSelScen(),
      this.context.getModel(this.context.getSelScen().baseModelId),
      this.context.respfba,
      this.state.selMap,
    )
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

  render() {
    // Define select menu for map selection
    let mapOptions = [(
      <option key={'None'} value="None">No map</option>
    )];
    mapOptions.push(this.context.allMapIds.map(mapId => (
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