import React, { Component } from 'react';
import './TableResults.css';
import AppContext from '../app-context';

export default class TableResults extends Component {
  static contextType = AppContext;
  render() {

    return (
      <div id="TableResults">
        TableResults
      </div>
    );
  }
}