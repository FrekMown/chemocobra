import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
import "react-table/react-table.css";
import ModelForm from './ModelForm';
import ModelTable from './ModelTable';


class ModelDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {    
      chosenBaseModel: {reactions:[]},
    };    
  }
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  componentWillMount() {
    // Load initial
    fetch('metabolic/see_available_models')
    .then(response => response.json())
      .then(data => this.context.setAllModels(data))
    .catch(response => console.log(response))
  }

  // **************************************
  // Functions 
  // **************************************

  async changeBaseModel(modelId) {
    let baseModel = await this.context.getModel(modelId);
    this.setState({ chosenBaseModel: baseModel });
  }


  // ***************************************
  render() {
    return (
      <div id="ModelDescription">
        <ModelForm 
          chosenBaseModel={this.state.chosenBaseModel}
          changeBaseModel={this.changeBaseModel.bind(this)}
        />
        <div id="model-table">
          <ModelTable 
            chosenBaseModel={this.state.chosenBaseModel}
          />
        </div>
      </div>
    );

  }
}

export default ModelDescription;