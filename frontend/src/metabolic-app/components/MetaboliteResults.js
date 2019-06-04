import React, { Component } from 'react';
import './MetaboliteResults.css';
import AppContext from '../app-context';
import SmilesDrawer from 'smiles-drawer';
import ReactTable from 'react-table';

export default class MetaboliteResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMetaboliteId: 'None',
      tab: 'info', // can be either info or balance
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
      );
    }
    else if (this.state.tab === 'balance') {
      // styleCanvasStruct = {display: 'none'};
      // let data = {};
      // if (this.state.selMetaboliteId!=="None") {
      //   let data = this.context.getMetaboliteBalance(this.context.selMetaboliteId,0);
      // }
      // let columns = [
      //   {
      //     Header: 'Reactions',
      //     columns: [
      //       { Header: 'ID', accessor: }
      //     ]
      //   }
      //   {
      //     Header: 'Scenarios',
      //     columns: this.context.allScens.map(scen => ({
      //       Header: scen.id
      //     }));
      //   }
      // ]
      content = (
        <h4>Balance Here</h4>
      )
    }

    

    return (
      <div id="MetaboliteResults">
        <div id="metabolite-results-title">
          Metabolite Analysis
        </div>
        <div id="metabolite-results-form">
          <label>
            Please choose a metabolite:
            <select
              value={this.state.selMetaboliteId}
              onChange={this.handleMetaboliteChange.bind(this)}
            > {metaboliteOptions}
            </select>
          </label>
        </div>
        <div id="metabolite-results-radio" onChange={this.handleChangeTab.bind(this)}>
          <input type="radio" value="info" name="metabolite-radio" defaultChecked={true}/> Infos
          <input type="radio" value="balance" name="metabolite-radio"/> Balance
        </div>
        <div id="metabolite-results-content">
          {content}
        </div>
        <div id="metabolite-results-structure" 
          style={styleCanvasStruct}
        >
          <canvas id="metabolite-results-structure-canvas">
          </canvas>
        </div>
      </div>
    );
  }
}