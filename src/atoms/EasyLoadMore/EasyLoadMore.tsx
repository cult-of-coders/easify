import * as React from 'react';
import { withMolecule, MoleculeModel } from 'react-molecule';
import { Observer } from 'mobx-react';
import { EasyLoadMoreAgent } from '../../agents';

export interface Props {
  molecule: MoleculeModel;
  agent?: string;
}

class EasyLoadMore extends React.Component<Props> {
  loadMoreAgent: EasyLoadMoreAgent;

  static defaultProps = {
    agent: 'loadMore',
  };

  state = {
    sort: {},
  };

  constructor(props) {
    super(props);

    const { molecule, agent } = props;
    this.loadMoreAgent = molecule.getAgent(agent);
  }

  render() {
    const { molecule, children } = this.props;

    const { EasyLoadMoreButton } = molecule.registry;

    return (
      <Observer>
        {() => {
          const { store } = this.loadMoreAgent;

          return (
            <EasyLoadMoreButton
              hasMore={store.hasMore}
              loadMore={() => this.loadMoreAgent.load()}
              loading={this.loadMoreAgent.isLoading()}
            />
          );
        }}
      </Observer>
    );
  }
}

export default withMolecule(EasyLoadMore);
