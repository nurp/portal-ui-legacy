import React, { PropTypes } from 'react';
import theme from 'theme';

const styles = {
  card: {
    padding: '1rem',
    backgroundColor: 'white',
    border: `1px solid ${theme.greyScale4}`,
  },
};

const Card = ({ children }) => (
  <div style={styles.card}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node,
};

export default Card;
