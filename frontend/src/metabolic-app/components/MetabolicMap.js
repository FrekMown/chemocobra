import React, { Component } from 'react';
import './MetabolicMap.css';
import AppContext from '../app-context';
import * as apiCalls from '../api-calls';

export default class MetabolicMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMapId: 'None',
      selMap: {},
    }
    this.escherRef = React.createRef();
  } 
  static contextType = AppContext;

  async handleMapChange(e) {
    let selMapId = e.target.value
    let selMap;
    if (selMapId!=="None"){
      selMap = await apiCalls.getMapFromId(selMapId);
    }
    else {
      selMap = {}
    }
    this.setState({selMapId, selMap});
  }
  
  render() {
    // Define select menu for map selection
    let mapOptions = [(
      <option key={'None'}>No map</option>
    )];
    mapOptions.push(this.context.allMapIds.map(mapId => (
      <option key={mapId}>{mapId}</option>
    )));

    return (
      <div id="MetabolicMap" ref={this.escherRef}>
        <div id="metabolic-map-form">
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