import React, { Component } from 'react';
import AppContext from '../app-context';
import './ModelDescription.css';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import ModelForm from './ModelForm';


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
    // let selModelReactIds = [];
    // if ("reactions" in this.state.chosenBaseModel) {
    //   selModelReactIds = this.state.chosenBaseModel.reactions.map(r=>r.id);
    // }


    return (
      <div id="ModelDescription">
        <ModelForm 
          chosenBaseModel={this.state.chosenBaseModel}
          changeBaseModel={this.changeBaseModel.bind(this)}
        />
        <div id="model-table">
          <ReactTable 
            className="-striped -highlight"
            data={this.context.currentScen.baseModel.reactions}
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