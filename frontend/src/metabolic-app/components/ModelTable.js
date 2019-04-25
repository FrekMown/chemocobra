import React, { Component } from 'react';
import ReactTable from 'react-table';
import AppContext from '../app-context';

export default class ModelTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingReactionId: '',
      editingReactionLowerBound: 0,
      editingReactionUpperBound: 0,
    }
    this.inputRefUpperBound = React.createRef();
    this.inputRefLowerBound = React.createRef();
  }

  static contextType = AppContext;

  setEditingReaction(reaction) {
    this.setState({
      editingReactionId: reaction.id,
      editingReactionLowerBound: reaction.lower_bound,
      editingReactionUpperBound: reaction.upper_bound,
    })
  }

  handleLowerBoundChange(e) {
    e.persist();
    this.setState(() => {
      console.log(e);
      this.inputRefUpperBound.current.focus();
      e.target.focus();
      return {editingReactionLowerBound: e.target.value}
    });
  }

  handleUpperBoundChange(e) {
    e.persist();
    this.setState({
      editingReactionUpperBound: e.target.value
    });
    e.target.focus();
    this.inputRefUpperBound.current.focus();
  }

  cellFunctionLowerLimit(props) {
    if (props.original.id!==this.state.editingReactionId) return props.original.lower_bound;              
    else {
      return (
        <input 
          type="text"
          pattern="[0-9]+"
          ref={this.inputRefLowerBound}
          value={this.state.editingReactionLowerBound} 
          onChange={this.handleLowerBoundChange.bind(this)}/>
      )
    }
  }

  cellFunctionUpperLimit(props) {
    if (props.original.id!==this.state.editingReactionId) return props.original.upper_bound;              
    else {
      return (
        <input 
          type="text"
          pattern="[0-9]+"
          ref={this.inputRefUpperBound}
          key="lowerBound"
          value={this.state.editingReactionUpperBound} 
          onChange={this.handleUpperBoundChange.bind(this)}
          autofocus={true}
          />
      )
    }
  }


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
            Header: 'Lower', Cell: this.cellFunctionLowerLimit.bind(this), width:50, filterable:false, sortable:false 
          },
          { 
            Header: 'Upper', Cell: this.cellFunctionUpperLimit.bind(this), width:50, filterable:false, sortable:false 
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
    return(
      <ReactTable
        className="-striped -highlight"
        data={this.context.currentScen.baseModel.reactions}
        columns={columns}
        filterable
        defaultPageSize={15}
        noDataText={"Please Choose a Model Above"}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : false;
        }}
      />
    )
  }
}