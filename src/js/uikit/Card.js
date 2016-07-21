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

const Card = ({ children, style }) => (
  <div style={{ ...styles.card, ...style }}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Card;
