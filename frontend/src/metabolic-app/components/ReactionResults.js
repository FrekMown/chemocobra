import React, { Component } from 'react';
import './ReactionResults.css';
import AppContext from '../app-context';
import * as apiCalls from '../api-calls';
import { JsonToTable } from 'react-json-to-table';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


export default class ReactionResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selReactionId: 'None',
      fractOptimum: 0.9,
      correctFractOpt: true,
      inputfractOptimum: '0.9',
      dataFVA: {},
      tab: 'info', //can be either info or FVA
      selReaction: {},
    }
  }
  static contextType = AppContext;

  async componentDidMount() {
    const scen = this.context.getSelScen();
    const model = this.context.getModel(scen.baseModelId);
    this.setState({
      selReaction: model.reactions.filter(r => r.id === scen.objective)[0],
    });
    this.runFVA(scen.objective);
  }

  async runFVA(reactId) {
    let resFVA = await apiCalls.runFVAforReaction(
      reactId,
      this.context.allScens,
      this.context.respfba,
      1);
    this.setState({ dataFVA: resFVA })

  }

  validateFractOpt(e) {
    // verify if input is correct
    this.setState({ inputfractOptimum: e.target.value });
    let correct = !isNaN(e.target.value);
    if (correct) {
      let number = Number(e.target.value);
      correct = correct && number > 0 && number <= 1;
      if (correct) this.setState({ fractOptimum: number });
    }
    this.setState({ correctFractOpt: correct });
  }

  handleReactionChange(_, val) {
    console.log("handleReactionChange", val);
    this.setState({ selReaction: val, dataFVA: {} });
    this.runFVA(val.id);
  }

  handleChangeTab(e) {
    this.setState({ tab: e.target.value });
  }

  render() {
    // Creation of reaction options
    let reactionsList = ['None'].concat(this.context.getReactionsIds());
    let reactionOptions = reactionsList.map(rId => (
      <option key={rId}>{rId}</option>
    ));

    // Reaction
    let reaction = this.state.selReaction;
    console.log("reaction", reaction);

    // definition of main content depending on page
    let content;
    if (this.state.tab === "info") {
      content = (
        <div id="reaction-infos-table">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{reaction.name}</td>
              </tr>
              <tr>
                <th>Bounds:</th>
                <td>{reaction.lower_bound} / {reaction.upper_bound}</td>
              </tr>
              <tr>
                <th>Genes:</th>
                <td>{reaction.gene_reaction_rule}</td>
              </tr>
              <tr>
                <th>Reaction:</th>
                <td>{reaction.reactionString}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    else if (this.state.tab === "FVA") {

      content = (
        <div id='reaction-json-table'>
          <JsonToTable json={this.state.dataFVA} id="reaction-json-table" />
        </div>
      )
    }

    return (
      <div id="ReactionResults">
        <div id="reaction-results-title">
          Reactions Analysis
        </div>
        <div id="reaction-results-form">
            <Autocomplete
              id="reaction-analysis"
              options={this.context.getReactions()}
              getOptionLabel={reaction => `${reaction.id}: ${reaction.name}`}
              renderInput={params => (<TextField {...params} label="Reaction" variant="outlined" fullWidth />)}
              value={this.state.selReaction}
              onChange={this.handleReactionChange.bind(this)}
              style={{ minWidth: 350 }}
              disableClearable={true}
            />
        </div>
        <div id="reaction-results-radio" onChange={this.handleChangeTab.bind(this)}>
          <input type="radio" value="info" name="radio" defaultChecked={true} /> Infos
          <input type="radio" value="FVA" name="radio" /> FVA
        </div>
        <div id="reaction-results-infos">
          {content}
        </div>
      </div>
    );
  }
}