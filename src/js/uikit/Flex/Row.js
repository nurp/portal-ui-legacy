// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  position: 'relative',
  outline: 'none',
};

const Row = ({ flex, style, children, ...props }) => (
  <div style={{ ...baseStyle, flex, ...style }} {...props}>
    {children}
  </div>
);

Row.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  flex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

/*----------------------------------------------------------------------------*/

export default Row;
