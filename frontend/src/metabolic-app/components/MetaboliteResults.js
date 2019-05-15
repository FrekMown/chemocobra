import React, { Component } from 'react';
import './MetaboliteResults.css';
import AppContext from '../app-context';

export default class MetaboliteResults extends Component {
  static contextType = AppContext;
  render() {

    return (
      <div id="MetaboliteResults">
        MetaboliteResults
      </div>
    );
  }
}