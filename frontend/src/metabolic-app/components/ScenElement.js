import React, { Component } from "react";
import "./ScenElement.css";
import AppContext from "../app-context";
import PT from "prop-types";

class ScenElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: true
    }
  }
  static contextType = AppContext;

  static propTypes = {
    scen: PT.object.isRequired,
  }

  handleChangeSelected() {
    this.setState(state => {
      return {isSelected: !state.isSelected }
    });
  }
  handleRemoveScen() {
    this.context.removeScen(this.props.scen);
  }

  render() {
    // modified reactions
    let modifReactsScen = Object.keys(this.props.scen.modifReacts).map(reactId => (
      <li key={reactId}>
        {reactId}: {this.props.scen.modifReacts[reactId][0]} ==> {this.props.scen.modifReacts[reactId][1]}
      </li>
    ));

    // Remove scen only if more than one scen in allscens
    let removeDiv = <div></div>
    if (this.context.allScens.length>1) {
      removeDiv = (
        <div id="scen-element-remove" onClick={this.handleRemoveScen.bind(this)}>
            X
        </div>
      )
    }
    
    return (
      <div id="ScenElement">
        <div id="scen-element-first-row">
          <div id="scen-element-title">
            {this.props.scen.id}
          </div>
          {removeDiv}
        </div>
        <div id="scen-element-second-row">        
          <div id="scen-element-model">
            <span style={{fontWeight:"bold"}}>Model:</span> {this.props.scen.baseModelId}
          </div>
          <div id="scen-element-objective">
          <span style={{fontWeight:"bold"}}>Objective:</span> {this.props.scen.objective}
          </div>
        </div>
        <div id="scen-element-reactions">
          <span style={{textAlign:"center", fontWeight:"bold"}}>Modified Reactions:</span>
          {modifReactsScen}
        </div>
      </div>
    );
  }
}

export default ScenElement;