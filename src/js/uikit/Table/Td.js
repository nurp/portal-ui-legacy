import React, { PropTypes } from 'react';

const styles = {
  td: {
    padding: '3px',
    border: '1px solid #ddd',
  },
};

const Td = ({ children }) => (
  <td style={styles.td}>{children}</td>
);

Td.propTypes = {
  children: PropTypes.node,
};

export default Td;
