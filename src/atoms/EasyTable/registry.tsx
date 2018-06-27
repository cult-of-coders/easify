import { Registry, withAgent } from 'react-molecule';
import * as React from 'react';

const EasyTableHead = props => {
  return <thead {...props} />;
};

const EasyTableHeadElement = props => {
  return <th {...props} />;
};

const EasyTableHeadSortUp = ({ onClick }) => <span onClick={onClick}>↑</span>;
const EasyTableHeadSortDown = ({ onClick }) => <span onClick={onClick}>↓</span>;
const EasyTable = props => {
  return <table className="table" {...props} />;
};

const EasyTableBody = props => <tbody {...props} />;
const EasyTableRow = props => <tr {...props} />;

const EasyTableRowElement = props => <td {...props} />;
const EasyTableNoFoundData = () => 'No items were found.';
const EasyTableLoading = () => 'Please wait...';
const EasyTableError = () => 'A weird error occured';

Registry.blend({
  EasyTableHead,
  EasyTableHeadElement,
  EasyTableHeadSortUp,
  EasyTableHeadSortDown,
  EasyTable,
  EasyTableBody,
  EasyTableRow,
  EasyTableRowElement,
  EasyTableNoFoundData,
  EasyTableLoading,
  EasyTableError,
});
