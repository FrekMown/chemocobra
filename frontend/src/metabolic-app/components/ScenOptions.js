import React, { Component } from 'react';
import './ScenOptions.css';
import AppContext from '../app-context';
import ScenElement from './ScenElement';

class ScenOptions extends Component {
  static contextType = AppContext;

  render() {
    // Create Scen Elements
    let allScenElements = this.context.allScens.map(scen => (
      <ScenElement
        key={scen.id}
        scen={scen}
      />
    ))

    return (
      <div id="ScenOptions">
        <h1>List Scenarios</h1>
        <div id="scen-options-elements">
          {allScenElements}
        </div>
      </div>
    );
  }
}

  export default ScenOptions;