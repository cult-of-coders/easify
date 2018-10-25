import * as React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { EasyTableModel } from './defs';
import { MoleculeModel } from 'react-molecule';
import EasyLoaderAgent from '../../agents/EasyLoaderAgent';

export interface Props {
  model: EasyTableModel;
  molecule: MoleculeModel;
  agent: EasyLoaderAgent;
}

export class EasyTableBody extends React.Component<Props> {
  renderRow(item) {
    const { model } = this.props;
    const { fields } = model;

    return fields.map(field => {
      return this.renderElement(field, item);
    });
  }

  renderElement(field, object) {
    const { EasyTableRowElement } = this.props.molecule.registry;

    let value;
    if (typeof field.resolve === 'function') {
      value = field.resolve({
        object,
        molecule: this.props.molecule,
      });
    } else {
      value = object[field.resolve];
    }

    return (
      <EasyTableRowElement key={field.label} value={value}>
        {value}
      </EasyTableRowElement>
    );
  }

  render() {
    const { model, molecule, agent } = this.props;
    const { error, data, loading } = agent.store;

    const {
      EasyTableBody,
      EasyTableRow,
      EasyTableRowElement,
      EasyTableLoading,
      EasyTableError,
      EasyTableNoFoundData,
    } = molecule.registry;

    const canShowData = !error;

    return (
      <EasyTableBody>
        {loading && (
          <EasyTableRow>
            <EasyTableRowElement colSpan={model.fields.length}>
              <EasyTableLoading />
            </EasyTableRowElement>
          </EasyTableRow>
        )}
        {error && (
          <EasyTableRow>
            <EasyTableRowElement colSpan={model.fields.length}>
              <EasyTableError error={error} />
            </EasyTableRowElement>
          </EasyTableRow>
        )}
        {canShowData &&
          !loading &&
          data.length === 0 && (
            <EasyTableRow>
              <EasyTableRowElement colSpan={model.fields.length}>
                <EasyTableNoFoundData />
              </EasyTableRowElement>
            </EasyTableRow>
          )}
        {canShowData &&
          data.length > 0 &&
          data.map(item => (
            <EasyTableRow
              key={model.key ? model.key({ object: item, molecule }) : item._id}
              item={item}
            >
              {this.renderRow(item)}
            </EasyTableRow>
          ))}
      </EasyTableBody>
    );
  }
}

export default observer(EasyTableBody);
