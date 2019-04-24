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
      editingReactionId: '',
      editingReactionLowerBound: 0,
      editingReactionUpperBound: 0,
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

  setEditingReaction(reaction) {
    this.setState({
      editingReactionId: reaction.id,
      editingReactionLowerBound: reaction.lower_bound,
      editingReactionUpperBound: reaction.upper_bound,
    })
  }

  handleLowerBoundChange(e) {
    this.setState({
      editingReactionLowerBound: e.target.value
    });
  }

  handleUpperBoundChange(e) {
    this.setState({
      editingReactionUpperBound: e.target.value
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
          { Header:'Reaction', accessor:'reactionString' },
          { Header:'Genes', accessor: 'gene_reaction_rule'},
        ]
      },
      {
        Header: 'Limits',
        columns: [
          { 
            Header: 'Lower', 
            Cell: (props) => {
              if (props.original.id!==this.state.editingReactionId) return props.original.lower_bound;              
              else {
                return (
                  <input 
                    type="text"
                    pattern="[0-9]+"
                    key={props.original.id}
                    value={this.state.editingReactionLowerBound} 
                    onChange={this.handleLowerBoundChange.bind(this)}/>
                )
              }
            },width:50, filterable:false, sortable:false 
          },
          { 
            Header: 'Upper',
            Cell: (props) => {
              if (props.original.id!==this.state.editingReactionId) return props.original.upper_bound;              
              else {
                return (
                  <input 
                    type="text"
                    pattern="[0-9]+" 
                    value={this.state.editingReactionUpperBound} 
                    onChange={this.handleLowerBoundChange.bind(this)}/>
                )
              }
            }, width:50, filterable:false, sortable:false 
          },
          { Header: 'Edit', 
          Cell:(props) => (
              <div 
                id="edit-button" 
                onClick={this.setEditingReaction.bind(this,props.original)}
              > Edit              
              </div>
          ),
          filterable: false, sortable: false, width:50 },
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