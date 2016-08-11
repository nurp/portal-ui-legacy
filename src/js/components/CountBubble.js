// Vendor
import React, { PropTypes } from 'react'

// Custom
import A from 'uikit/A'

/*----------------------------------------------------------------------------*/

const styles = {
  countBubble: {
    marginLeft: 'auto',
    backgroundColor: '#5b5151',
    fontSize: '1rem',
    color: 'white',
    padding: '.2em .6em .3em',
    borderRadius: '.25em',
    fontWeight: 'bold',
  },
}

const CountBubble = ({ style, children, ...props }) => (
  <A style={{ ...styles.countBubble, ...style }} {...props}>{children}</A>
)

CountBubble.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default CountBubble
