import * as React from 'react';
import { withMolecule, MoleculeModel } from 'react-molecule';
import EasyLoaderAgent from '../../agents/EasyLoaderAgent';
import { observer } from 'mobx-react';

export interface Props {
  molecule: MoleculeModel;
  agent?: string;
  children: (items) => any;
  autoLoadMore?: boolean;
}

class EasyList extends React.Component<Props> {
  loaderAgent: EasyLoaderAgent;

  static defaultProps = {
    agent: 'loader',
    autoLoadMore: true,
  };

  state = {
    sort: {},
  };

  constructor(props) {
    super(props);

    const { molecule, agent } = props;
    this.loaderAgent = molecule.getAgent(agent);
  }

  render() {
    const { molecule, children } = this.props;

    return (
      <EasyListItems
        store={this.loaderAgent.store}
        renderer={children}
        molecule={molecule}
      />
    );
  }
}

const EasyListItems = observer(({ store, molecule, renderer }) => {
  const { error, loading, data } = store;
  const { EasyListLoading, EasyListError, EasyListWrapper } = molecule.registry;

  if (error) {
    return (
      <EasyListWrapper>
        <EasyListError error={error} />
      </EasyListWrapper>
    );
  }

  return (
    <EasyListWrapper>{renderer({ data, molecule, loading })}</EasyListWrapper>
  );
});

export default withMolecule(EasyList);
