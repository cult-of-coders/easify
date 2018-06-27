import { Registry } from 'react-molecule';
import * as Pagination from 'react-paginate';
import * as React from 'react';

const EasyPagination = props => {
  return <Pagination {...props} />;
};

Registry.blend({
  EasyPagination,
});
