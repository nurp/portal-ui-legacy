// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

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

const Table = ({ columns, body, style }) => (
  <table style={{ ...styles.table, ...style }}>
    <thead>
      <tr>{columns.map(x => <th style={styles.th} key={x}>{x}</th>)}</tr>
    </thead>
    {body}
  </table>
);

Table.propTypes = {
  columns: PropTypes.node,
  body: PropTypes.node,
  style: PropTypes.object,
};

export default Table;
