import React, { Component } from "react";
import "./ScenElement.css";
import AppContext from "../app-context";
import PT from "prop-types";

class ScenElement extends Component {
  static contextType = AppContext;

  static propTypes = {
    scen: PT.object.isRequired,
  }

  handleClick() {
    if (this.context.selScenId !== this.props.scen.id) {
      this.context.setSelScenId(this.props.scen.id);
      this.context.setCreateNewScen(false);
    }
  }

  render() {
    // modified reactions
    let modifReactsScen = Object.keys(this.props.scen.modifReacts).map(reactId => (
      <div key={reactId} className="modif-reaction">
        <strong>{reactId}</strong> : {this.props.scen.modifReacts[reactId][0]} / {this.props.scen.modifReacts[reactId][1]}
      </div>
    ));

    return (
      <div 
        id="ScenElement" 
        className={this.context.selScenId === this.props.scen.id ? "selected" : null}
        onClick={this.handleClick.bind(this)}
      >
        <div id="scen-element-title">
          {this.props.scen.id}
        </div>


        <div id="scen-element-model">
          <span style={{ fontWeight: "bold" }}>Model Id:</span> {this.props.scen.baseModelId}
        </div>
        <div id="scen-element-organism">
          <span style={{ fontWeight: "bold" }}>Organism:</span> {this.props.scen.baseModelName}
        </div>
        <div id="scen-element-objective">
          <span style={{ fontWeight: "bold" }}>Objective:</span> {this.props.scen.objective}
        </div>
        <div id="scen-element-reactions">
          <span style={{ fontWeight: "bold" }}>Modified Reactions:</span>
        </div>
        {modifReactsScen}
      </div>
    );
  }
}

export default ScenElement;