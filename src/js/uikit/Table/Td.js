// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const styles = {
  td: {
    padding: '3px',
    border: '1px solid #ddd',
  },
};

const Td = ({ children, style }) => (
  <td style={{ ...styles.td, ...style }}>{children}</td>
);

Td.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Td;
