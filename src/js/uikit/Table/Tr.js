import React, { PropTypes } from 'react';

const Tr = ({ children, style }) => (
  <tr style={style}>{children}</tr>
);

Tr.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Tr;
