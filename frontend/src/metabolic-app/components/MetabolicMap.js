import React, { Component } from 'react';
import './MetabolicMap.css';
import AppContext from '../app-context';

export default class MetabolicMap extends Component {
  static contextType = AppContext;
  render() {

    return (
      <div id="MetabolicMap">
        Metabolic Map
      </div>
    );
  }
}