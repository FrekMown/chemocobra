import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
// import ReactTable from 'react-table';
import "react-table/react-table.css";
import ModelForm from './ModelForm';
import ModelTable from './ModelTable';


class ModelDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {    
      chosenBaseModel: {},
    };    
  }
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  componentWillMount() {
    // Load initial ...this.context.currentScenmodel list
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
    this.context.setCurrentScen({
     ...this.context.currentScen,
     baseModel
    });
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
          <ModelTable />
        </div>
      </div>
    );

  }
}

export default ModelDescription;