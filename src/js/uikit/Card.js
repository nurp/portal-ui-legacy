// Vendor
import React, { PropTypes } from 'react';

// Custom
import theme from 'theme';

/*----------------------------------------------------------------------------*/

const styles = {
  card: {
    backgroundColor: 'white',
    border: `1px solid ${theme.greyScale4}`,
  },
};

const Card = ({ style, children, ...props }) => (
  <div style={{ ...styles.card, ...style }} {...props}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Card;
