import React, { PropTypes } from 'react';

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  th: {
    backgroundColor: '#dedddd',
    padding: '3px',
    lineHeight: '20px',
    textAlign: 'left',
  },
};

const Table = props => (
  <table style={styles.table}>
    <thead>
      <tr>{props.columns.map(x => <th style={styles.th} key={x}>{x}</th>)}</tr>
    </thead>
    {props.body}
  </table>
);

Table.propTypes = {
  columns: PropTypes.node,
  body: PropTypes.node,
};

export default Table;
