import * as React from 'react';
import { withMolecule, MoleculeModel, mole } from 'react-molecule';
import { EasyTableModel } from './defs';
import EasyLoaderAgent from '../../agents/EasyLoaderAgent';
import EasyTableBody from './EasyTableBody';
import EasyTableHeader from './EasyTableHeader';

export interface Props {
  molecule: MoleculeModel;
  model: EasyTableModel;
  agent?: string;
}

class EasyTable extends React.Component<Props> {
  loaderAgent: EasyLoaderAgent;

  static defaultProps = {
    agent: 'loader',
  };

  state = {
    sort: {},
  };

  constructor(props) {
    super(props);

    const { molecule, agent } = props;
    this.loaderAgent = molecule.getAgent(agent);
  }

  onSort(sort) {
    const agent = this.loaderAgent;

    let options = agent.store.options;
    options.sort = options.sort || {};
    Object.assign(options.sort, sort);

    agent.update({
      options,
    });
  }

  render() {
    const { molecule, model } = this.props;
    const { EasyTable } = molecule.registry;

    return (
      <EasyTable>
        <EasyTableHeader
          model={model}
          molecule={molecule}
          agent={this.loaderAgent}
        />
        <EasyTableBody
          model={model}
          molecule={molecule}
          agent={this.loaderAgent}
        />
      </EasyTable>
    );
  }
}

export default withMolecule(EasyTable);
