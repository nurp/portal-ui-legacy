import React, { PropTypes } from 'react';

const Table = props => (
  <table>
    <thead>
      <tr>{props.columns.map(x => <th key={x}>{x}</th>)}</tr>
    </thead>
    {props.body}
  </table>
);

Table.propTypes = {
  columns: PropTypes.node,
  body: PropTypes.node,
};

export default Table;
