// Vendor
import React, { PropTypes, Children } from 'react'

/*----------------------------------------------------------------------------*/

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  position: 'relative',
  outline: 'none',
}

const Row = ({ flex, wrap, style, spacing, children, ...props }) => (
  <div
    style={{
      ...baseStyle,
      flex,
      ...(wrap ? { flexWrap: 'wrap' } : {}),
      ...style,
    }}
    {...props}
  >
    {!spacing && children}
    {spacing && Children.map(children, (child, i) =>
      child && <span style={i ? { marginLeft: spacing } : {}}>{child}</span>

    )}
  </div>
)

Row.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  flex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  wrap: PropTypes.bool,
  spacing: PropTypes.string,
}

/*----------------------------------------------------------------------------*/

export default Row
