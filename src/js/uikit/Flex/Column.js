/* @flow */
import React, { PropTypes } from 'react';

import Row from './Row';

const Column = ({ children, style, ...rest }) => (
  <Row {...rest} style={{ ...style, flexDirection: 'column' }}>
    {children}
  </Row>
);

Column.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Column;
