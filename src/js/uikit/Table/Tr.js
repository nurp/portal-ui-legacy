import React, { PropTypes } from 'react';

const Tr = ({ children }) => (
  <tr>{children}</tr>
);

Tr.propTypes = {
  children: PropTypes.node,
};

export default Tr;
