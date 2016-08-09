// Vendor
import React, { PropTypes, Children } from 'react'

// Custom
import Row from './Row'

/*----------------------------------------------------------------------------*/

const Column = ({ style, children, spacing, ...props }) => (
  <Row style={{ ...style, flexDirection: 'column' }} {...props}>
    {!spacing && children}
    {spacing && Children.map(children, (child, i) =>
      child && (
        <span
          style={{
            ...(i ? { marginTop: spacing } : {}),
            ...(child.props.style ? child.props.style : {}),
          }}
        >
          {child}
        </span>
      )

    )}
  </Row>
)

Column.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  spacing: PropTypes.string,
}

/*----------------------------------------------------------------------------*/

export default Column
