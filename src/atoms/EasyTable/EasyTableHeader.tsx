import * as React from 'react';
import { MoleculeModel } from 'react-molecule';
import EasyLoaderAgent from '../../agents/EasyLoaderAgent';
import { EasyTableModel, EasyTableModelField } from './defs';

export interface Props {
  molecule: MoleculeModel;
  agent: EasyLoaderAgent;
  model: EasyTableModel;
}
export default class EasyTableHeader extends React.Component<Props> {
  state = {
    sort: {},
  };

  renderTableHeaderSort(field) {
    const {
      EasyTableHeadSortUp,
      EasyTableHeadSortDown,
    } = this.props.molecule.registry;
    const { sort } = this.state;

    const sortValue = sort[field.label];

    if (sortValue === undefined) {
      return null;
    } else if (sortValue === 1) {
      return (
        <EasyTableHeadSortUp
          onClick={() => {
            this.toggleSort(field);
          }}
        />
      );
    } else if (sortValue === -1) {
      return (
        <EasyTableHeadSortDown
          onClick={() => {
            this.toggleSort(field);
          }}
        />
      );
    }

    return null;
  }

  toggleSort = (field: EasyTableModelField) => {
    if (!field.sort) {
      return;
    }

    const { sort } = this.state;
    let newSort = Object.assign({}, sort);

    const sortValue = newSort[field.label];

    if (sortValue === undefined) {
      newSort[field.label] = 1;
    } else if (sortValue === 1) {
      newSort[field.label] = -1;
    } else if (sortValue === -1) {
      delete newSort[field.label];
    }

    this.setState(
      {
        sort: newSort,
      },
      () => {
        this.dispatchSort();
      }
    );
  };

  dispatchSort() {
    const { sort } = this.state;
    const { fields } = this.props.model;
    let sortOptions = {};
    for (let FIELD_LABEL in sort) {
      const field = fields.find(f => f.label === FIELD_LABEL);
      sortOptions[field.sort] = sort[FIELD_LABEL];
    }

    this.props.agent.update({
      options: {
        sort: sortOptions,
      },
    });
  }

  render() {
    const { molecule, model } = this.props;

    const {
      EasyTableHead,
      EasyTableHeadElement,
      EasyTableRow,
    } = molecule.registry;

    let ths = [];
    model.fields.forEach(field => {
      ths.push(
        <EasyTableHeadElement
          key={field.label}
          onClick={() => this.toggleSort(field)}
        >
          {field.label}
          {field.sort && this.renderTableHeaderSort(field)}
        </EasyTableHeadElement>
      );
    });

    if (model.actions) {
      ths.push(
        <EasyTableHeadElement key={'actions'}>
          {model.actions.label}
        </EasyTableHeadElement>
      );
    }

    return (
      <EasyTableHead>
        <EasyTableRow>{ths}</EasyTableRow>
      </EasyTableHead>
    );
  }
}
