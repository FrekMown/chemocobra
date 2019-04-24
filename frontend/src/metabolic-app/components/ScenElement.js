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

  handleChangeSelected(e) {
    this.setState(state => ({isSelected: !state.isSelected }));
    if (this.state.isSelected) this.context.addSelScen(this.props.scen);
    else this.context.removeSelScen(this.props.scen);
  }

  render() {
    // modified reactions
    let modifReactsScen = Object.keys(this.props.scen.modifReacts).map(reactId => (
      <li key={reactId}>{reactId}: {this.props.scen.modifReacts[reactId][0]}...{this.props.scen.modifReacts[reactId[1]]}</li>
    ));
    
    return (
      <div id="ScenElement">
        <div id="scen-element-first-row">
          <div id="scen-element-title">
            {this.props.scen.id}
          </div>
          <div id="scen-element-checkbox">
            <input 
              type="checkbox"
              checked={this.state.isSelected}
              onChange={this.handleChangeSelected.bind(this)}            
            />
          </div>          
        </div>
        <div id="scen-element-second-row">        
          <div id="scen-element-model">
            <span style={{fontWeight:"bold"}}>Model:</span> {this.props.scen.baseModel.id}
          </div>
          <div id="scen-element-objective">
          <span style={{fontWeight:"bold"}}>Objective:</span> {this.props.scen.objective}
          </div>
        </div>
        <div id="scen-element-reactions">
          {modifReactsScen}
        </div>

      </div>
    );
  }
}

export default ScenElement;