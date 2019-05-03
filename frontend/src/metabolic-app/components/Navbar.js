import React, { Component } from 'react';
import './Navbar.css';
import AppContext from '../app-context';

class Navbar extends Component {
  static contextType = AppContext;

  handleSwitchButton(e) {
    
  }

  render() {
    // switchButtonText
    let switchButtonText;
    if (this.context.page==='options') {
      switchButtonText = 'Run Model'
    }
    else {
      switchButtonText = 'Options'
    }
  
    return(
      <div id="Navbar">
        <div id="Navbar-switch-button">
          <button onClick={this.context.switchMainPage}>
            {switchButtonText}</button>        
        </div>
        <div id="Navbar-title">
          Metabolic Modelling
        </div>
        <div id="Navbar-empty">
  
        </div>
      </div>
    )

  }

}

export default Navbar;

