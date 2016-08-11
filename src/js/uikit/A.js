// Vendor
import React, { PropTypes } from 'react'
import Radium from 'radium'

// Custom
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  a: {
    color: theme.primaryLight1,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}

const A = ({ style, children, ...props }) => (
  <a style={{ ...styles.a, ...style }} {...props}>{children}</a>
)

A.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default Radium(A)
