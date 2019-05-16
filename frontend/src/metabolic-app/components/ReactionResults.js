import React, { Component } from 'react';
import './ReactionResults.css';
import AppContext from '../app-context';
import * as apiCalls from '../api-calls';

export default class ReactionResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selReactionId: 'None',
      fractOptimum: 0.9,
      correctFractOpt: true,
      inputfractOptimum: '0.9',
      traceFVA: [],
    }
    this.plotlyRef = React.createRef();
  }
  static contextType = AppContext;


  async componentDidUpdate(_,prevState) {
    let changeFVA = (prevState.selReactionId !== this.state.selReactionId) ||
      (prevState.fractOptimum !== this.state.fractOptimum);
    changeFVA = changeFVA && this.state.selReactionId !== "None";
    
    if(changeFVA) {
      let traceFVA = await apiCalls.getTracePlotlyFVA(
        this.state.selReactionId,
        this.context.allScens,
        this.state.fractOptimum,
        this.context.respfba,
        );
      console.log('traceFVA',traceFVA);
      this.setState({traceFVA});
    }
    // For plotly
    if (this.plotlyRef.current !== undefined && this.plotlyRef.current !== null) {
      console.log('plotylRef',this.plotlyRef)
      this.plotlyRef.current.resizeHandler();
    }
  }

  validateFractOpt(e) {
    // verify if input is correct
    this.setState({inputfractOptimum: e.target.value});
    let correct = !isNaN(e.target.value);
    if(correct) {
      let number = Number(e.target.value);
      correct = correct && number>0 && number <=1;
      if(correct) this.setState({fractOptimum: number});
    }
    this.setState({correctFractOpt: correct});
  }

  handleReactionChange(e) {
    this.setState({selReactionId: e.target.value});    
  }

  render() {
    // Creation of reaction options
    let reactionsList = ['None'].concat(this.context.getReactionsIds());
    let reactionOptions = reactionsList.map(rId => (
      <option key={rId}>{rId}</option>
    ));

    // red background if fract optimum not valid
    let styleInput = {}
    if (!this.state.correctFractOpt) styleInput = {backgroundColor: 'LightCoral'}

    // Reaction
    let reaction = this.context.getReactionFromId(this.state.selReactionId);
    console.log('reaction',reaction);

    return (
      <div id="ReactionResults">
        <div id="reaction-results-title">
          Reactions Analysis
        </div>
        <div id="reaction-results-form">
          <label>
            Please choose a reaction:
            <select 
              value={this.state.selReactionId}
              onChange={this.handleReactionChange.bind(this)}
            >{reactionOptions}
            </select>
          </label>
          {/* <label>
            Fraction of Optimum:
            <input
              type="text"
              value={this.state.inputfractOptimum} 
              onChange={this.validateFractOpt.bind(this)}
              style={styleInput}
            />
          </label> */}
        </div>
        <div id="reaction-results-infos">
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
      </div>
    );
  }
}