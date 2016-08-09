// Vendor
import React, { PropTypes } from 'react'

// Custom
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  card: {
    backgroundColor: 'white',
    border: `1px solid ${theme.greyScale4}`,
  },
}

const Card = ({ style, children, title, ...props }) => (
  <div style={{ ...styles.card, ...style }} {...props}>
    {title && <div>{title}</div>}
    {children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  title: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default Card
