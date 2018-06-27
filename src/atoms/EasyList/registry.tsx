import { Registry } from 'react-molecule';
import * as React from 'react';

const EasyListLoading = () => 'Please wait...';
const EasyListError = ({ error }) => 'An error has occured';
const EasyListWrapper = props => (
  <div className="easy-list-wrapper" {...props} />
);

Registry.blend({
  EasyListLoading,
  EasyListError,
  EasyListWrapper,
});
