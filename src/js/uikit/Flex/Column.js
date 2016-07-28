// Vendor
import React, { PropTypes } from 'react'

// Custom
import Row from './Row'

/*----------------------------------------------------------------------------*/

const Column = ({ style, children, ...props }) => (
  <Row style={{ ...style, flexDirection: 'column' }} {...props}>
    {children}
  </Row>
)

Column.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default Column
