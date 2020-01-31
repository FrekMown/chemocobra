import React, { Component } from 'react';
import './MetaboliteResults.css';
import AppContext from '../app-context';
import { JsonToTable } from "react-json-to-table";

export default class MetaboliteResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMetaboliteId: 'None',
      tab: 'info', // can be either info or balance
      metabolite: {},
      structSVG: '',
    }
  }
  static contextType = AppContext;

  async componentDidUpdate(_,prevState) {
    // get structure image as svg
    let metChanged = this.state.selMetaboliteId !== prevState.selMetaboliteId;
    if (metChanged && this.state.metabolite !== {}) {
      let imgURL = `/chemocobra/chemo/get_svg_metabolite/${this.state.metabolite.id}`;
      let structSVG;
      if (this.state.selMetaboliteId === 'None') structSVG = '';
      else structSVG = await fetch(imgURL).then(response=>response.text());
      this.setState({structSVG});
    }
  
  }

  handleChangeTab(e) {
    this.setState({tab: e.target.value});
  }

  // handleClickMNX(mnx_id) {
  //   window.open("http://www.metanetx.org/chem_info/"+mnx_id, '_blank');
  // }

  handleMetaboliteChange(e) {
    let m_id = e.target.value;
    if (m_id === "None") this.setState({metabolite: {}, structSVG: ''})
    else {
      this.setState({selMetaboliteId: m_id, 
        metabolite: this.context.getMetaboliteFromId(m_id)});
    }

  }

  
  render() {
    // Creation of metabolite options
    let metaboliteList = ['None'].concat(this.context.getMetaboliteIds());
    let metaboliteOptions = metaboliteList.map(mId => (
      <option key={mId}>{mId}</option>
    ));

    // Definition of main content depending on page
    let content;
    if (this.state.tab === 'info') {
      content = (
        <>
        <div id="metabolite-infos-table">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{this.state.metabolite.name}</td>
              </tr>
              <tr>
                <th>Formula:</th>
                <td>{this.state.metabolite.formula}</td>
              </tr>
              <tr>
                <th>Structure:</th>
                <td onClick={_ => this.handleClickMNX(this.state.metabolite.MNX)}>{this.state.metabolite.MNX}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="metabolite-structure" dangerouslySetInnerHTML={{__html: this.state.structSVG}} />
        </>
      );
    }
    else if (this.state.tab === 'balance') {
      let metBal = {};
      if (this.state.selMetaboliteId!=="None") {
        metBal = this.context.getMetaboliteBalance(this.state.selMetaboliteId,0);
      }
      
      content = (
        <JsonToTable json={metBal} key="json-table" id="metabolite-json-table"/>
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
          <input type="radio" value="info" name="metabolite-radio" defaultChecked={true}/> Infos
          {/* <input type="radio" value="structure" name="metabolite-radio" /> Structure */}
          <input type="radio" value="balance" name="metabolite-radio"/> Balance
        </div>
        <div id="metabolite-results-content">
          {content}
        </div>
        
      </div>
    );
  }
}