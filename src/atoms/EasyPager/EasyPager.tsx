import * as React from 'react';
import { withMolecule, MoleculeModel } from 'react-molecule';
import { observer } from 'mobx-react';

interface Props {
  molecule: MoleculeModel;
  agent?: string;
}

class EasyPager extends React.Component<Props> {
  pagerAgent: any;

  static defaultProps = {
    agent: 'pager',
  };

  constructor(props) {
    super(props);

    const { agent, molecule } = this.props;
    this.pagerAgent = molecule.getAgent(agent || 'pager');
  }

  onPageChange = ({ selected }) => {
    this.pagerAgent.changePage(selected);
  };

  render() {
    const { store } = this.pagerAgent;
    const { molecule } = this.props;
    const { total, currentPage, perPage } = store;

    const { EasyPagination } = molecule.registry;

    return (
      <EasyPagination
        total={total}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={this.onPageChange}
        {...this.props}
      />
    );
  }
}

export default withMolecule(observer(EasyPager));
