import * as React from 'react';
import { MoleculeModel, withMolecule } from 'react-molecule';
import { EasyLoaderAgent } from '../../agents';
import { getMongoFilters } from './tools';

export interface Props {
  molecule: MoleculeModel;
  agent?: string;
  schema: any;
  preFilter?: (filters) => void;
  children: ({ onSubmit, doFilter }) => any;
}

class EasyFilters extends React.Component<Props> {
  loaderAgent: EasyLoaderAgent;

  static defaultProps = {
    agent: 'loader',
  };

  constructor(props) {
    super(props);

    const { agent, molecule } = props;
    this.loaderAgent = molecule.getAgent(agent);
  }

  onSubmit = values => {
    const { schema, preFilter } = this.props;
    const filters = getMongoFilters(schema, values);

    preFilter && preFilter(filters);

    this.loaderAgent.update({
      filters,
    });
  };

  doFilter = filters => {
    const { preFilter } = this.props;

    preFilter && preFilter(filters);

    this.loaderAgent.update({
      filters,
    });
  };

  render() {
    const { children } = this.props;

    return children({
      onSubmit: this.onSubmit,
      doFilter: this.doFilter,
    });
  }
}

export default withMolecule(EasyFilters);
