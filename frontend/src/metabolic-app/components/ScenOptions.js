import React, { Component } from 'react';
import './ScenOptions.css';
import AppContext from '../app-context';

class ScenOptions extends Component {
  static contextType = AppContext;

  render() {
    return (
      <div id="ScenOptions">
        <h1> ScenOptions </h1>
      </div>
    );
  }
}

  export default ScenOptions;