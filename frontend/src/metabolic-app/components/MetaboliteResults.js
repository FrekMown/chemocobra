import React, { Component } from 'react';
import './MetaboliteResults.css';
import AppContext from '../app-context';
import { JsonToTable } from "react-json-to-table";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default class MetaboliteResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selMetaboliteId: 'None',
      tab: 'info', // can be either info or balance
      // metabolite: {},
      structSVG: '',
      selMetabolite: {},
    }
  }
  static contextType = AppContext;

  async componentDidMount() {
    const scen = this.context.getSelScen();
    const model = this.context.getModel(scen.baseModelId);
    this.setState({
      selMetabolite: model.metabolites[0],
    });
  }

  async componentDidUpdate(_, prevState) {
    // get structure image as svg
    let metChanged = this.state.selMetabolite.id !== prevState.selMetabolite.id;
    if (metChanged && this.state.selMetaboliteId !== {}) {
      let imgURL = `/chemocobra/chemo/get_svg_metabolite/${this.state.selMetabolite.id}`;
      let structSVG;
      if (Object.keys(this.state.selMetabolite).length === 0) structSVG = '';
      else structSVG = await fetch(imgURL).then(response => response.text());
      this.setState({ structSVG });
    }

  }

  handleChangeTab(e) {
    this.setState({ tab: e.target.value });
  }

  // handleClickMNX(mnx_id) {
  //   window.open("http://www.metanetx.org/chem_info/"+mnx_id, '_blank');
  // }

  handleMetaboliteChange(_, val) {

    this.setState({
      selMetabolite: val,
    });


  }


  render() {
    // Creation of metabolite options
    // let metaboliteList = ['None'].concat(this.context.getMetaboliteIds());
    // let metaboliteOptions = metaboliteList.map(mId => (
    //   <option key={mId}>{mId}</option>
    // ));

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
                  <td>{this.state.selMetabolite.name}</td>
                </tr>
                <tr>
                  <th>Formula:</th>
                  <td>{this.state.selMetabolite.formula}</td>
                </tr>
                <tr>
                  <th>Structure:</th>
                  <td onClick={_ => this.handleClickMNX(this.state.selMetabolite.MNX)}>{this.state.selMetabolite.MNX}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="metabolite-structure" dangerouslySetInnerHTML={{ __html: this.state.structSVG }} />
        </>
      );
    }
    else if (this.state.tab === 'balance') {
      let metBal = {};
      if (this.state.selMetabolite.id) {
        metBal = this.context.getMetaboliteBalance(this.state.selMetabolite.id, 0);
      }
      content = metBal.length > 0 ? 
        <JsonToTable json={metBal} key="json-table" id="metabolite-json-table" /> :
        <div>No flux regarding this metabolite</div>
    }






    return (
      <div id="MetaboliteResults">
        <div id="metabolite-results-title">
          Metabolite Analysis
        </div>
        <div id="metabolite-results-form">
          {/* <label>
            Metabolite? :
            <select
              value={this.state.selMetaboliteId}
              onChange={this.handleMetaboliteChange.bind(this)}
            > {metaboliteOptions}
            </select>
          </label> */}
          <Autocomplete
            id="metabolite-analysis"
            options={this.context.getMetabolites()}
            getOptionLabel={metabolite => `${metabolite.id}: ${metabolite.name}`}
            renderInput={params => (<TextField {...params} label="Metabolite" variant="outlined" fullWidth />)}
            value={this.state.selMetabolite}
            onChange={this.handleMetaboliteChange.bind(this)}
            style={{ minWidth: 350 }}
            disableClearable={true}
          />
        </div>
        <div id="metabolite-results-radio" onChange={this.handleChangeTab.bind(this)}>
          <input type="radio" value="info" name="metabolite-radio" defaultChecked={true} /> Infos
          {/* <input type="radio" value="structure" name="metabolite-radio" /> Structure */}
          <input type="radio" value="balance" name="metabolite-radio" /> Balance
        </div>
        <div id="metabolite-results-content">
          {content}
        </div>

      </div>
    );
  }
}