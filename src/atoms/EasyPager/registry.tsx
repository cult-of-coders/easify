import { Registry } from 'react-molecule';
import Pagination from '../../vendor/pagination';
import * as React from 'react';

const EasyPagination = props => {
  const { total, perPage, currentPage, onPageChange } = props;

  let pageCount = parseInt((total / perPage).toString());
  if (total % perPage) {
    pageCount++;
  }

  return (
    <Pagination
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      nextLabel={null}
      previousLabel={null}
      {...props}
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={onPageChange}
    />
  );
};

Registry.blend({
  EasyPagination,
});
