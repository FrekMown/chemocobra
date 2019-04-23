import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import ModelForm from './ModelForm';
import * as apiCalls from '../api-calls'


class ModelDescription extends Component {
  state = {    
    chosenBaseModel: {},
    currentScen: {},
  };
  static contextType = AppContext;

  // **************************************
  // Lifecycle Compontents
  // **************************************

  componentWillMount() {
    // Load initial model list
    fetch('metabolic/see_available_models')
    .then(response => response.json())
      .then(data => this.context.setAllModels(data))
    .catch(response => console.log(response))
  }

  // **************************************
  // Functions 
  // **************************************
  async changeBaseModel(e) {
    if (e.target.value !== "None") {
      let chosenBaseModel = await apiCalls.getModelFromId(e.target.value,true);
      this.setState({ chosenBaseModel });
    }
    else this.context.setBaseModel({});
  }

  // ***************************************
  render() {

    // Creation of columns for table
    const columns = [
      {
        Header: 'Description',
        columns: [
          { Header:'ID', accessor: 'id', width: 80, style:{fontWeight: 'bold'} },
          { Header:'Name', accessor: 'name' },
          { Header:'Reaction', accessor:'reactionString' }
        ]
      },
      {
        Header: 'Limits',
        columns: [
          { Header: 'Lower', accessor: 'lower_bound', width:80, filterable:false, sortable:false },
          { Header: 'Upper', accessor: 'upper_bound', width:80, filterable:false, sortable:false }
        ]
      }
    ];

    // Creation of list of reactions in chosen Model
    let selModelReactIds = [];
    if ("reactions" in this.state.chosenBaseModel) {
      selModelReactIds = this.state.chosenBaseModel.reactions.map(r=>r.id);
    }


    return (
      <div id="ModelDescription">
        <ModelForm 
          chosenBaseModel={this.state.chosenBaseModel}
          currentScen={this.state.currentScen}
          changeBaseModel={this.changeBaseModel.bind(this)}
          selModelReactIds={selModelReactIds}
        />
        <div id="model-table">
          <ReactTable 
            className="-striped -highlight"
            data={this.state.chosenBaseModel.reactions}
            columns={columns}
            filterable
            defaultPageSize={15}
            noDataText={"Please Choose a Model Above"}
            defaultFilterMethod={(filter,row,column) => {
              const id = filter.pivotId || filter.id;
              return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : false;
            }}
          />
        </div>
      </div>
    );

  }
}

export default ModelDescription;