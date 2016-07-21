// Vendor
import React, { PropTypes } from 'react';

// Custom
import Row from './Row';

/*----------------------------------------------------------------------------*/

const Column = ({ children, style, ...rest }) => (
  <Row style={{ ...style, flexDirection: 'column' }} {...rest}>
    {children}
  </Row>
);

Column.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Column;
