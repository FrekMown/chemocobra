import React, { Component } from 'react';
import './PlotResults.css';
import AppContext from '../app-context';

export default class PlotResults extends Component {
  static contextType = AppContext;
  render() {

    return (
      <div id="PlotResults">
        PlotResults
      </div>
    );
  }
}