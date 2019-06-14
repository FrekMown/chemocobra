import React, { Component } from 'react';
import './MetaboliteResults.css';
import AppContext from '../app-context';
import SmilesDrawer from 'smiles-drawer';
import { JsonToTable } from "react-json-to-table";

export default class MetaboliteResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMetaboliteId: 'None',
      tab: 'structure', // can be either info, balance or structure
    }
  }
  static contextType = AppContext;

  handleChangeTab(e) {
    this.setState({tab: e.target.value});
  }

  handleClickMNX(mnx_id) {
    window.open("http://www.metanetx.org/chem_info/"+mnx_id, '_blank');
  }

  handleMetaboliteChange(e) {
    this.setState({selMetaboliteId: e.target.value});
  }

  
  render() {
    // Creation of metabolite options
    let metaboliteList = ['None'].concat(this.context.getMetaboliteIds());
    let metaboliteOptions = metaboliteList.map(mId => (
      <option key={mId}>{mId}</option>
    ));

    // Metabolite chosen
    let metabolite = this.context.getMetaboliteFromId(this.state.selMetaboliteId);

    // Definition of main content depending on page
    let content;
    let styleCanvasStruct = {}
    if (this.state.tab === 'info') {
      content = (
        <div id="metabolite-infos-table">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{metabolite.name}</td>
              </tr>
              <tr>
                <th>Formula:</th>
                <td>{metabolite.formula}</td>
              </tr>
              <tr>
                <th>MetaNetX:</th>
                <td onClick={_ => this.handleClickMNX(metabolite.MNX)}>{metabolite.MNX}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    else if (this.state.tab === 'balance') {
      styleCanvasStruct = {display: 'none'};
      let metBal = {};
      if (this.state.selMetaboliteId!=="None") {
        metBal = this.context.getMetaboliteBalance(this.state.selMetaboliteId,0);
      }
      
      content = (
        <JsonToTable json={metBal} key="json-table" id="metabolite-json-table"/>
      );
    }

    else if (this.state.tab === 'structure') {
      // Plot metabolite structure if SMILES available
      let structOptions = {
        padding: 10,
        width: 300,
        height: 300,
      }
      let smilesDrawer = new SmilesDrawer.Drawer(structOptions);
      if('smiles' in metabolite && metabolite.smiles.length>1) {
        SmilesDrawer.parse(metabolite.smiles, function(tree) {
          smilesDrawer.draw(tree, 'metabolite-results-structure-canvas')
        }, function(err){
          console.log('error drawing mol', err);
        })
      }
      content = (
        <div id="metabolite-results-structure" style={styleCanvasStruct}>
          <canvas id="metabolite-results-structure-canvas" />
        </div>
      );
    }

    

    return (
      <div id="MetaboliteResults">
        <div id="metabolite-results-title">
          Metabolite Analysis
        </div>
        <div id="metabolite-results-form">
          <label>
            Metabolite? :
            <select
              value={this.state.selMetaboliteId}
              onChange={this.handleMetaboliteChange.bind(this)}
            > {metaboliteOptions}
            </select>
          </label>
        </div>
        <div id="metabolite-results-radio" onChange={this.handleChangeTab.bind(this)}>
          <input type="radio" value="info" name="metabolite-radio" /> Infos
          <input type="radio" value="structure" name="metabolite-radio" defaultChecked={true}/> Structure
          <input type="radio" value="balance" name="metabolite-radio"/> Balance
        </div>
        <div id="metabolite-results-content">
          {content}
        </div>
        
      </div>
    );
  }
}