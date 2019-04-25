import React, { Component } from 'react';
import ReactTable from 'react-table';
import AppContext from '../app-context';

export default class ModelTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingReactionId: '',
    }
    this.inputRefUpperBound = React.createRef();
    this.inputRefLowerBound = React.createRef();
  }

  static contextType = AppContext;

  setEditingReaction(reaction) {
    this.setState({
      editingReactionId: reaction.id,
    })
  }

  saveEditingReaction(reaction) {
    let lowerBound = this.inputRefLowerBound.current.value;
    let upperBound = this.inputRefUpperBound.current.value;
    if (!isNaN(lowerBound) && !isNaN(upperBound)) {
      lowerBound = Number(lowerBound);
      upperBound = Number(upperBound);
      if (lowerBound !== reaction.lower_bound || upperBound !== reaction.upper_bound) {
        this.context.addModifReactionToScen(this.context.selScenId, reaction.id, lowerBound, upperBound);
      }
      else if (reaction.id in this.context.currentScen.modifReacts) {
        this.context.removeModifReactionToScen(this.context.selScenId, reaction.id)
      }
    }
    this.setState({ editingReactionId: '' });
  }

  cellFunctionLowerLimit(props) {
    // if reaction is being edited
    let selScen = this.context.getSelScen();
    if (Object.keys(selScen).length > 0) {
      if (props.original.id === this.state.editingReactionId) {
        return (
          <input
            type="text"
            ref={this.inputRefLowerBound}
            defaultValue={props.original.lower_bound}
          />
        )
      }
      // if reaction was edited
      else if (props.original.id in selScen.modifReacts) {
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {selScen.modifReacts[props.original.id][0]}
          </span>
        )
      }
    }
    // normal reaction        
    else return props.original.lower_bound;
  }

  cellFunctionUpperLimit(props) {
    let selScen = this.context.getSelScen();
    if (Object.keys(selScen).length > 0) {
      // if reaction is being edited
      if (props.original.id === this.state.editingReactionId) {
        return (
          <input
            type="text"
            ref={this.inputRefUpperBound}
            defaultValue={props.original.upper_bound}
          />
        )
      }
      // if reaction was edited
      else if (props.original.id in selScen.modifReacts){
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {this.context.currentScen.modifReacts[props.original.id][1]}
          </span>
        )
      }
    }
    else return props.original.upper_bound;
  }

  cellFunctionEditLimits(props) {
    if (this.context.currentScen === this.context.getSelScen()) {
      if (props.original.id === this.state.editingReactionId) {
        return (
          <div
            id="save-button"
            onClick={this.saveEditingReaction.bind(this, props.original)}
          > Save
            </div>
        )
      }
      else {
        return (
          <div
            id="edit-button"
            onClick={this.setEditingReaction.bind(this, props.original)}
          > Edit
            </div>
        )
      }
    }
    else return "";
  }



  render() {
    // Creation of columns for table
    const columns = [
      {
        Header: 'Description',
        columns: [
          { Header: 'ID', accessor: 'id', width: 80, style: { fontWeight: 'bold' } },
          { Header: 'Name', accessor: 'name' },
          { Header: 'Reaction', accessor: 'reactionString' },
          { Header: 'Genes', accessor: 'gene_reaction_rule' },
        ]
      },
      {
        Header: 'Limits',
        columns: [
          {
            Header: 'Lower', Cell: this.cellFunctionLowerLimit.bind(this), width: 50, filterable: false, sortable: false
          },
          {
            Header: 'Upper', Cell: this.cellFunctionUpperLimit.bind(this), width: 50, filterable: false, sortable: false
          },
          {
            Header: 'Edit', Cell: this.cellFunctionEditLimits.bind(this), filterable: false, sortable: false, width: 50
          },
        ]
      }
    ];
    return (
      <ReactTable
        className="-striped -highlight"
        data={this.props.chosenBaseModel.reactions}
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