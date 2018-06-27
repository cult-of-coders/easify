import * as React from 'react';
import { withMolecule, MoleculeModel } from 'react-molecule';
import { observer } from 'mobx-react';
import * as Pagination from 'react-paginate';
import EasyPagerAgent from '../../agents/EasyPagerAgent';

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

    let pageCount = parseInt((total / perPage).toString());
    if (total % perPage) {
      pageCount++;
    }

    const { EasyPagination } = molecule.registry;

    return (
      <EasyPagination
        pageCount={pageCount}
        forcePage={currentPage}
        onPageChange={this.onPageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
        nextLabel={null}
        previousLabel={null}
        {...this.props}
      />
    );
  }
}

export default withMolecule(observer(EasyPager));
